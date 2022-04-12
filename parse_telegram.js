process.env.NTBA_FIX_319 = 1;
const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const token = 'paste your telegram-bot token from bot-father';
var bot = new TelegramBot(token, {polling: true});

const keyboard = [
    [
      {
        text: 'Temperature in Moscow ', 
        callback_data: 'weather_now' 
      }
    ],
    [
        {
          text: 'More about telegram-bot',
          callback_data: 'more'
        }
    ]
  ];

bot.on('message', (msg) => {
  const chatId = msg.chat.id; 
  bot.sendMessage(chatId, 'Hello! This telegram bot  show the temperature in Moscow', { 
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
     if (query.data === 'weather_now') { 
       let scrape = async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
                await page.goto('https://world-weather.ru/pogoda/russia/moscow/');
          await page.click('#content-left > div.weather-now.horizon > div.weather-now-info');
              const result = await page.evaluate(() => {
              let weather = document.querySelector('#weather-now-number').innerText;
                  return {
                  weather
                        }
                });
      
          browser.close();
          return result;
      };
      
      scrape().then((value) => {
      var parse_weather =JSON.stringify(value) ;

parse_weather = parse_weather.replace(/[^0-9,.+]/g, ' ');
parse_weather = parse_weather.replace(/\s/g, '');
  
          bot.sendMessage(chatId, 'Temperature in Moscow: '+ parse_weather);
        
      }); }
    if (query.data === 'more') { 
      bot.sendMessage(chatId, 'This telegram bot work with  puppeteer and telegram-bot-api');
    }

  });