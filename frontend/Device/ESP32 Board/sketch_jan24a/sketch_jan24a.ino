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

float BPM, SpO2, Temp, Atmosphere;

WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

PulseOximeter pox;
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
uint32_t tsLastReport = 0;

void connectAWS();

void publishMessage();
void messageHandler(char* topic, byte* payload, unsigned int length);

void setup();

void loop();

void connectAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
 
  Serial.println("Connecting to Wi-Fi");
 
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
 
  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
 
  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);
 
  // Create a message handler
  client.setCallback(messageHandler);
 
  Serial.println("Connecting to AWS IOT");
  bool persist = false;
  while (!client.connect(THINGNAME, "willTopic", 1, persist, "willMessage"))
  {
    Serial.print(".");
    delay(100);
  }
 
  if (!client.connected())
  {
    Serial.println("AWS IoT Timeout!");
    return;
  }
 
  // Subscribe to a topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
 
  Serial.println("AWS IoT Connected!");
}

void publishMessage()
{
  StaticJsonDocument<200> doc;
  if(BPM > 10 || SpO2 > 30){
    doc["heartrate"] = BPM;
    doc["oxygen"] = SpO2;
    doc["temperature"] = Temp;
    doc["device_id"] = "ab436099-f9b3-4272-b6ab-3280be34d2c7";
    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer); // print to client
 
    client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
  }
 
}

void messageHandler(char* topic, byte* payload, unsigned int length)
{
  Serial.print("incoming: ");
  Serial.println(topic);
 
  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload);
  const char* message = doc["message"];
  Serial.println(message);
}

void setup()
{
  Serial.begin(115200);
  connectAWS();
  pox.begin();
  pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
  mlx.begin();
}

void loop() {
  pox.update();
  BPM = pox.getHeartRate();
  SpO2 = pox.getSpO2();
  Temp = mlx.readObjectTempC();
  Atmosphere = mlx.readAmbientTempC();

  if (millis() - tsLastReport > REPORTING_PERIOD_MS)
  {
    Serial.print("BPM: ");
    Serial.println(BPM);

    Serial.print("SpO2: ");
    Serial.print(SpO2);
    Serial.println("%");

    Serial.print("Temperature: ");
    Serial.print(Temp);

    Serial.print("Surrounding: ");
    Serial.print(Atmosphere);
    Serial.println();

    publishMessage();
    client.loop();
    tsLastReport = millis();
  }

}

