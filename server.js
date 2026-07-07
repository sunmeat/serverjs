const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({origin: '*'}));

const data = {
    "name": "Олександр",
    "surname": "Загоруйко",
    "birth_date": "10 березня 1989 року",
    "location": "Одеса, Україна",
    "interests": [
        "Програмування",
        "Малювання акрилом",
        "Французька мова",
        "Вирощування авокадо",
        "Подорожі",
        "Гітара"
    ],
    "current_project": "Андроїд додаток - Навчання грі на сопілці",
    "dream": "Переїзд до Франції та подорожі",
    "facts": [
        "Викладач програмування",
        "Вважає, що викладання — це покликання, а не просто робота",
        "Користується Duolingo вже 1471+ днів для вивчення французької",
        "Любить котів і собак",
        "Вирощує авокадо, сукуленти та тангори муркотт",
        "Вважає себе схожим на сукулент, адже виживає в якихось надскладних умовах",
        "Живе в передмісті Одесі",
        "Вважає, що найважливіші речі в житті — це свобода і самореалізація, а не оце все",
        "Не любить нав’язування чужих думок і завжди залишається при своєму",
        "Часто розмірковує про долю і призначення",
        "Любить архітектуру готичних соборів і старих європейських міст",
        "Улюблений серіал - Відчайдушні домогосподарки",
        "Надихається людьми, які йдуть своїм шляхом, попри все",
        "Слухає EDM Trance та Ethnic",
        "Вважає себе інтровертом, але може бути говірким у комфортній обстановці",
        "Збудував храм Фреї (своєї кішки) та цікавиться міфологією",
        "Має 5 додатків у плеймаркеті",
        "Розробляє андроїд-додаток для вивчення гри на сопілці",
        "Грає на фортепіано, мелодиці, акордеоні/виборному баяні, сопілці/блок-флейті, варгані/дримбі, укулеле, калимбі, отаматоні, трикутнику та бубні",
        "Вивчає гру на гітарі",
        "Любить співати в караоке",
        "Намагається перенести свій старий проєкт з ActionScript на HTML/JavaScript",
        "Створював Telegram-ботів на Python та C#"
    ]
};

app.get('/api/info', (req, res) => {
    res.json(data);
});

app.get('/api/plus-one/:number', (req, res) => {
    const num = parseFloat(req.params.number);
    if (isNaN(num)) return res.status(400).json({error: 'некоректне число'});
    res.json({result: num + 1});
});

app.get('/api/sum', (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    if (isNaN(a) || isNaN(b)) return res.status(400).json({error: 'некоректні числа'});
    res.json({result: a + b});
});

app.get('/api/calculate', (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    const operation = req.query.operation;
    if (isNaN(a) || isNaN(b)) return res.status(400).json({error: 'некоректні числа'});
    let result;
    switch (operation) {
        case 'plus':
            result = a + b;
            break;
        case 'minus':
            result = a - b;
            break;
        case 'multiply':
            result = a * b;
            break;
        case 'divide':
            if (b === 0) return res.status(400).json({error: 'ділення на нуль'});
            result = a / b;
            break;
        default:
            return res.status(400).json({error: 'некоректна операція'});
    }
    res.json({result});
});

app.get('/api/exchange-rate', async (req, res) => {
    try {
        const response = await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        const rates = await response.json();
        const usdRate = rates.find(r => r.ccy === 'USD' && r.base_ccy === 'UAH');
        res.json(usdRate);
    } catch (e) {
        res.status(500).json({error: 'не вдалося отримати курс валют'});
    }
});

app.get('/api/weather/:city', async (req, res) => {
    try {
        const city = encodeURIComponent(req.params.city);
        const response = await fetch(`https://wttr.in/${city}?format=j1`);
        const weather = await response.json();
        res.json(weather.current_condition[0]);
    } catch (e) {
        res.status(500).json({error: 'не вдалося отримати прогноз погоди'});
    }
});

app.get('/api/cat', async (req, res) => {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        const catData = await response.json();
        res.json(catData[0]);
    } catch (e) {
        res.status(500).json({error: 'не вдалося отримати фото кота'});
    }
});

app.get('/api/gist', async (req, res) => {
    try {
        const response = await fetch('https://api.github.com/users/sunmeat/gists');
        const gists = await response.json();
        if (!gists.length) return res.status(404).json({error: 'гісти не знайдено'});
        const randomGist = gists[Math.floor(Math.random() * gists.length)];
        res.json(randomGist);
    } catch (e) {
        res.status(500).json({error: 'не вдалося отримати гіст'});
    }
});

app.get('/api/odesa-fact', async (req, res) => {
    try {
        const response = await fetch('https://uk.wikipedia.org/api/rest_v1/page/summary/Одеса');
        const wiki = await response.json();
        const sentences = wiki.extract.split('. ').filter(s => s.trim().length > 0);
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)].trim();
        res.json({fact: randomSentence.endsWith('.') ? randomSentence : randomSentence + '.'});
    } catch (e) {
        res.status(500).json({error: 'не вдалося отримати факт про Одесу'});
    }
});

app.get('/api/joke', async (req, res) => {
    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        const joke = await response.json();
        res.json(joke);
    } catch (e) {
        res.status(500).json({error: 'не вдалося отримати жарт'});
    }
});

app.get('/api/advice', async (req, res) => {
    try {
        const response = await fetch('https://api.adviceslip.com/advice');
        const advice = await response.json();
        res.json(advice.slip);
    } catch (e) {
        res.status(500).json({error: 'не вдалося отримати пораду'});
    }
});

app.get('/api/quote', async (req, res) => {
    try {
        const response = await fetch('https://zenquotes.io/api/random');
        const quote = await response.json();
        res.json(quote[0]);
    } catch (e) {
        res.status(500).json({error: 'не вдалося отримати цитату'});
    }
});

app.listen(port, () => {
    console.log(`Сервер запущено на порту ${port}`);
});

/*
http://localhost:3000/api/info
http://localhost:3000/api/plus-one/5
http://localhost:3000/api/sum?a=3&b=7
http://localhost:3000/api/calculate?a=10&b=2&operation=plus
http://localhost:3000/api/exchange-rate
http://localhost:3000/api/weather/Odesa
http://localhost:3000/api/cat
http://localhost:3000/api/gist
http://localhost:3000/api/odesa-fact
http://localhost:3000/api/joke
http://localhost:3000/api/advice
http://localhost:3000/api/quote
*/
