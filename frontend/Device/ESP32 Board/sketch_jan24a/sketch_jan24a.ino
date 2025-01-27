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

// Define I2C pins for MAX30100 (using default Wire instance)
#define MAX30100_SDA 21
#define MAX30100_SCL 22

// Define I2C pins for MLX90614 (using a separate Wire instance)
#define MLX90614_SDA 4
#define MLX90614_SCL 5

float Temp, Atmosphere;
float avgBPM = 0, avgSpO2 = 0;
WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

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

void connectAWS();
void publishMessage(float avgBPM, float avgSpO2);
void messageHandler(char* topic, byte* payload, unsigned int length);
void updateMAX30100(void* parameter);

void connectAWS() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
 
  Serial.println("Connecting to Wi-Fi");
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
  client.setServer(AWS_IOT_ENDPOINT, 8883);
  client.setCallback(messageHandler);
 
  Serial.println("Connecting to AWS IOT");
  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }
 
  if (!client.connected()) {
    Serial.println("AWS IoT Timeout!");
    return;
  }
 
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
  Serial.println("AWS IoT Connected!");
}

void publishMessage() {
  StaticJsonDocument<200> doc;
  doc["heartrate"] = avgBPM;
  doc["oxygen"] = avgSpO2;
  doc["temperature"] = Temp;
  doc["device_id"] = "ab436099-f9b3-4272-b6ab-3280be34d2c7";
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
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
  connectAWS();

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

    publishMessage();
    client.loop();
    tsLastReport = millis();
  }
}
