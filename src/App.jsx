import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════

const ACCENT = "#C8F135";
const BG = "#0A0E0A";
const SURFACE = "#111611";
const BORDER = "#1E2A1E";
const TEXT = "#E8F0E8";
const MUTED = "#6B7F6B";

const API_NVIDIA = "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";
const API_DEEPSEEK = "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";
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbx5i2CeO8Hz5KsawAsEoMSjpqaQbpDQvxbS3AUcD-KEfXTc1ST6SLw24zAuV5EGNZo/exec";

// ═══════════════════════════════════════════════════
// PARK FACTORS
// ═══════════════════════════════════════════════════

const PARK_FACTORS = {
  "Coors Field": { runs: 1.35, hr: 1.28, desc: "Extremo bateador" },
  "Fenway Park": { runs: 1.08, hr: 0.92, desc: "Favorece hits" },
  "Yankee Stadium": { runs: 1.02, hr: 1.15, desc: "Favorece HR diestros" },
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

// ═══════════════════════════════════════════════════
// COORDENADAS DE ESTADIOS (para clima)
// ═══════════════════════════════════════════════════

const STADIUM_COORDS = {
  "Yankee Stadium": { lat: 40.8296, lon: -73.9262 },
  "Citi Field": { lat: 40.7571, lon: -73.8458 },
  "Fenway Park": { lat: 42.3467, lon: -71.0972 },
  "Wrigley Field": { lat: 41.9484, lon: -87.6553 },
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
  "Tropicana Field": { lat: 27.7678, lon: -82.6524 },
  "Oriole Park at Camden Yards": { lat: 39.2839, lon: -76.6216 },
  "Nationals Park": { lat: 38.8730, lon: -77.0074 },
  "Citizens Bank Park": { lat: 39.9061, lon: -75.1665 },
  "PNC Park": { lat: 40.4469, lon: -80.0057 },
  "Busch Stadium": { lat: 38.6226, lon: -90.1928 },
  "American Family Field": { lat: 43.0280, lon: -87.9712 },
  "Great American Ball Park": { lat: 39.0978, lon: -84.5066 },
  "Comerica Park": { lat: 42.3390, lon: -83.0485 },
  "Progressive Field": { lat: 41.4962, lon: -81.6852 },
  "Target Field": { lat: 44.9817, lon: -93.2777 },
  "Kauffman Stadium": { lat: 39.0519, lon: -94.4804 },
  "Guaranteed Rate Field": { lat: 41.8299, lon: -87.6335 },
  "Rogers Centre": { lat: 43.6414, lon: -79.3894 },
};

// ═══════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════

const styles = {
  app: { minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'IBM Plex Mono', 'Courier New', monospace", padding: "0" },
  header: { borderBottom: `1px solid ${BORDER}`, padding: "20px 24px 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" },
  logo: { display: "flex", flexDirection: "column", gap: "2px" },
  logoTop: { fontSize: "9px", letterSpacing: "0.25em", color: MUTED, textTransform: "uppercase" },
  logoMain: { fontSize: "18px", fontWeight: "700", color: ACCENT, letterSpacing: "-0.02em", lineHeight: 1 },
  logoSub: { fontSize: "9px", color: MUTED },
  badge: { background: ACCENT, color: BG, fontSize: "8px", padding: "1px 6px", borderRadius: "3px", fontWeight: "700", marginLeft: "6px" },
  datePicker: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  dateLabel: { fontSize: "9px", color: MUTED, textTransform: "uppercase" },
  dateInput: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "4px", color: TEXT, fontFamily: "inherit", fontSize: "11px", padding: "6px 8px", outline: "none", cursor: "pointer" },
  btn: { background: ACCENT, color: BG, border: "none", borderRadius: "4px", padding: "7px 14px", fontSize: "10px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase" },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  main: { padding: "20px", maxWidth: "1100px", margin: "0 auto" },
  emptyState: { textAlign: "center", padding: "60px 0", color: MUTED },
  emptyIcon: { fontSize: "40px", marginBottom: "12px", opacity: 0.4 },
  emptyTitle: { fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", color: TEXT },
  emptyDesc: { fontSize: "11px", lineHeight: "1.5", maxWidth: "450px", margin: "0 auto" },
  loadingWrap: { textAlign: "center", padding: "60px 0" },
  loadingDot: { display: "inline-block", width: "6px", height: "6px", background: ACCENT, borderRadius: "50%", margin: "0 3px", animation: "pulse 1.2s ease-in-out infinite" },
  loadingText: { fontSize: "11px", color: MUTED, marginTop: "16px" },
  loadingPhase: { fontSize: "10px", color: ACCENT, marginTop: "6px" },
  sectionTitle: { fontSize: "9px", letterSpacing: "0.2em", color: MUTED, textTransform: "uppercase", marginBottom: "12px", paddingBottom: "6px", borderBottom: `1px solid ${BORDER}` },
  bestBetsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px", marginBottom: "32px" },
  betCard: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "5px", padding: "16px", position: "relative", overflow: "hidden" },
  verifiedCard: { borderColor: ACCENT, boxShadow: "0 0 10px rgba(200, 241, 53, 0.1)" },
  betCardAccent: { position: "absolute", top: 0, left: 0, width: "3px", height: "100%" },
  verifiedBadge: { position: "absolute", top: "6px", right: "6px", background: ACCENT, color: BG, fontSize: "7px", padding: "2px 5px", borderRadius: "2px", fontWeight: "700" },
  betRank: { fontSize: "9px", color: MUTED, textTransform: "uppercase", marginBottom: "4px" },
  betType: { fontSize: "8px", fontWeight: "700", textTransform: "uppercase", marginBottom: "3px", padding: "2px 6px", borderRadius: "2px", display: "inline-block" },
  betGame: { fontSize: "13px", fontWeight: "700", color: TEXT, margin: "6px 0 3px" },
  betSelection: { fontSize: "14px", fontWeight: "700", color: ACCENT, marginBottom: "4px" },
  betLine: { fontSize: "10px", color: MUTED, marginBottom: "8px" },
  betReason: { fontSize: "10px", color: TEXT, lineHeight: "1.5", marginBottom: "8px", opacity: 0.85 },
  betFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  confBadge: { fontSize: "9px", fontWeight: "700" },
  edgeBadge: { fontSize: "8px", color: MUTED },
  confidenceBar: { height: "2px", background: BORDER, borderRadius: "1px", marginTop: "6px", overflow: "hidden" },
  confidenceFill: { height: "100%", borderRadius: "1px", transition: "width 1s ease" },
  divider: { height: "1px", background: BORDER, margin: "24px 0" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px", marginBottom: "20px" },
  statCard: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "12px", textAlign: "center" },
  statNum: { fontSize: "20px", fontWeight: "700", color: ACCENT, lineHeight: 1, marginBottom: "3px" },
  statLabel: { fontSize: "8px", color: MUTED, textTransform: "uppercase" },
  infoBox: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "10px 14px", fontSize: "10px", color: TEXT, marginBottom: "16px", lineHeight: "1.5" },
  weatherGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "6px", marginBottom: "16px" },
  weatherCard: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "3px", padding: "8px 10px", fontSize: "9px" },
  errorBox: { background: "#1A0A0A", border: "1px solid #3A1A1A", borderRadius: "4px", padding: "16px", textAlign: "center", color: "#FF6B6B", fontSize: "11px" },
  errorTitle: { fontWeight: "700", marginBottom: "6px" },
  errorMessage: { fontSize: "10px", opacity: 0.8, marginBottom: "12px" },
  retryBtn: { background: "transparent", border: "1px solid #FF6B6B", borderRadius: "3px", color: "#FF6B6B", fontFamily: "inherit", fontSize: "9px", padding: "5px 10px", cursor: "pointer", textTransform: "uppercase" },
  disclaimer: { fontSize: "8px", color: MUTED, textAlign: "center", padding: "16px 0", borderTop: `1px solid ${BORDER}` },
  filterRow: { display: "flex", gap: "5px", marginBottom: "14px", flexWrap: "wrap" },
  filterBtn: { background: "transparent", border: `1px solid ${BORDER}`, borderRadius: "3px", color: MUTED, fontFamily: "inherit", fontSize: "9px", padding: "4px 8px", cursor: "pointer", textTransform: "uppercase" },
  filterBtnActive: { borderColor: ACCENT, color: ACCENT },
  contextBox: { background: SURFACE, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}`, borderRadius: "4px", padding: "10px 14px", fontSize: "10px", marginBottom: "20px" },
  avoidBox: { background: "#150A0A", border: "1px solid #2A1010", borderLeft: "3px solid #EF4444", borderRadius: "4px", padding: "10px 14px", fontSize: "10px", color: "#FCA5A5" },
  sheetBadge: { background: "#0D1F0D", color: "#4ADE80", fontSize: "7px", padding: "2px 6px", borderRadius: "3px", fontWeight: "700", marginLeft: "6px" },
};

const BET_TYPE_COLORS = {
  MONEYLINE: { bg: "#0D1F0D", text: "#4ADE80", bar: "#4ADE80" },
  "RUN LINE": { bg: "#0D1525", text: "#60A5FA", bar: "#60A5FA" },
  OVER: { bg: "#1A0D25", text: "#C084FC", bar: "#C084FC" },
  UNDER: { bg: "#251A0D", text: "#FB923C", bar: "#FB923C" },
  "FIRST HALF": { bg: "#251A0D", text: "#FBBF24", bar: "#FBBF24" },
};

const FILTERS = ["ALL", "MONEYLINE", "RUN LINE", "OVER", "UNDER", "FIRST HALF"];

// ═══════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════

function getTodayDate() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, day] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(day)}, ${y}`;
}

function ConfidenceBar({ pct, color }) {
  return (
    <div style={styles.confidenceBar}>
      <div style={{ ...styles.confidenceFill, width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  );
}

function BetCard({ bet, rank }) {
  const typeKey = Object.keys(BET_TYPE_COLORS).find((k) => bet.type?.toUpperCase().includes(k)) || "MONEYLINE";
  const colors = BET_TYPE_COLORS[typeKey] || BET_TYPE_COLORS["MONEYLINE"];
  const confPct = parseInt(bet.confidence) || 65;
  const isVerified = bet.verified;

  return (
    <div style={{ ...styles.betCard, ...(isVerified ? styles.verifiedCard : {}) }}>
      <div style={{ ...styles.betCardAccent, background: isVerified ? ACCENT : colors.bar }} />
      {isVerified && <div style={styles.verifiedBadge}>✅ VERIFICADO</div>}
      <div style={{ paddingLeft: "6px" }}>
        <div style={styles.betRank}>ENTRADA #{rank}</div>
        <span style={{ ...styles.betType, background: colors.bg, color: colors.text }}>{bet.type}</span>
        <div style={styles.betGame}>{bet.game}</div>
        <div style={styles.betSelection}>{bet.selection}</div>
        <div style={styles.betLine}>Línea: {bet.line}</div>
        <div style={styles.betReason}>{bet.reason}</div>
        <div style={styles.betFooter}>
          <span style={{ ...styles.confBadge, color: isVerified ? ACCENT : colors.bar }}>{bet.confidence}% CONF</span>
          <span style={styles.edgeBadge}>EDGE: {bet.edge}</span>
        </div>
        <ConfidenceBar pct={confPct} color={isVerified ? ACCENT : colors.bar} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════

export default function App() {
  const [date, setDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [weatherData, setWeatherData] = useState(null);
  const [pitcherStats, setPitcherStats] = useState(null);
  const [phase, setPhase] = useState("");
  const [sheetSaved, setSheetSaved] = useState(false);

  // ─── OBTENER CLIMA ──────────────────────────────
  const fetchWeather = useCallback(async (venue) => {
    const coords = STADIUM_COORDS[venue];
    if (!coords) return null;
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,weather_code&timezone=auto&forecast_days=1`
      );
      const json = await res.json();
      const h = 19;
      const temp = json.hourly.temperature_2m[h] || "N/A";
      const wind = json.hourly.wind_speed_10m[h] || 0;
      const windDir = json.hourly.wind_direction_10m[h] || 0;
      const rain = json.hourly.precipitation_probability[h] || 0;
      const code = json.hourly.weather_code[h] || 0;
      const emoji = code <= 3 ? "☀️" : code <= 48 ? "☁️" : code <= 67 ? "🌧️" : "⛈️";
      let windEffect = "Neutral";
      if (wind > 15 && windDir > 135 && windDir < 225) windEffect = "🔥 Outfield";
      if (wind > 15 && (windDir < 45 || windDir > 315)) windEffect = "❄️ Infield";
      let impact = "";
      if (rain > 50) impact = "⚠️ Lluvia";
      if (temp > 32) impact = "🔴 Calor";
      if (temp < 10) impact = "🔵 Frío";
      return { venue, temp, wind, windEffect, rain, emoji, impact };
    } catch {
      return null;
    }
  }, []);

  // ─── OBTENER STATS PITCHER ──────────────────────
  const fetchPitcherStats = useCallback(async (name) => {
    try {
      const sr = await fetch(`https://statsapi.mlb.com/api/v1/people/search?names=${encodeURIComponent(name)}`);
      const sd = await sr.json();
      if (!sd.people?.length) return null;
      const pid = sd.people[0].id;
      const pr = await fetch(`https://statsapi.mlb.com/api/v1/people/${pid}/stats?stats=season&season=2025&group=pitching`);
      const pd = await pr.json();
      const s = pd.stats?.[0]?.splits?.[0]?.stat;
      if (!s) return null;
      return { name, era: s.era, whip: s.whip, k9: s.strikeoutsPer9Inn, bb9: s.baseOnBallsPer9Inn, ip: s.inningsPitched };
    } catch {
      return null;
    }
  }, []);

  // ─── OBTENER JUEGOS MLB ─────────────────────────
  const fetchMLBGames = useCallback(async (targetDate) => {
    const res = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${targetDate}&hydrate=probablePitcher(note)`);
    if (!res.ok) throw new Error("Error API MLB");
    const json = await res.json();
    if (!json.dates?.length) throw new Error("No hay juegos");
    
    return json.dates[0].games.map(g => ({
      away: g.teams.away.team.name,
      home: g.teams.home.team.name,
      awayP: g.teams.away.probablePitcher?.fullName || "TBD",
      homeP: g.teams.home.probablePitcher?.fullName || "TBD",
      venue: g.venue.name,
    }));
  }, []);

  // ─── LLAMAR A LA IA ─────────────────────────────
  const callAI = useCallback(async (model, prompt, apiKey) => {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 50000);
    try {
      const res = await fetch("/api-nvidia/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        signal: ctrl.signal,
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.1, max_tokens: 2048 }),
      });
      clearTimeout(tid);
      if (!res.ok) return null;
      const raw = await res.json();
      return raw.choices?.[0]?.message?.content;
    } catch { clearTimeout(tid); return null; }
  }, []);

  // ─── EXTRAER JSON ───────────────────────────────
  const extractJSON = (text) => {
    if (!text) return null;
    try { return JSON.parse(text); } catch {}
    const s = text.indexOf("{"), e = text.lastIndexOf("}");
    if (s !== -1 && e !== -1) { try { return JSON.parse(text.slice(s, e + 1)); } catch {} }
    return null;
  };

  // ─── ANALIZAR ───────────────────────────────────
  const analyze = useCallback(async () => {
    setLoading(true);
    setData(null);
    setError(null);
    setWeatherData(null);
    setPitcherStats(null);
    setSheetSaved(false);

    const phases = ["MLB API...", "Clima...", "Stats pitchers...", "IA principal...", "DeepSeek..."];
    let pi = 0;
    setPhase(phases[0]);
    const interval = setInterval(() => { pi = (pi + 1) % phases.length; setPhase(phases[pi]); }, 2500);

    try {
      // 1. Juegos
      const games = await fetchMLBGames(date);
      
      // 2. Clima
      setPhase("Clima...");
      const venues = [...new Set(games.map(g => g.venue))];
      const weatherPromises = venues.map(v => fetchWeather(v));
      const weatherResults = (await Promise.all(weatherPromises)).filter(w => w);
      setWeatherData(weatherResults);

      // 3. Stats pitchers
      setPhase("Stats pitchers...");
      const pitchers = [...new Set(games.flatMap(g => [g.awayP, g.homeP]).filter(p => p !== "TBD"))];
      const statsPromises = pitchers.map(p => fetchPitcherStats(p));
      const statsResults = (await Promise.all(statsPromises)).filter(s => s);
      setPitcherStats(statsResults);

      // 4. Construir prompt
      const gamesText = games.map(g => `- ${g.away} (${g.awayP}) vs ${g.home} (${g.homeP}) @ ${g.venue}`).join("\n");
      
      const weatherText = weatherResults.map(w => 
        `${w.venue}: ${w.emoji} ${w.temp}°C | Viento: ${w.wind}km/h ${w.windEffect} | Lluvia: ${w.rain}% ${w.impact}`
      ).join("\n");
      
      const statsText = statsResults.map(s => 
        `${s.name}: ERA ${s.era} | WHIP ${s.whip} | K/9 ${s.k9} | BB/9 ${s.bb9} | IP ${s.ip}`
      ).join("\n");
      
      const parkText = venues.map(v => {
        const pf = PARK_FACTORS[v];
        return pf ? `${v}: ${pf.runs}x carreras, ${pf.hr}x HR (${pf.desc})` : null;
      }).filter(Boolean).join("\n");

      const prompt = `Eres un analista sabermétrico MLB de élite.

FECHA: ${date}

═══ JUEGOS ═══
${gamesText}

═══ CLIMA REAL ═══
${weatherText || "No disponible"}

═══ STATS REALES PITCHERS ═══
${statsText || "No disponible"}

═══ PARK FACTORS ═══
${parkText || "No disponible"}

INSTRUCCIONES:
1. Analiza CADA juego usando los datos REALES.
2. Clima: viento >15km/h outfield = más HR, lluvia >40% = under, temp >32°C = más carreras.
3. Aplica park factors.
4. Solo Edge ≥ 8%.
5. Confianza: 60-65%=marginal, 66-72%=sólido, 73%+=fuerte.
6. Selecciona 5-8 entradas.
7. RESPONDE SOLO JSON:

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
      "reason": "<2-3 oraciones>",
      "confidence": <número 60-78>,
      "edge": "<+X.X%>",
      "key_metric": "<Métrica>"
    }
  ],
  "props_alert": [],
  "avoid_today": "<1-2 oraciones>"
}`;

      // 5. Llamar a los 2 modelos
      setPhase("IA principal...");
      const [text1, text2] = await Promise.all([
        callAI("meta/llama-3.1-70b-instruct", prompt, API_NVIDIA),
        callAI("meta/llama-3.1-70b-instruct", prompt, API_DEEPSEEK),
      ]);

      const r1 = extractJSON(text1);
      const r2 = extractJSON(text2);
      
      clearInterval(interval);

      // 6. Combinar resultados
      let finalResult;
      if (r1) {
        finalResult = r1;
        if (r2) {
          const picks2 = new Set(r2.best_bets?.map(b => `${b.game}|${b.type}|${b.selection}`) || []);
          finalResult.best_bets = finalResult.best_bets.map(b => {
            const key = `${b.game}|${b.type}|${b.selection}`;
            if (picks2.has(key)) {
              return { ...b, verified: true, confidence: Math.min(82, b.confidence + 5), reason: b.reason + " [✅ 2 IAs]" };
            }
            return b;
          });
        }
        finalResult.best_bets.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
        finalResult.best_bets.forEach((b, i) => b.rank = i + 1);
        finalResult.models_used = r2 ? 2 : 1;
        finalResult.verified_count = finalResult.best_bets.filter(b => b.verified).length;
      } else {
        throw new Error("El modelo principal no respondió");
      }

      setData(finalResult);

      // 7. Guardar en Google Sheets
      setPhase("Google Sheets...");
      try {
        const sheetRes = await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            best_bets: finalResult.best_bets,
            models_used: finalResult.models_used,
          }),
        });
        const sheetJson = await sheetRes.json();
        if (sheetJson.success) {
          setSheetSaved(true);
        }
      } catch {}

    } catch (err) {
      clearInterval(interval);
      setError(err.message);
    } finally {
      setLoading(false);
      setPhase("");
    }
  }, [date, fetchMLBGames, fetchWeather, fetchPitcherStats, callAI]);

  const filteredBets = data?.best_bets?.filter(b => {
    if (filter === "ALL") return true;
    return b.type?.toUpperCase().includes(filter);
  }) || [];

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,80%,100%{transform:scale(0);opacity:0.3} 40%{transform:scale(1);opacity:1} }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        button:hover:not(:disabled) { opacity: 0.85; }
      `}</style>

      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoTop}>MLB Analytics v3.0</span>
          <span style={styles.logoMain}>
            ⚾ EDGE BOARD
            <span style={styles.badge}>2 IA</span>
            <span style={styles.sheetBadge}>📊 Sheets</span>
          </span>
          <span style={styles.logoSub}>Clima + Stats + Doble IA + Historial</span>
        </div>
        <div style={styles.datePicker}>
          <span style={styles.dateLabel}>Fecha</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.dateInput} disabled={loading} />
          <button onClick={analyze} disabled={loading} style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}>
            {loading ? "..." : "▶ Analizar"}
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {!loading && !data && !error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>⚾</div>
            <div style={styles.emptyTitle}>Edge Board v3.0</div>
            <p style={styles.emptyDesc}>
              <strong>2 modelos IA</strong> · Clima real · Stats pitchers · Park Factors · Google Sheets
            </p>
          </div>
        )}

        {loading && (
          <div style={styles.loadingWrap}>
            <div>{[0,1,2].map(i => <span key={i} style={{...styles.loadingDot, animationDelay:`${i*0.2}s`}} />)}</div>
            <div style={styles.loadingText}>Procesando</div>
            <div style={styles.loadingPhase}>{phase}</div>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorTitle}>⚠ Error</div>
            <div style={styles.errorMessage}>{error}</div>
            <button onClick={analyze} style={styles.retryBtn}>Reintentar</button>
          </div>
        )}

        {data && !loading && (
          <>
            <div style={styles.infoBox}>
              🤖 <strong>{data.models_used || 1} modelos</strong>
              {data.verified_count > 0 && <> · ✅ <strong>{data.verified_count} verificados</strong></>}
              {weatherData && <> · 🌤️ <strong>{weatherData.length} climas</strong></>}
              {pitcherStats && <> · 👤 <strong>{pitcherStats.length} pitchers</strong></>}
              {sheetSaved && <> · 📊 <strong>Sheets guardado</strong></>}
            </div>

            {weatherData?.length > 0 && (
              <div style={styles.weatherGrid}>
                {weatherData.map((w, i) => (
                  <div key={i} style={styles.weatherCard}>
                    <strong>{w.emoji} {w.venue}</strong><br />
                    {w.temp}°C | Viento: {w.wind}km/h {w.windEffect}<br />
                    Lluvia: {w.rain}% {w.impact}
                  </div>
                ))}
              </div>
            )}

            <div style={{marginBottom:"8px"}}><div style={styles.sectionTitle}>Resumen · {formatDate(data.date)}</div></div>
            <div style={styles.summaryGrid}>
              <div style={styles.statCard}><div style={styles.statNum}>{data.games_analyzed||"—"}</div><div style={styles.statLabel}>Juegos</div></div>
              <div style={styles.statCard}><div style={styles.statNum}>{data.bets_above_threshold||"—"}</div><div style={styles.statLabel}>Edge ≥8%</div></div>
              <div style={styles.statCard}><div style={styles.statNum}>{data.best_bets?.length||0}</div><div style={styles.statLabel}>Picks</div></div>
              <div style={styles.statCard}><div style={styles.statNum}>{data.verified_count||0}</div><div style={styles.statLabel}>✅ Verif.</div></div>
              <div style={styles.statCard}>
                <div style={styles.statNum}>{data.best_bets?.length>0?Math.round(data.best_bets.reduce((a,b)=>a+(b.confidence||0),0)/data.best_bets.length)+"%":"—"}</div>
                <div style={styles.statLabel}>Confianza</div>
              </div>
            </div>

            {data.market_summary && <div style={styles.contextBox}>◆ {data.market_summary}</div>}

            <div style={styles.filterRow}>
              {FILTERS.map(f => (
                <button key={f} onClick={()=>setFilter(f)} style={{...styles.filterBtn,...(filter===f?styles.filterBtnActive:{})}}>{f}</button>
              ))}
            </div>

            <div style={styles.sectionTitle}>Entradas ({filteredBets.length})</div>
            {filteredBets.length===0 ? (
              <div style={{color:MUTED,fontSize:"11px",padding:"12px 0"}}>Sin entradas.</div>
            ) : (
              <div style={styles.bestBetsGrid}>{filteredBets.map((b,i)=><BetCard key={i} bet={b} rank={b.rank||i+1} />)}</div>
            )}

            {data.avoid_today && (
              <div style={styles.avoidBox}><span style={{color:"#EF4444",fontWeight:"700",marginRight:"6px"}}>⚠ EVITAR</span>{data.avoid_today}</div>
            )}

            <div style={{height:"16px"}} />
            <div style={styles.disclaimer}>v3.0 · Clima + Stats + 2 IA + Sheets · Fines educativos</div>
          </>
        )}
      </main>
    </div>
  );
}
