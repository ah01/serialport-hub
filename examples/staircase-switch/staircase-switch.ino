#include <Arduino.h>
#include <Bounce2.h>
#include <edushield.h>

#define RGB_R 9
#define RGB_G 5
#define RGB_B 6
#define BTN_PIN 2

#define FULL_BRIGHTNESS 50

#define INTERVAL 3000
#define FADE_INTERVAL 1000

bool state = false;
unsigned long press_millis;
String buffer;

Bounce btn(BTN_PIN, 5);

void color(byte r, byte g, byte b)
{
    analogWrite(RGB_R, 0xFF - r);
    analogWrite(RGB_G, 0xFF - g);
    analogWrite(RGB_B, 0xFF - b);
}

void color(byte v)
{
    color(v, v, v);
}

void setup()
{
    Serial.begin(9600);
    Display.set4(0, 0, 0, 0);

    buffer.reserve(20);

    pinMode(RGB_R, OUTPUT);
    pinMode(RGB_G, OUTPUT);
    pinMode(RGB_B, OUTPUT);
    color(0);
}

void btn_loop()
{
    btn.update();
    if (btn.fallingEdge())
    {
        state = true;
        press_millis = millis();
        color(FULL_BRIGHTNESS);
        Serial.println(FULL_BRIGHTNESS, DEC);

        delay(20);
        while(Serial.available()) Serial.read(); 
    }
}

void com_loop()
{
    while (Serial.available())
    {
        char x = Serial.read();

        if (x == '\r')
            continue;

        if (x == '\n')
        {
            int c = buffer.toInt();
            color(c);
            state = false;
            buffer = "";
            return;
        }

        buffer += x;
    }
}

void loop()
{
    btn_loop();
    com_loop();

    if (state)
    {
        unsigned long d = millis() - press_millis;

        if (d > (INTERVAL - FADE_INTERVAL))
        {
            int s = (d - (INTERVAL - FADE_INTERVAL));

            byte ss = map(s, 0, FADE_INTERVAL, FULL_BRIGHTNESS, 0);
            Serial.println(ss, DEC);
            color(ss);
        }

        if (d > INTERVAL)
        {
            state = false;
            Serial.println(0, DEC);
            color(0);
        }
    }

    delay(10);
}