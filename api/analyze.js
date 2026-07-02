export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Usa POST" });

  try {
    const { date, gamesText } = req.body;

    if (!date || !gamesText) {
      return res.status(400).json({ error: "Faltan date y gamesText" });
    }

    // Verificar API Key
    const apiKey = process.env.NVIDIA_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: "ERROR: NVIDIA_API_KEY no está configurada en Vercel. Ve a Settings > Environment Variables y agrégala." 
      });
    }

    console.log("✅ API Key detectada, longitud:", apiKey.length);

    const prompt = `Eres un analista sabermétrico de MLB. Especialista en estadística avanzada.

FECHA: ${date}

JUEGOS:
${gamesText}

INSTRUCCIONES:
1. Analiza CADA juego con métricas sabermétricas.
2. Solo apuestas con Edge ≥ 8%.
3. Confianza: 60-65%=marginal, 66-72%=sólido, 73%+=fuerte.
4. Selecciona 5-8 entradas.
5. RESPONDE SOLO CON ESTE JSON (sin texto adicional):

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
      "reason": "<2-3 oraciones con métricas>",
      "confidence": <número 60-78>,
      "edge": "<+X.X%>",
      "key_metric": "<Métrica>"
    }
  ],
  "props_alert": [],
  "avoid_today": "<1-2 oraciones>"
}`;

    console.log("🔄 Enviando a NVIDIA...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 2048,
      }),
    });

    clearTimeout(timeoutId);

    console.log("📡 Respuesta NVIDIA, status:", response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Error NVIDIA:", response.status, errText);
      return res.status(500).json({ 
        error: `Error NVIDIA (${response.status}): ${errText.substring(0, 200)}` 
      });
    }

    const raw = await response.json();
    const textResponse = raw.choices?.[0]?.message?.content;

    if (!textResponse) {
      console.error("❌ Respuesta vacía");
      return res.status(500).json({ error: "El modelo devolvió una respuesta vacía" });
    }

    console.log("📝 Respuesta recibida, longitud:", textResponse.length);

    // Extraer JSON
    let parsed;
    try {
      parsed = JSON.parse(textResponse);
    } catch {
      const clean = textResponse.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        try {
          parsed = JSON.parse(clean.slice(start, end + 1));
        } catch {
          return res.status(500).json({ 
            error: "No se pudo parsear el JSON. Respuesta: " + textResponse.substring(0, 300) 
          });
        }
      } else {
        return res.status(500).json({ 
          error: "La IA no devolvió JSON. Respuesta: " + textResponse.substring(0, 300) 
        });
      }
    }

    parsed.total_models = 1;
    parsed.verified_count = 0;

    console.log("✅ Éxito:", parsed.games_analyzed, "juegos,", parsed.best_bets?.length, "picks");

    return res.status(200).json(parsed);

  } catch (err) {
    console.error("❌ Error general:", err.message);
    return res.status(500).json({ 
      error: err.name === "AbortError" 
        ? "Timeout: la IA tardó más de 55 segundos. Intenta de nuevo." 
        : err.message 
    });
  }
}
