// ─── COORDENADAS DE ESTADIOS MLB ──────────────────
const STADIUM_COORDS = {
  "Yankee Stadium": { lat: 40.8296, lon: -73.9262, name: "Yankee Stadium" },
  "Citi Field": { lat: 40.7571, lon: -73.8458, name: "Citi Field" },
  "Fenway Park": { lat: 42.3467, lon: -71.0972, name: "Fenway Park" },
  "Wrigley Field": { lat: 41.9484, lon: -87.6553, name: "Wrigley Field" },
  "Guaranteed Rate Field": { lat: 41.8299, lon: -87.6335, name: "Guaranteed Rate Field" },
  "Comerica Park": { lat: 42.3390, lon: -83.0485, name: "Comerica Park" },
  "Kauffman Stadium": { lat: 39.0519, lon: -94.4804, name: "Kauffman Stadium" },
  "Target Field": { lat: 44.9817, lon: -93.2777, name: "Target Field" },
  "Progressive Field": { lat: 41.4962, lon: -81.6852, name: "Progressive Field" },
  "Dodger Stadium": { lat: 34.0739, lon: -118.2400, name: "Dodger Stadium" },
  "Angel Stadium": { lat: 33.8003, lon: -117.8827, name: "Angel Stadium" },
  "Oracle Park": { lat: 37.7786, lon: -122.3893, name: "Oracle Park" },
  "Petco Park": { lat: 32.7073, lon: -117.1566, name: "Petco Park" },
  "Coors Field": { lat: 39.7561, lon: -104.9941, name: "Coors Field" },
  "Chase Field": { lat: 33.4455, lon: -112.0667, name: "Chase Field" },
  "T-Mobile Park": { lat: 47.5915, lon: -122.3327, name: "T-Mobile Park" },
  "Globe Life Field": { lat: 32.7473, lon: -97.0845, name: "Globe Life Field" },
  "Minute Maid Park": { lat: 29.7573, lon: -95.3555, name: "Minute Maid Park" },
  "Truist Park": { lat: 33.8908, lon: -84.4678, name: "Truist Park" },
  "loanDepot park": { lat: 25.7781, lon: -80.2195, name: "loanDepot park" },
  "Tropicana Field": { lat: 27.7678, lon: -82.6524, name: "Tropicana Field" },
  "Oriole Park at Camden Yards": { lat: 39.2839, lon: -76.6216, name: "Oriole Park" },
  "Nationals Park": { lat: 38.8730, lon: -77.0074, name: "Nationals Park" },
  "Citizens Bank Park": { lat: 39.9061, lon: -75.1665, name: "Citizens Bank Park" },
  "PNC Park": { lat: 40.4469, lon: -80.0057, name: "PNC Park" },
  "Busch Stadium": { lat: 38.6226, lon: -90.1928, name: "Busch Stadium" },
  "American Family Field": { lat: 43.0280, lon: -87.9712, name: "American Family Field" },
  "Great American Ball Park": { lat: 39.0978, lon: -84.5066, name: "Great American Ball Park" },
  "Rogers Centre": { lat: 43.6414, lon: -79.3894, name: "Rogers Centre" },
};

// ─── PARK FACTORS (promedio 3 años) ───────────────
const PARK_FACTORS = {
  "Coors Field": { runs: 1.35, hr: 1.28, hits: 1.18, desc: "Extremo bateador" },
  "Fenway Park": { runs: 1.08, hr: 0.92, hits: 1.06, desc: "Favorece hits" },
  "Yankee Stadium": { runs: 1.02, hr: 1.15, hits: 0.98, desc: "Favorece HR diestros" },
  "Great American Ball Park": { runs: 1.08, hr: 1.18, hits: 1.02, desc: "Favorece HR" },
  "Chase Field": { runs: 1.05, hr: 1.04, hits: 1.03, desc: "Ligeramente bateador" },
  "Wrigley Field": { runs: 0.98, hr: 1.02, hits: 0.97, desc: "Neutral-viento" },
  "Dodger Stadium": { runs: 0.92, hr: 1.05, hits: 0.94, desc: "Favorece pitchers" },
  "Petco Park": { runs: 0.88, hr: 0.85, hits: 0.91, desc: "Extremo pitcher" },
  "Oracle Park": { runs: 0.90, hr: 0.78, hits: 0.93, desc: "Extremo pitcher" },
  "T-Mobile Park": { runs: 0.86, hr: 0.82, hits: 0.90, desc: "Extremo pitcher" },
  "Citi Field": { runs: 0.89, hr: 0.88, hits: 0.91, desc: "Favorece pitchers" },
  "Busch Stadium": { runs: 0.94, hr: 0.88, hits: 0.96, desc: "Ligeramente pitcher" },
  "PNC Park": { runs: 0.96, hr: 0.82, hits: 0.98, desc: "Neutral-pitcher" },
  "Minute Maid Park": { runs: 0.97, hr: 1.05, hits: 0.97, desc: "Neutral" },
  "Tropicana Field": { runs: 0.92, hr: 0.90, hits: 0.94, desc: "Favorece pitchers" },
};

// ─── FUNCIÓN: OBTENER CLIMA POR ESTADIO ───────────
async function getStadiumWeather(venue) {
  const coords = STADIUM_COORDS[venue];
  if (!coords) return null;

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,weather_code&timezone=auto&forecast_days=1`
    );
    const data = await res.json();

    const gameHour = 19; // 7pm hora local aprox
    const temp = data.hourly.temperature_2m[gameHour] || "N/A";
    const windSpeed = data.hourly.wind_speed_10m[gameHour] || 0;
    const windDir = data.hourly.wind_direction_10m[gameHour] || 0;
    const rainProb = data.hourly.precipitation_probability[gameHour] || 0;
    const weatherCode = data.hourly.weather_code[gameHour] || 0;

    // Determinar si el viento va hacia el outfield
    let windEffect = "neutral";
    if (windSpeed > 15) {
      windEffect = windDir > 135 && windDir < 225 ? "outfield" : "infield";
    }

    // Emoji según código meteorológico
    const weatherEmoji = weatherCode <= 3 ? "☀️" : weatherCode <= 48 ? "☁️" : weatherCode <= 67 ? "🌧️" : "⛈️";

    // Advertencia de lluvia
    const rainWarning = rainProb > 50 ? "⚠️ Alta probabilidad de lluvia" : rainProb > 25 ? "🌤️ Posible lluvia" : "";

    // Impacto en el juego
    let impact = "";
    if (windSpeed > 20 && windEffect === "outfield") impact = "🔥 Viento fuerte al outfield = más HR";
    if (windSpeed > 20 && windEffect === "infield") impact = "❄️ Viento fuerte al infield = menos HR";
    if (rainProb > 50) impact = "🌧️ Posible retraso o under";
    if (temp > 32) impact = "🔴 Calor extremo = más carreras";
    if (temp < 10) impact = "🔵 Frío = menos carreras";

    return {
      venue,
      temp,
      windSpeed,
      windDir,
      windEffect,
      rainProb,
      weatherCode,
      weatherEmoji,
      rainWarning,
      impact,
    };
  } catch {
    return null;
  }
}

// ─── FUNCIÓN: OBTENER STATS DE PITCHER ────────────
async function getPitcherStats(pitcherName) {
  try {
    const searchRes = await fetch(
      `https://statsapi.mlb.com/api/v1/people/search?names=${encodeURIComponent(pitcherName)}`
    );
    const searchData = await searchRes.json();

    if (!searchData.people || searchData.people.length === 0) return null;

    const pitcherId = searchData.people[0].id;

    const statsRes = await fetch(
      `https://statsapi.mlb.com/api/v1/people/${pitcherId}/stats?stats=season&season=2025&group=pitching`
    );
    const statsData = await statsRes.json();

    const stats = statsData.stats?.[0]?.splits?.[0]?.stat;
    if (!stats) return null;

    return {
      name: pitcherName,
      era: stats.era || "N/A",
      whip: stats.whip || "N/A",
      kPer9: stats.strikeoutsPer9Inn || "N/A",
      bbPer9: stats.baseOnBallsPer9Inn || "N/A",
      hrPer9: stats.homeRunsPer9Inn || "N/A",
      inningsPitched: stats.inningsPitched || "N/A",
      battingAvgAgainst: stats.avg || "N/A",
      opsAgainst: stats.ops || "N/A",
      wins: stats.wins || 0,
      losses: stats.losses || 0,
    };
  } catch {
    return null;
  }
}

// ─── FUNCIÓN: LLAMAR A UN MODELO DE NVIDIA ────────
async function callNvidiaModel(model, promptText, apiKey) {
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
      console.error(`Error ${model}: ${response.status} - ${errText}`);
      return null;
    }

    const raw = await response.json();
    return raw.choices?.[0]?.message?.content;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      console.error(`Timeout en ${model}`);
    } else {
      console.error(`Error en ${model}:`, err.message);
    }
    return null;
  }
}

// ─── FUNCIÓN: EXTRAER JSON DE TEXTO ───────────────
function extractJSON(text) {
  if (!text) return null;
  // Limpiar markdown
  text = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(text);
  } catch {}
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }
  return null;
}

// ─── FUNCIÓN: COMBINAR RESULTADOS DE MODELOS ──────
function combineResults(results) {
  const validResults = results.filter((r) => r !== null);

  if (validResults.length === 0) {
    throw new Error("Ningún modelo de IA pudo generar un análisis válido. Intenta de nuevo.");
  }

  if (validResults.length === 1) {
    return validResults[0];
  }

  // Tenemos múltiples resultados: combinarlos
  const primary = validResults[0];

  // Crear conjunto de picks de modelos secundarios
  const secondaryPickKeys = new Set();
  for (let i = 1; i < validResults.length; i++) {
    (validResults[i].best_bets || []).forEach((b) => {
      secondaryPickKeys.add(`${b.game}|${b.type}|${b.selection}`);
    });
  }

  // Marcar picks confirmados por múltiples modelos
  const totalModels = validResults.length;
  const enhancedBets = (primary.best_bets || []).map((bet) => {
    const key = `${bet.game}|${bet.type}|${bet.selection}`;
    if (secondaryPickKeys.has(key)) {
      const bonus = totalModels >= 3 ? 7 : 5;
      return {
        ...bet,
        verified: true,
        confidence: Math.min(85, (bet.confidence || 65) + bonus),
        reason: bet.reason + ` [✅ Confirmado por ${totalModels} modelos IA]`,
      };
    }
    return bet;
  });

  // Ordenar por confianza
  enhancedBets.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  enhancedBets.forEach((bet, i) => (bet.rank = i + 1));

  const confirmedCount = enhancedBets.filter((b) => b.verified).length;

  return {
    ...primary,
    best_bets: enhancedBets,
    market_summary:
      (primary.market_summary || "") +
      ` [🤖 ${totalModels} modelos IA | ✅ ${confirmedCount} picks confirmados]`,
  };
}

// ─── HANDLER PRINCIPAL ────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  try {
    const { date, gamesText, venues, pitchers } = req.body;

    if (!date || !gamesText) {
      return res.status(400).json({ error: "Faltan datos: date y gamesText son requeridos." });
    }

    // ─── 1. OBTENER DATOS ENRIQUECIDOS ────────────
    console.log(`📅 Analizando ${date}...`);

    // Clima por estadio
    const weatherPromises = (venues || []).map((v) => getStadiumWeather(v));
    const weatherResults = await Promise.all(weatherPromises);
    const weatherData = weatherResults.filter((w) => w !== null);

    // Stats de pitchers
    const pitcherPromises = (pitchers || []).map((p) => getPitcherStats(p));
    const pitcherResults = await Promise.all(pitcherPromises);
    const pitcherData = pitcherResults.filter((p) => p !== null);

    // Park factors para los venues
    const parkData = (venues || [])
      .map((v) => ({
        venue: v,
        factors: PARK_FACTORS[v] || { runs: 1.0, hr: 1.0, hits: 1.0, desc: "Neutral" },
      }))
      .filter((p) => p.factors.runs !== 1.0 || p.venue === "Coors Field"); // Incluir datos relevantes

    // ─── 2. CONSTRUIR PROMPT ENRIQUECIDO ──────────
    let enrichedPrompt = `Eres un analista sabermétrico de MLB de élite. Especialista en estadística avanzada y handicapper profesional.

FECHA: ${date}

═══ DATOS DE JUEGOS ═══
${gamesText}

═══ CLIMA POR ESTADIO ═══
${weatherData.map(w => `${w.venue}: ${w.weatherEmoji} ${w.temp}°C | Viento: ${w.windSpeed} km/h (${w.windEffect}) | Lluvia: ${w.rainProb}% ${w.rainWarning}${w.impact ? ' → ' + w.impact : ''}`).join('\n') || 'No disponible'}

═══ ESTADÍSTICAS DE PITCHERS ═══
${pitcherData.map(p => `${p.name}: ERA ${p.era} | WHIP ${p.whip} | K/9 ${p.kPer9} | BB/9 ${p.bbPer9} | HR/9 ${p.hrPer9} | IP ${p.inningsPitched} | OPS rival ${p.opsAgainst}`).join('\n') || 'No disponible'}

═══ PARK FACTORS ═══
${parkData.map(p => `${p.venue}: Carreras ${p.factors.runs}x | HR ${p.factors.hr}x | Hits ${p.factors.hits}x (${p.factors.desc})`).join('\n') || 'No disponible'}

INSTRUCCIONES:
1. Analiza los juegos usando TODOS los datos proporcionados (stats reales, clima, park factors).
2. Solo reporta apuestas con Edge ≥ 8% vs probabilidad implícita.
3. Confianza: 60-65%=marginal, 66-72%=sólido, 73%+=fuerte. NO bajo 60%.
4. El clima impacta: viento >15km/h al outfield = más HR/carreras. Lluvia >40% = under probable. Temp >32°C = más carreras.
5. Park factors: Coors (1.35x), Petco (0.88x), Oracle (0.90x) ajustan proyecciones.
6. Selecciona 5-8 mejores entradas rankeadas por Edge.
7. RESPONDE SOLO CON JSON. Sin markdown, sin explicaciones.`;

    const jsonFormat = `
{
  "date": "${date}",
  "games_analyzed": <número>,
  "bets_above_threshold": <número>,
  "market_summary": "<1 oración sobre condiciones del día>",
  "best_bets": [
    {
      "rank": 1,
      "type": "<MONEYLINE | RUN LINE | OVER | UNDER | FIRST HALF>",
      "game": "<EQUIPO A vs EQUIPO B>",
      "selection": "<Selección>",
      "line": "<Línea>",
      "reason": "<2-3 oraciones con métricas, clima y park factors>",
      "confidence": <número 60-78>,
      "edge": "<+X.X%>",
      "key_metric": "<Métrica principal>"
    }
  ],
  "props_alert": [],
  "avoid_today": "<1-2 oraciones>"
}`;

    const finalPrompt = enrichedPrompt + "\n\n" + jsonFormat;

    // ─── 3. LLAMAR A LOS 3 MODELOS ────────────────
    console.log("🤖 Consultando modelos de IA...");

    const nvidiaKey = process.env.NVIDIA_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    if (!nvidiaKey) {
      throw new Error("Falta NVIDIA_API_KEY en variables de entorno");
    }

    // Preparar llamadas a modelos
    const modelCalls = [
      // Modelo principal: Llama 3.3 70B con API key de NVIDIA
      callNvidiaModel("meta/llama-3.3-70b-instruct", finalPrompt, nvidiaKey),

      // Modelo secundario: Nemotron con API key de NVIDIA
      callNvidiaModel("nvidia/nemotron-4-340b-instruct", finalPrompt, nvidiaKey),
    ];

    // Agregar DeepSeek si la API key está disponible
    if (deepseekKey) {
      modelCalls.push(
        callNvidiaModel("meta/llama-3.1-70b-instruct", finalPrompt, deepseekKey)
      );
      console.log("✅ DeepSeek API key detectada - usando 3 modelos");
    } else {
      console.log("⚠️ DeepSeek API key no configurada - usando 2 modelos");
    }

    // Ejecutar todos los modelos en paralelo
    const modelResults = await Promise.all(modelCalls);

    // Extraer JSON de cada resultado
    const parsedResults = modelResults.map((text) => extractJSON(text));

    console.log(
      `📊 Resultados: ${parsedResults.filter((r) => r !== null).length}/${modelCalls.length} modelos respondieron`
    );

    // ─── 4. COMBINAR RESULTADOS ────────────────────
    const finalResult = combineResults(parsedResults);

    // Agregar metadata
    finalResult.models_used = parsedResults.filter((r) => r !== null).length;
    finalResult.weather_stations = weatherData.length;
    finalResult.pitchers_analyzed = pitcherData.length;

    return res.status(200).json(finalResult);
  } catch (err) {
    console.error("❌ Error:", err.message);
    return res.status(500).json({
      error: err.name === "AbortError" ? "Tiempo de espera agotado" : err.message,
    });
  }
}