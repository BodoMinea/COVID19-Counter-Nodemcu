// Configuration section

// TN1637 LED Segment Display Data pins
// SSD1406 uses hardware I2C pins D1, D2
const int CLK = D6;
const int DIO = D5;
// WiFi credentials
const char* ssid = "<<YOUR-WIFI-NETWORK-NAME>>";
const char* password = "<<YOUR-WIFI-NETWORK-PASSWORD>>";
// Serer IP Address
String server = "http://<<YOUR-SERVER-IP>>:3154";

// Code

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <TM1637Display.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_RESET -1
Adafruit_SSD1306 oled(OLED_RESET);

TM1637Display segment(CLK, DIO);
 
void setup () {
 
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  segment.setBrightness(0x0a);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(WHITE);
  oled.setTextSize(1.5);
   
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("Connecting..");
  }
 
}
 
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(server);
    int httpCode = http.GET();
    if (httpCode > 0) {
      String payload = http.getString();
      segment.showNumberDec(payload.toInt());
      Serial.println("Number: "+payload);
    }
    http.end();

    http.begin(server+"/stat");
    httpCode = http.GET();
    if (httpCode > 0) {
      String payload2 = http.getString();
      oled.clearDisplay();
      oled.setCursor(0,0);
      oled.println(payload2);
      oled.display();
      Serial.println("Details: "+payload2);
    }
    http.end();
    
  }
  delay(95000);
}
