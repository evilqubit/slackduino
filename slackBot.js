"use strict";
var five = require("johnny-five");
var slackbot = require('node-slackbot');
var instapush = require('instapush');
var board = new five.Board();
var interval = 10000;
var botToken = 'xoxp-9516404964-9516556162-15114474725-9db92bb94e';
var tune =  "C D F D A -";
var insta_conf = {
    id: '56526ab1a4c48a556277d867',
    secret:'9e254fca6cade4af24f0784f2ec7af3b',
    token: '56526ab1a4c48a556277d867'
};

//add instapush to slackbot 
//insta check in app
board.on("ready", function () {
    instapush.settings({
        id: insta_conf.id,
        secret: insta_conf.secret,
        token: insta_conf.token
    });

    var piezo = new five.Piezo(6),
        led = new five.Led.RGB({
            pins: {
                red: 11,
                green: 5,
                blue: 3
            }
        }),
        bot = new slackbot(botToken),
        notify = function (user, text) {
            instapush.notify({
                "event": "robot",
                "trackers": {
                    "user": user,
                    "event": text
                }
            }, function (err, response) {
                console.log(err, response);
            });
        };


    bot.use(function (msg, cb) {
        if (msg.type === 'message') {
            console.log(msg.user + ' said: ' + msg.text, msg);
            if (msg.text === 'turn on') {
                led.on();
                led.color("#FF0000");
                led.blink(500);
                piezo.play({
                    song: tune,
                    beats: 1 / 4,
                    temp: 100
                });
                notify(msg.user, msg.text);
            } else if (msg.text === 'turn off') {
                led.stop().off();
                notify(msg.user, msg.text);
            }
        }
        cb();
    });
    bot.connect();
});
