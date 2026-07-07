import { useState } from "react";
import { Loader2, Send, Copy, Check } from "lucide-react"; // npm install lucide-react

const ENDPOINTS = [
    {
        id: "oleksandr",
        title: "/api/oleksandr",
        description: "Факти про Олександра",
        method: "GET",
        fields: [],
        buildPath: () => "/api/oleksandr",
    },
    {
        id: "plus-one",
        title: "/api/plus-one/:number",
        description: "Повертає число, більше за передане на 1",
        method: "GET",
        fields: [{ name: "number", label: "Число", type: "number", default: 5 }],
        buildPath: (v) => `/api/plus-one/${v.number}`,
    },
    {
        id: "sum",
        title: "/api/sum?a=&b=",
        description: "Сума двох чисел",
        method: "GET",
        fields: [
            { name: "a", label: "A", type: "number", default: 3 },
            { name: "b", label: "B", type: "number", default: 7 },
        ],
        buildPath: (v) => `/api/sum?a=${v.a}&b=${v.b}`,
    },
    {
        id: "calculate",
        title: "/api/calculate?a=&b=&operation=",
        description: "Арифметика над двома числами",
        method: "GET",
        fields: [
            { name: "a", label: "A", type: "number", default: 10 },
            { name: "b", label: "B", type: "number", default: 2 },
            {
                name: "operation",
                label: "Операція",
                type: "select",
                options: ["plus", "minus", "multiply", "divide"],
                default: "plus",
            },
        ],
        buildPath: (v) => `/api/calculate?a=${v.a}&b=${v.b}&operation=${v.operation}`,
    },
    {
        id: "exchange-rate",
        title: "/api/exchange-rate",
        description: "Курс гривня — долар США",
        method: "GET",
        fields: [],
        buildPath: () => "/api/exchange-rate",
    },
    {
        id: "weather",
        title: "/api/weather/:city",
        description: "Прогноз погоди в місті",
        method: "GET",
        fields: [{ name: "city", label: "Місто", type: "text", default: "Odesa" }],
        buildPath: (v) => `/api/weather/${encodeURIComponent(v.city)}`,
    },
    {
        id: "cat",
        title: "/api/cat",
        description: "Випадкове фото кота",
        method: "GET",
        fields: [],
        buildPath: () => "/api/cat",
    },
    {
        id: "gist",
        title: "/api/gist",
        description: "Випадковий гіст з GitHub (sunmeat)",
        method: "GET",
        fields: [],
        buildPath: () => "/api/gist",
    },
    {
        id: "odesa-fact",
        title: "/api/odesa-fact",
        description: "Факт про місто Одеса",
        method: "GET",
        fields: [],
        buildPath: () => "/api/odesa-fact",
    },
    {
        id: "joke",
        title: "/api/joke",
        description: "Випадковий жарт",
        method: "GET",
        fields: [],
        buildPath: () => "/api/joke",
    },
    {
        id: "advice",
        title: "/api/advice",
        description: "Випадкова життєва порада",
        method: "GET",
        fields: [],
        buildPath: () => "/api/advice",
    },
    {
        id: "quote",
        title: "/api/quote",
        description: "Випадкова мотиваційна цитата",
        method: "GET",
        fields: [],
        buildPath: () => "/api/quote",
    },
];

function EndpointCard({ endpoint, baseUrl }) {
    const initialValues = {};
    endpoint.fields.forEach((f) => (initialValues[f.name] = f.default));
    const [values, setValues] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleChange = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const runRequest = async () => {
        setLoading(true);
        setErrorMsg(null);
        setResult(null);
        setStatus(null);
        try {
            const path = endpoint.buildPath(values);
            const response = await fetch(`${baseUrl}${path}`);
            const contentType = response.headers.get("content-type") || "";
            const body = contentType.includes("application/json")
                ? await response.json()
                : await response.text();
            setStatus(response.status);
            setResult(body);
        } catch (err) {
            setErrorMsg(
                `Не вдалося виконати запит (${err.message || "невідома помилка"}). ` +
                "Перевірте: чи запущений сервер, чи правильна адреса, чи немає блокування mixed content/CORS."
            );
        } finally {
            setLoading(false);
        }
    };

    const copyResult = () => {
        const text = typeof result === "string" ? result : JSON.stringify(result, null, 2);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const imageUrl =
        result && typeof result === "object" && typeof result.url === "string" &&
        /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(result.url)
            ? result.url
            : null;

    return (
        <div className="module">
            <div className="module-top">
                <span className="dot" />
                <span className="method">{endpoint.method}</span>
                <span className="path">{endpoint.title}</span>
            </div>
            <p className="desc">{endpoint.description}</p>

            {endpoint.fields.length > 0 && (
                <div className="fields">
                    {endpoint.fields.map((f) => (
                        <label key={f.name} className="field">
                            <span>{f.label}</span>
                            {f.type === "select" ? (
                                <select
                                    value={values[f.name]}
                                    onChange={(e) => handleChange(f.name, e.target.value)}
                                >
                                    {f.options.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={f.type}
                                    value={values[f.name]}
                                    onChange={(e) => handleChange(f.name, e.target.value)}
                                />
                            )}
                        </label>
                    ))}
                </div>
            )}

            <button className="run-btn" onClick={runRequest} disabled={loading}>
                {loading ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
                {loading ? "Виконую..." : "Виконати"}
            </button>

            {status !== null && (
                <div className="result">
                    <div className="result-head">
            <span className={`status ${status >= 200 && status < 300 ? "ok" : "fail"}`}>
              {status}
            </span>
                        <button className="copy-btn" onClick={copyResult} type="button">
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? "Скопійовано" : "Копіювати"}
                        </button>
                    </div>
                    {imageUrl && <img src={imageUrl} alt="результат запиту" className="preview" />}
                    <pre>{typeof result === "string" ? result : JSON.stringify(result, null, 2)}</pre>
                </div>
            )}

            {errorMsg && <p className="error">{errorMsg}</p>}
        </div>
    );
}

export default function App() {
    const [baseUrl, setBaseUrl] = useState("https://alexodesa.vercel.app");

    return (
        <div className="rack-app">
            <style>{`
        .rack-app {
          --bg: #17181a;
          --panel: #222427;
          --panel-raised: #292c2f;
          --border: #34373b;
          --text: #ece9e4;
          --muted: #8b8f94;
          --amber: #ffb020;
          --teal: #46d9c8;
          --danger: #ff6b6b;
          box-sizing: border-box;
          min-height: 100%;
          background:
            radial-gradient(circle at 15% 10%, rgba(255,176,32,0.05), transparent 40%),
            radial-gradient(circle at 85% 90%, rgba(70,217,200,0.05), transparent 40%),
            var(--bg);
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          padding: 32px 16px 64px;
        }
        .rack-app *, .rack-app *::before, .rack-app *::after {
          box-sizing: border-box;
        }
        .rack {
          max-width: 1100px;
          margin: 0 auto;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 28px 28px 36px;
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
        .screw.tl { top: 16px; left: 16px; }
        .screw.tr { top: 16px; right: 16px; }
        .screw.bl { bottom: 16px; left: 16px; }
        .screw.br { bottom: 16px; right: 16px; }
        header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          padding-bottom: 22px;
          margin-bottom: 24px;
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
          .led, .spin { animation: none !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 0.8s linear infinite; }
        h1 {
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          letter-spacing: 0.5px;
          margin: 0 0 8px;
          display: flex;
          align-items: center;
        }
        .subtitle {
          color: var(--muted);
          font-size: 13px;
          max-width: 460px;
          line-height: 1.6;
          margin: 0;
        }
        .base-url {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--muted);
        }
        .base-url input {
          background: var(--panel-raised);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 12px;
          color: var(--text);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          min-width: 230px;
        }
        .base-url input:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 1px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .module {
          background: var(--panel-raised);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px 18px;
          transition: border-color 0.15s ease;
          display: flex;
          flex-direction: column;
        }
        .module:focus-within {
          border-color: var(--teal);
        }
        .module-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
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
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--text);
          word-break: break-all;
        }
        .desc {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.5;
          margin: 0 0 12px;
        }
        .fields {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 11px;
          color: var(--muted);
          font-family: 'JetBrains Mono', monospace;
        }
        .field input, .field select {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 6px 8px;
          color: var(--text);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          width: 100px;
        }
        .field input:focus-visible, .field select:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 1px;
        }
        .run-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--amber);
          color: var(--bg);
          border: none;
          border-radius: 8px;
          padding: 9px 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          align-self: flex-start;
          transition: filter 0.15s ease;
        }
        .run-btn:hover:not(:disabled) { filter: brightness(1.08); }
        .run-btn:disabled { opacity: 0.7; cursor: default; }
        .run-btn:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
        }
        .result {
          margin-top: 14px;
          border-top: 1px dashed var(--border);
          padding-top: 12px;
        }
        .result-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .status.ok { background: rgba(70,217,200,0.15); color: var(--teal); }
        .status.fail { background: rgba(255,107,107,0.15); color: var(--danger); }
        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
        }
        .copy-btn:hover { color: var(--text); border-color: var(--teal); }
        .copy-btn:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
        }
        .preview {
          max-width: 100%;
          border-radius: 8px;
          margin-bottom: 10px;
          display: block;
          border: 1px solid var(--border);
        }
        pre {
          margin: 0;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text);
          max-height: 220px;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .error {
          color: var(--danger);
          font-size: 12px;
          margin-top: 10px;
        }
        footer {
          text-align: center;
          color: var(--muted);
          font-size: 12px;
          margin-top: 28px;
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

            <div className="rack">
                <span className="screw tl" />
                <span className="screw tr" />
                <span className="screw bl" />
                <span className="screw br" />
                <header>
                    <div>
                        <h1><span className="led" />API RACK — ТЕСТЕР</h1>
                        <p className="subtitle">
                            Вкажіть адресу сервера та натисніть «Виконати» на потрібному модулі, щоб перевірити ендпоінт прямо тут.
                        </p>
                    </div>
                    <label className="base-url">
                        <span>АДРЕСА СЕРВЕРА</span>
                        <input
                            type="text"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder="https://alexodesa.vercel.app/"
                        />
                    </label>
                </header>
                <div className="grid">
                    {ENDPOINTS.map((ep) => (
                        <EndpointCard key={ep.id} endpoint={ep} baseUrl={baseUrl} />
                    ))}
                </div>
            </div>
        </div>
    );
}