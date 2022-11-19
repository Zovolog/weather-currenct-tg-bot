const axios = require("axios");

const TelegramBot = require("node-telegram-bot-api");
const token = "5633489700:AAFtMs7tQVh9oPrQ1I9CEZb5OYW6RBGE6wQ";

const bot = new TelegramBot(token, { polling: true });
const months = [
  "Лютого",
  "Січня",
  "Березня",
  "Квітня",
  "Травня",
  "Червня",
  `Липня`,
  `Серпня`,
  `Вересня`,
  `Жовтня`,
  `Листопада`,
  `Грудня`,
];

function timeConverterHourly(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var hour = a.getHours();
  var min = a.getMinutes();
  if (min >= 0 && min < 10) {
    min = `0${min}`;
  }
  var day = a.getDate();
  var month = a.getMonth();
  var year = a.getFullYear();

  let date = `${day}.${month + 1}.${year}`;
  var myDate = new Date(date.replace(/(\d+).(\d+).(\d+)/, "$3/$2/$1"));
  let dayOfWeek = [
    "Неділя",
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четверг",
    "понеділок",
    "Субота",
  ][myDate.getDay()];

  let hours = `${hour}:${min}`;
  let time = ` ${hours}, ${day} ${months[a.getMonth()]}`;
  return time;
}

function getCurrentTime(response, num) {
  return `\n ${timeConverterHourly(response.data.hourly[num].dt)}: ${Math.round(
    response.data.hourly[num].temp
  )}°C, відчувається як: ${Math.round(
    response.data.hourly[num].feels_like
  )}°C, ${response.data.hourly[num].weather[0].description}`;
}

function showAllWeathers(response, interval) {
  let res = ``;
  let n = 48;

  for (let i = 0; i < n; i++) {
    if (i % interval === 0) {
      res += `${getCurrentTime(response, i)}`;
    }
  }
  return res;
}

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text === "/start") {
    bot.sendMessage(chatId, `Вітаю ${msg.chat.first_name}`);
    mainMenu(chatId);
  } else if (text === "показати погоду київ") {
    weatherFuncs(chatId);
  } else if (text === "погода з інтервалом в 3 години") {
    axios(
      `https://api.openweathermap.org/data/2.5/onecall?lat=50.433334&lon=30.516666&exclude=minutely&units=metric&appid=e22539825a78a3e4b495f6d23b7ca7c7&lang=ru`
    ).then(function (response) {
      bot.sendMessage(
        chatId,
        `Погода в Києві: \n${showAllWeathers(response, 3)}`
      );
    });
  } else if (text === "погода з інтервалом в 6 годин") {
    axios(
      `https://api.openweathermap.org/data/2.5/onecall?lat=50.433334&lon=30.516666&exclude=minutely&units=metric&appid=e22539825a78a3e4b495f6d23b7ca7c7&lang=ru`
    ).then(function (response) {
      bot.sendMessage(
        chatId,
        `Погода в Києві:\n${showAllWeathers(response, 6)}`
      );
    });
  } else if (text === "показати курс валют") {
    curencyFuncs(chatId);
  } else if (text === "usd $") {
    axios(`https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5`).then(
      function (response) {
        bot.sendMessage(
          chatId,
          `Купляють: ${parseFloat(
            response.data[1].buy
          )} \nПродають: ${parseFloat(response.data[1].sale)}`
        );
      }
    );
  } else if (text === "eur €") {
    axios(`https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5`).then(
      function (response) {
        bot.sendMessage(
          chatId,
          `Купляють: ${parseFloat(
            response.data[0].buy
          )} \nПродають: ${parseFloat(response.data[0].sale)}`
        );
      }
    );
  } else if (text === "в головне меню") {
    mainMenu(chatId);
  } else {
    bot.sendMessage(
      chatId,
      "Для роботи введіть команду /start або нажміть на меню"
    );
  }
});

function curencyFuncs(chatId) {
  bot.sendMessage(chatId, "Виберіть валюту", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "USD $",
          },
          {
            text: "EUR €",
          },
        ],
        [
          {
            text: "В головне меню",
          },
        ],
      ],
    },
  });
}

function weatherFuncs(chatId) {
  bot.sendMessage(chatId, "Виберіть інтервал погоди", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Погода з інтервалом в 3 години",
          },
          {
            text: "Погода з інтервалом в 6 годин",
          },
        ],
        [
          {
            text: "В головне меню",
          },
        ],
      ],
    },
  });
}

function mainMenu(chatId) {
  bot.sendMessage(chatId, "Клава відкрита", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Показати погоду Київ",
          },
        ],
        [
          {
            text: "Показати курс валют",
          },
        ],
      ],
    },
  });
}
