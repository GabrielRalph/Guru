#include <FirebaseESP8266.h>
#include <FirebaseESP8266HTTPClient.h>

#include <ESP8266WiFi.h>
#define DOOR1 4
#define DOOR2 5

int lockStates = 0;
int delays[8] = {0, 0, 0, 0, 0, 0, 0, 0};
const char* host = "myiot-41369.firebaseio.com";
const char* ssid = "Stucco";
const char* password = "occutsstucco";
 
int r = 4; // GPIO13
int y = 5;
int g = 16;

WiFiServer server(80);
FirebaseData fire;
FirebaseData fire2;
void setup() {
  Serial.begin(115200);
  delay(10);

 // pinMode(5, OUTPUT);
    pinMode(DOOR1, OUTPUT);
    pinMode(DOOR2, OUTPUT);
  //pinMode(2, OUTPUT);
 
  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
 
  // Start the server
  server.begin();
  Serial.println("Server started");
 
  // Print the IP address
  Serial.print("Use this URL to connect: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");
  Firebase.begin(host, "sYsIJURxcVcbJTkYCVqdRHU1J8YSt5oJLnmrZvo0");
  if(!Firebase.beginStream(fire, "/stucco")){
    Serial.println(fire.errorReason());
  }
  
}
const char* coffee = "/stucco/coffee";
const char* door = "/stucco/door";
String jsonObj = "{\"lockx\":false}";
bool val = false;
int doorDelay = 0;
long int checkDelay = 0;
void loop() {
  
  Firebase.readStream(fire);
  if(fire.streamAvailable()){
      if(fire.dataType() == "json"){
        char locks = readLocks(fire.jsonData());
        lockStates ^= locks;
        Serial.println(lockStates);
        for(int i = 0; i < 8; i++){
          if( (1<<i)&locks ){
            delays[i] = millis();
          }
        }
      }
    }else{
      //Serial.println(fire.errorReason());
    }
  for(int i = 0; i < 8; i++){
    if( ((1<<i)&lockStates)&&(millis() - delays[i] > 4000)){
      lockStates ^= (1<<i);
      jsonObj[6] = '0'+i;
      if(!Firebase.updateNode(fire2, "stucco/locks", jsonObj)) Serial.println(fire2.errorReason());

      Serial.println(jsonObj);
    }
  }
  digitalWrite(DOOR1, (lockStates&1));
  digitalWrite(DOOR2, ((lockStates>>1)&1));
}
