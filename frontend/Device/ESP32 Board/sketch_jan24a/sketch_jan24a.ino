#include <Arduino.h>
#include "secret.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include "MAX30100_PulseOximeter.h"
#include <Adafruit_MLX90614.h>

#define AWS_IOT_PUBLISH_TOPIC   "esp32/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "esp32/sub"
#define REPORTING_PERIOD_MS     5000
#define RECONNECT_INTERVAL_MS   5000
#define PUBLISH_RETRY_MS        100
#define MAX_PENDING_READINGS    720  // About one hour at one reading every 5 seconds

// Define I2C pins for MAX30100 (using default Wire instance)
#define MAX30100_SDA 21
#define MAX30100_SCL 22

// Define I2C pins for MLX90614 (using a separate Wire instance)
#define MLX90614_SDA 4
#define MLX90614_SCL 5

float Temp, Atmosphere;
WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

struct HealthReading {
  float heartrate;
  float oxygen;
  float temperature;
};

HealthReading pendingReadings[MAX_PENDING_READINGS];
int pendingHead = 0;
int pendingTail = 0;
int pendingCount = 0;
uint32_t lastReconnectAttempt = 0;
uint32_t lastPublishAttempt = 0;

// Create a separate Wire instance for MLX90614
TwoWire I2C_MLX90614 = TwoWire(1);

PulseOximeter pox;
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
uint32_t tsLastReport = 0;

// Buffers to store last 5 valid readings
float bpmBuffer[5] = {0};
float spo2Buffer[5] = {0};
int bufferIndex = 0;  // Circular buffer index
int validCount = 0;   // Number of valid readings

void configureConnections();
void maintainConnections();
bool connectAWS();
bool publishMessage(const HealthReading& reading);
bool enqueueReading(float heartrate, float oxygen, float temperature);
void flushPendingReadings();
void messageHandler(char* topic, byte* payload, unsigned int length);
void updateMAX30100(void* parameter);

void configureConnections() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
  client.setServer(AWS_IOT_ENDPOINT, 8883);
  client.setCallback(messageHandler);

  Serial.println("Wi-Fi and AWS IoT configured");
}

bool connectAWS() {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }

  Serial.println("Connecting to AWS IoT...");
  if (!client.connect(THINGNAME)) {
    Serial.print("AWS IoT connection failed, state: ");
    Serial.println(client.state());
    return false;
  }

  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
  Serial.println("AWS IoT connected");
  return true;
}

void maintainConnections() {
  if (WiFi.status() != WL_CONNECTED) {
    if (millis() - lastReconnectAttempt >= RECONNECT_INTERVAL_MS) {
      lastReconnectAttempt = millis();
      Serial.println("Wi-Fi disconnected; reconnecting...");
      WiFi.reconnect();
    }
    return;
  }

  if (!client.connected()) {
    if (millis() - lastReconnectAttempt >= RECONNECT_INTERVAL_MS) {
      lastReconnectAttempt = millis();
      connectAWS();
    }
    return;
  }

  client.loop();
}

bool publishMessage(const HealthReading& reading) {
  StaticJsonDocument<200> doc;
  doc["heartrate"] = reading.heartrate;
  doc["oxygen"] = reading.oxygen;
  doc["temperature"] = reading.temperature;
  doc["device_id"] = "ab436099-f9b3-4272-b6ab-3280be34d2c7";
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  return client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}

bool enqueueReading(float heartrate, float oxygen, float temperature) {
  if (pendingCount == MAX_PENDING_READINGS) {
    Serial.println("Reading queue is full; keeping previously queued patient data");
    return false;
  }

  pendingReadings[pendingTail] = {heartrate, oxygen, temperature};
  pendingTail = (pendingTail + 1) % MAX_PENDING_READINGS;
  pendingCount++;
  return true;
}

void flushPendingReadings() {
  if (!client.connected() || pendingCount == 0 ||
      millis() - lastPublishAttempt < PUBLISH_RETRY_MS) {
    return;
  }

  lastPublishAttempt = millis();
  if (publishMessage(pendingReadings[pendingHead])) {
    pendingHead = (pendingHead + 1) % MAX_PENDING_READINGS;
    pendingCount--;
    Serial.print("Reading published; pending readings: ");
    Serial.println(pendingCount);
  } else {
    Serial.println("Publish failed; reading kept for retry");
  }
}

void messageHandler(char* topic, byte* payload, unsigned int length) {
  Serial.print("incoming: ");
  Serial.println(topic);
  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload);
  const char* message = doc["message"];
  Serial.println(message);
}

void updateMAX30100(void* parameter) {
  for (;;) {
    pox.update(); // Update the MAX30100 sensor
    delay(1);     // Small delay to prevent task starvation
  }
}

void setup() {
  Serial.begin(115200);
  configureConnections();

  Wire.begin(MAX30100_SDA, MAX30100_SCL);
  if (!pox.begin()) {
    Serial.println("MAX30100 initialization failed!");
    while (1);
  }
  pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
  Serial.println("MAX30100 initialized successfully!");

  I2C_MLX90614.begin(MLX90614_SDA, MLX90614_SCL);
  if (!mlx.begin(0x5A, &I2C_MLX90614)) {
    Serial.println("MLX90614 initialization failed!");
    while (1);
  }
  Serial.println("MLX90614 initialized successfully!");

  xTaskCreatePinnedToCore(
    updateMAX30100,
    "MAX30100_Task",
    10000,
    NULL,
    1,
    NULL,
    1
  );
}

void loop() {
  maintainConnections();
  flushPendingReadings();

  float bpm = pox.getHeartRate();
  float spo2 = pox.getSpO2();
  Temp = mlx.readObjectTempC();
  Atmosphere = mlx.readAmbientTempC();

  // Only store valid readings (non-zero)
  if (bpm > 10 && spo2 > 30) {
    bpmBuffer[bufferIndex] = bpm;
    spo2Buffer[bufferIndex] = spo2;
    bufferIndex = (bufferIndex + 1) % 5; // Circular buffer
    validCount = min(validCount + 1, 5); // Track valid readings up to 5
  }

  if (millis() - tsLastReport > REPORTING_PERIOD_MS && validCount == 5) {
    float avgBPM = 0;
    float avgSpO2 = 0;

    for (int i = 0; i < validCount; i++) {
      avgBPM += bpmBuffer[i];
      avgSpO2 += spo2Buffer[i];
    }
    avgBPM /= validCount;
    avgSpO2 /= validCount;

    Serial.print("BPM: ");
    Serial.println(avgBPM);

    Serial.print("SpO2: ");
    Serial.println(avgSpO2);

    Serial.print("Temperature: ");
    Serial.println(Temp);

    Serial.print("Surrounding: ");
    Serial.println(Atmosphere);
    Serial.println("-------------------");

    if (enqueueReading(avgBPM, avgSpO2, Temp)) {
      Serial.print("Reading queued; pending readings: ");
      Serial.println(pendingCount);
    }

    flushPendingReadings();
    tsLastReport = millis();
  }
}
