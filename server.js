const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({origin: '*'}));

app.get('/api/endpoints', (req, res) => {
    res.json({
        message: 'Це API-сервер. Будь ласка, надсилайте запити з клієнтської сторони (браузер, Postman, fetch тощо) на конкретні ендпоінти нижче',
        endpoints: [
            'GET /api/oleksandr',
            'GET /api/plus-one/:number',
            'GET /api/sum?a=&b=',
            'GET /api/calculate?a=&b=&operation=',
            'GET /api/exchange-rate',
            'GET /api/weather/:city',
            'GET /api/cat',
            'GET /api/gist',
            'GET /api/odesa-fact',
            'GET /api/joke',
            'GET /api/advice',
            'GET /api/quote'
        ]
    });
});

/* app.get('/api/file', (req, res) => {
    const filePath = 'C:\\1\\test.txt';

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(404).json({ error: 'Файл test.txt не знайдено' });
        }
    });
}); */

app.get('/', (req, res) => {
    res.type('html').send(`<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>API Rack - панель ендпоінтів</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
    :root {
        --bg: #17181a;
        --panel: #222427;
        --panel-raised: #292c2f;
        --border: #34373b;
        --text: #ece9e4;
        --muted: #8b8f94;
        --amber: #ffb020;
        --teal: #46d9c8;
    }
    * { box-sizing: border-box; }
    body {
        margin: 0;
        background:
            radial-gradient(circle at 15% 10%, rgba(255,176,32,0.05), transparent 40%),
            radial-gradient(circle at 85% 90%, rgba(70,217,200,0.05), transparent 40%),
            var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
        padding: 40px 20px 80px;
    }
    .rack {
        max-width: 980px;
        margin: 0 auto;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 32px 32px 40px;
        position: relative;
        box-shadow: 0 30px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03);
    }
    .screw {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #55585c, #101112 70%);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.6);
    }
    .screw::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 15%;
        right: 15%;
        height: 1px;
        background: rgba(0,0,0,0.7);
        transform: rotate(35deg);
    }
    .screw.tl { top: 16px; left: 16px; }
    .screw.tr { top: 16px; right: 16px; }
    .screw.bl { bottom: 16px; left: 16px; }
    .screw.br { bottom: 16px; right: 16px; }
    header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
        padding-bottom: 24px;
        margin-bottom: 28px;
        border-bottom: 1px dashed var(--border);
    }
    .led {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--amber);
        box-shadow: 0 0 8px 2px rgba(255,176,32,0.7);
        display: inline-block;
        margin-right: 10px;
        animation: pulse 2.4s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
        .led { animation: none; }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.35; }
    }
    h1 {
        font-family: 'JetBrains Mono', monospace;
        font-size: 26px;
        letter-spacing: 0.5px;
        margin: 0 0 8px;
        display: flex;
        align-items: center;
    }
    .subtitle {
        color: var(--muted);
        font-size: 14px;
        max-width: 460px;
        line-height: 1.6;
        margin: 0;
    }
    .subtitle strong {
        color: var(--teal);
        font-weight: 600;
    }
    .badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: var(--muted);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 6px 14px;
        white-space: nowrap;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 14px;
    }
    .module {
        background: var(--panel-raised);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 16px 18px;
        transition: border-color 0.15s ease, transform 0.15s ease;
    }
    .module:hover, .module:focus-within {
        border-color: var(--teal);
        transform: translateY(-2px);
    }
    .module-top {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
    }
    .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--teal);
        flex-shrink: 0;
    }
    .method {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: var(--bg);
        background: var(--amber);
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 700;
    }
    .path {
        display: block;
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        color: var(--text);
        text-decoration: none;
        word-break: break-all;
        margin-bottom: 8px;
    }
    .path:hover, .path:focus-visible {
        color: var(--teal);
        outline: none;
    }
    .desc {
        font-size: 13px;
        color: var(--muted);
        line-height: 1.5;
        margin: 0;
    }
    footer {
        text-align: center;
        color: var(--muted);
        font-size: 12px;
        margin-top: 32px;
        font-family: 'JetBrains Mono', monospace;
    }
</style>
</head>
<body>
    <div class="rack">
        <span class="screw tl"></span>
        <span class="screw tr"></span>
        <span class="screw bl"></span>
        <span class="screw br"></span>
        <header>
            <div>
                <h1><span class="led"></span>API RACK</h1>
                <p class="subtitle">Це сервер, а не сторінка для перегляду. <strong>Надсилайте запити з клієнтської сторони</strong> — з коду, Postman або просто перейшовши за посиланням ендпоінта нижче.</p>
            </div>
        </header>
        <div class="grid">
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/oleksandr">/api/oleksandr</a>
                <p class="desc">Факти про Олександра</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/plus-one/5">/api/plus-one/:number</a>
                <p class="desc">Повертає число, більше за передане на 1</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/sum?a=3&b=7">/api/sum?a=&b=</a>
                <p class="desc">Сума двох чисел, переданих параметрами</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/calculate?a=10&b=2&operation=plus">/api/calculate?a=&b=&operation=</a>
                <p class="desc">Результат операції +, -, * або / над двома числами</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/exchange-rate">/api/exchange-rate</a>
                <p class="desc">Поточний курс гривня — долар США</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/weather/Odesa">/api/weather/:city</a>
                <p class="desc">Прогноз погоди в місті за назвою</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/cat">/api/cat</a>
                <p class="desc">Випадкове фото кота</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/gist">/api/gist</a>
                <p class="desc">Випадковий гіст з акаунту sunmeat на GitHub</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/odesa-fact">/api/odesa-fact</a>
                <p class="desc">Випадковий факт про місто Одеса</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/joke">/api/joke</a>
                <p class="desc">Випадковий жарт</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/advice">/api/advice</a>
                <p class="desc">Випадкова життєва порада</p>
            </div>
 
            <div class="module">
                <div class="module-top"><span class="dot"></span><span class="method">GET</span></div>
                <a class="path" href="/api/quote">/api/quote</a>
                <p class="desc">Випадкова мотиваційна цитата</p>
            </div>
        </div>
    </div>
</body>
</html>`);
});

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
        "Користується Duolingo вже 1471+ днів для вивчення французької / гри в шахи",
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
        "Намагається перенести свій старий проєкт з ActionScript на HTML/JavaScript",
        "Створював Telegram-ботів на Python та C#",
        "Любить співати в караоке"
    ]
};

app.get('/api/oleksandr', (req, res) => {
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

/* // local endpoints:
http://localhost:3000/api/oleksandr
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
