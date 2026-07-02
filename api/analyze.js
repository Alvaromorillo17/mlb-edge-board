// ═══════════════════════════════════════════════════
// EDGE BOARD v2.0 - API DE ANÁLISIS
// Triple IA: Llama 3.3 + Nemotron + DeepSeek
// ═══════════════════════════════════════════════════

// ─── PARK FACTORS ─────────────────────────────────
const PARK_FACTORS = {
  "Coors Field": { runs: 1.35, hr: 1.28, desc: "Extremo bateador" },
  "Fenway Park": { runs: 1.08, hr: 0.92, desc: "Favorece hits" },
  "Yankee Stadium": { runs: 1.02, hr: 1.15, desc: "Favorece HR" },
  "Great American Ball Park": { runs: 1.08, hr: 1.18, desc: "Favorece HR" },
  "Chase Field": { runs: 1.05, hr: 1.04, desc: "Ligeramente bateador" },
  "Wrigley Field": { runs: 0.98, hr: 1.02, desc: "Neutral" },
  "Dodger Stadium": { runs: 0.92, hr: 1.05, desc: "Favorece pitchers" },
  "Petco Park": { runs: 0.88, hr: 0.85, desc: "Extremo pitcher" },
  "Oracle Park": { runs: 0.90, hr: 0.78, desc: "Extremo pitcher" },
  "T-Mobile Park": { runs: 0.86, hr: 0.82, desc: "Extremo pitcher" },
  "Citi Field": { runs: 0.89, hr: 0.88, desc: "Favorece pitchers" },
  "Busch Stadium": { runs: 0.94, hr: 0.88, desc: "Ligeramente pitcher" },
  "Tropicana Field": { runs: 0.92, hr: 0.90, desc: "Favorece pitchers" },
};

// ─── COORDENADAS DE ESTADIOS ──────────────────────
const STADIUM_COORDS = {
  "Yankee Stadium": { lat: 40.8296, lon: -73.9262 },
  "Citi Field": { lat: 40.7571, lon: -73.8458 },
  "Fenway Park": { lat: 42.3467, lon: -71.0972 },
  "Wrigley Field": { lat: 41.9484, lon: -87.6553 },
  "Guaranteed Rate Field": { lat: 41.8299, lon: -87.6335 },
  "Comerica Park": { lat: 42.3390, lon: -83.0485 },
  "Kauffman Stadium": { lat: 39.0519, lon: -94.4804 },
  "Target Field": { lat: 44.9817, lon: -93.2777 },
  "Progressive Field": { lat: 41.4962, lon: -81.6852 },
  "Dodger Stadium": { lat: 34.0739, lon: -118.2400 },
  "Angel Stadium": { lat: 33.8003, lon: -117.8827 },
  "Oracle Park": { lat: 37.7786, lon: -122.3893 },
  "Petco Park": { lat: 32.7073, lon: -117.1566 },
  "Coors Field": { lat: 39.7561, lon: -104.9941 },
  "Chase Field": { lat: 33.4455, lon: -112.0667 },
  "T-Mobile Park": { lat: 47.5915, lon: -122.3327 },
  "Globe Life Field": { lat: 32.7473, lon: -97.0845 },
  "Minute Maid Park": { lat: 29.7573, lon: -95.3555 },
  "Truist Park": { lat: 33.8908, lon: -84.4678 },
  "loanDepot park": { lat: 25.7781, lon: -80.2195 },
  "Tropicana Field": { lat: 27.7678, lon: -82.6524 },
  "Oriole Park at Camden Yards": { lat: 39.2839, lon: -76.6216 },
  "Nationals Park": { lat: 38.8730, lon: -77.0074 },
  "Citizens Bank Park": { lat: 39.9061, lon: -75.1665 },
  "PNC Park": { lat: 40.4469, lon: -80.0057 },
  "Busch Stadium": { lat: 38.6226, lon: -90.1928 },
  "American Family Field": { lat: 43.0280, lon: -87.9712 },
  "Great American Ball Park": { lat: 39.0978, lon: -84.5066 },
  "Rogers Centre": { lat: 43.6414, lon: -79.3894 },
};

// ─── LLAMAR A MODELO NVIDIA ───────────────────────
async function callNvidia(model, promptText, apiKey) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000);

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: promptText }],
        temperature: 0.1,
        max_tokens: 2048,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Error ${model}: ${response.status}`);
      return null;
    }

    const raw = await response.json();
    return raw.choices?.[0]?.message?.content;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`Error ${model}:`, err.message);
    return null;
  }
}

// ─── EXTRAER JSON ─────────────────────────────────
function extractJSON(text) {
  if (!text) return null;
  text = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(text); } catch {}
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  return null;
}

// ─── COMBINAR RESULTADOS ──────────────────────────
function combineResults(results) {
  const validResults = results.filter((r) => r !== null);
  
  if (validResults.length === 0) {
    throw new Error("Ningún modelo de IA respondió. Intenta de nuevo.");
  }

  const primary = validResults[0];
  
  // Crear conjunto de picks de otros modelos
  const otherPickKeys = new Set();
  for (let i = 1; i < validResults.length; i++) {
    (validResults[i].best_bets || []).forEach((b) => {
      otherPickKeys.add(`${b.game}|${b.type}|${b.selection}`);
    });
  }

  // Marcar picks verificados
  const enhancedBets = (primary.best_bets || []).map((bet) => {
    const key = `${bet.game}|${bet.type}|${bet.selection}`;
    if (otherPickKeys.has(key)) {
      return {
        ...bet,
        verified: true,
        confidence: Math.min(85, (bet.confidence || 65) + 5),
        reason: bet.reason + " [✅ Confirmado por múltiples modelos IA]",
      };
    }
    return bet;
  });

  // Ordenar
  enhancedBets.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  enhancedBets.forEach((bet, i) => (bet.rank = i + 1));

  const confirmedCount = enhancedBets.filter((b) => b.verified).length;

  return {
    ...primary,
    best_bets: enhancedBets,
    verified_count: confirmedCount,
    total_models: validResults.length,
    market_summary:
      (primary.market_summary || "") +
      ` [${validResults.length} modelos IA | ${confirmedCount} picks confirmados]`,
  };
}

// ─── HANDLER PRINCIPAL ────────────────────────────
export default async function handler(req, res) {
  // Configurar CORS para permitir llamadas desde el frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Usa POST" });
  }

  try {
    const { date, gamesText } = req.body;

    if (!date || !gamesText) {
      return res.status(400).json({ error: "Faltan date y gamesText" });
    }

    console.log(`📅 Analizando fecha: ${date}`);
    console.log(`📝 Juegos recibidos: ${gamesText.split('\n').length} líneas`);

    // ─── CONSTRUIR PROMPT ─────────────────────────
    const prompt = `Eres un analista sabermétrico de MLB de élite. Especialista en estadística avanzada y handicapper profesional.

FECHA: ${date}

JUEGOS DEL DÍA:
${gamesText}

PARK FACTORS DE REFERENCIA:
- Coors Field: 1.35x carreras, 1.28x HR (extremo bateador)
- Petco Park: 0.88x carreras, 0.85x HR (extremo pitcher)
- Oracle Park: 0.90x carreras, 0.78x HR (extremo pitcher)
- T-Mobile Park: 0.86x carreras, 0.82x HR (extremo pitcher)
- Yankee Stadium: 1.15x HR (favorece HR)
- Great American: 1.18x HR (favorece HR)
- Citi Field: 0.89x carreras (favorece pitchers)
- Dodgers Stadium: 0.92x carreras (favorece pitchers)

INSTRUCCIONES:
1. Analiza CADA juego listado usando métricas sabermétricas avanzadas.
2. Aplica los park factors para ajustar proyecciones de carreras y HR.
3. Solo reporta apuestas con Edge ≥ 8% vs probabilidad implícita del mercado.
4. Confianza: 60-65%=marginal, 66-72%=sólido, 73%+=fuerte. NUNCA bajo 60%.
5. Selecciona 5-8 mejores entradas rankeadas por Edge.
6. RESPONDE ÚNICAMENTE CON ESTE JSON (sin texto adicional):

{
  "date": "${date}",
  "games_analyzed": <número>,
  "bets_above_threshold": <número>,
  "market_summary": "<1 oración>",
  "best_bets": [
    {
      "rank": 1,
      "type": "<MONEYLINE | RUN LINE | OVER | UNDER | FIRST HALF>",
      "game": "<EQUIPO A vs EQUIPO B>",
      "selection": "<Selección>",
      "line": "<Línea>",
      "reason": "<2-3 oraciones con métricas y park factors>",
      "confidence": <número 60-78>,
      "edge": "<+X.X%>",
      "key_metric": "<Métrica principal>"
    }
  ],
  "props_alert": [],
  "avoid_today": "<1-2 oraciones>"
}`;

    // ─── OBTENER API KEYS ─────────────────────────
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    if (!nvidiaKey) {
      return res.status(500).json({ 
        error: "Falta NVIDIA_API_KEY en el servidor. Configúrala en Vercel > Settings > Environment Variables." 
      });
    }

    console.log("✅ NVIDIA API Key detectada");
    if (deepseekKey) console.log("✅ DeepSeek API Key detectada");
    else console.log("⚠️ DeepSeek API Key no configurada");

    // ─── LLAMAR A LOS MODELOS ─────────────────────
    const modelCalls = [
      callNvidia("meta/llama-3.3-70b-instruct", prompt, nvidiaKey),
      callNvidia("nvidia/nemotron-4-340b-instruct", prompt, nvidiaKey),
    ];

    if (deepseekKey) {
      modelCalls.push(callNvidia("meta/llama-3.1-70b-instruct", prompt, deepseekKey));
    }

    console.log(`🤖 Consultando ${modelCalls.length} modelos...`);
    const modelResults = await Promise.all(modelCalls);
    const parsedResults = modelResults.map(extractJSON);
    
    const successCount = parsedResults.filter(r => r !== null).length;
    console.log(`📊 ${successCount}/${modelCalls.length} modelos respondieron`);

    // ─── COMBINAR Y RESPONDER ─────────────────────
    const finalResult = combineResults(parsedResults);

    return res.status(200).json(finalResult);

  } catch (err) {
    console.error("❌ Error:", err.message);
    return res.status(500).json({ 
      error: err.message || "Error interno del servidor" 
    });
  }
}