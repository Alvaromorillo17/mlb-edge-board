import { useState, useCallback } from "react";

const ACCENT = "#C8F135";
const BG = "#0A0E0A";
const SURFACE = "#111611";
const BORDER = "#1E2A1E";
const TEXT = "#E8F0E8";
const MUTED = "#6B7F6B";

const API_KEY = "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";

const styles = {
  app: { minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'IBM Plex Mono', 'Courier New', monospace", padding: "0" },
  header: { borderBottom: `1px solid ${BORDER}`, padding: "20px 24px 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" },
  logo: { display: "flex", flexDirection: "column", gap: "2px" },
  logoTop: { fontSize: "9px", letterSpacing: "0.25em", color: MUTED, textTransform: "uppercase" },
  logoMain: { fontSize: "18px", fontWeight: "700", color: ACCENT, letterSpacing: "-0.02em", lineHeight: 1 },
  logoSub: { fontSize: "9px", color: MUTED },
  datePicker: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  dateLabel: { fontSize: "9px", color: MUTED, textTransform: "uppercase" },
  dateInput: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "4px", color: TEXT, fontFamily: "inherit", fontSize: "11px", padding: "6px 8px", outline: "none", cursor: "pointer" },
  btn: { background: ACCENT, color: BG, border: "none", borderRadius: "4px", padding: "7px 14px", fontSize: "10px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase" },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  main: { padding: "20px", maxWidth: "1000px", margin: "0 auto" },
  emptyState: { textAlign: "center", padding: "60px 0", color: MUTED },
  emptyIcon: { fontSize: "40px", marginBottom: "12px", opacity: 0.4 },
  emptyTitle: { fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", color: TEXT },
  emptyDesc: { fontSize: "11px", lineHeight: "1.5", maxWidth: "400px", margin: "0 auto" },
  loadingWrap: { textAlign: "center", padding: "60px 0" },
  loadingDot: { display: "inline-block", width: "6px", height: "6px", background: ACCENT, borderRadius: "50%", margin: "0 3px", animation: "pulse 1.2s ease-in-out infinite" },
  loadingText: { fontSize: "11px", color: MUTED, marginTop: "16px" },
  sectionTitle: { fontSize: "9px", letterSpacing: "0.2em", color: MUTED, textTransform: "uppercase", marginBottom: "12px", paddingBottom: "6px", borderBottom: `1px solid ${BORDER}` },
  bestBetsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px", marginBottom: "32px" },
  betCard: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "5px", padding: "16px", position: "relative", overflow: "hidden" },
  betCardAccent: { position: "absolute", top: 0, left: 0, width: "3px", height: "100%" },
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
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px", marginBottom: "24px" },
  statCard: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "12px", textAlign: "center" },
  statNum: { fontSize: "20px", fontWeight: "700", color: ACCENT, lineHeight: 1, marginBottom: "3px" },
  statLabel: { fontSize: "8px", color: MUTED, textTransform: "uppercase" },
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
};

const BET_TYPE_COLORS = {
  MONEYLINE: { bg: "#0D1F0D", text: "#4ADE80", bar: "#4ADE80" },
  "RUN LINE": { bg: "#0D1525", text: "#60A5FA", bar: "#60A5FA" },
  OVER: { bg: "#1A0D25", text: "#C084FC", bar: "#C084FC" },
  UNDER: { bg: "#251A0D", text: "#FB923C", bar: "#FB923C" },
  "FIRST HALF": { bg: "#251A0D", text: "#FBBF24", bar: "#FBBF24" },
};

const FILTERS = ["ALL", "MONEYLINE", "RUN LINE", "OVER", "UNDER", "FIRST HALF"];

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

  return (
    <div style={styles.betCard}>
      <div style={{ ...styles.betCardAccent, background: colors.bar }} />
      <div style={{ paddingLeft: "6px" }}>
        <div style={styles.betRank}>ENTRADA #{rank}</div>
        <span style={{ ...styles.betType, background: colors.bg, color: colors.text }}>{bet.type}</span>
        <div style={styles.betGame}>{bet.game}</div>
        <div style={styles.betSelection}>{bet.selection}</div>
        <div style={styles.betLine}>Línea: {bet.line}</div>
        <div style={styles.betReason}>{bet.reason}</div>
        <div style={styles.betFooter}>
          <span style={{ ...styles.confBadge, color: colors.bar }}>{bet.confidence}% CONF</span>
          <span style={styles.edgeBadge}>EDGE: {bet.edge}</span>
        </div>
        <ConfidenceBar pct={confPct} color={colors.bar} />
      </div>
    </div>
  );
}

export default function App() {
  const [date, setDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const fetchMLBGames = useCallback(async (targetDate) => {
    const res = await fetch(
      `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${targetDate}&hydrate=probablePitcher(note)`
    );
    if (!res.ok) throw new Error("No se pudo conectar con la API de MLB.");
    const json = await res.json();
    if (!json.dates || json.dates.length === 0) throw new Error("No hay juegos para esta fecha.");
    
    return json.dates[0].games
      .map((g) => {
        const away = g.teams.away.team.name;
        const home = g.teams.home.team.name;
        const awayP = g.teams.away.probablePitcher ? g.teams.away.probablePitcher.fullName : "TBD";
        const homeP = g.teams.home.probablePitcher ? g.teams.home.probablePitcher.fullName : "TBD";
        return `- ${away} (${awayP}) vs ${home} (${homeP})`;
      })
      .join("\n");
  }, []);

  const analyze = useCallback(async () => {
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const gamesText = await fetchMLBGames(date);

      const promptText = `Eres un analista sabermétrico de MLB. Especialista en estadística avanzada y handicapper.

FECHA: ${date}

JUEGOS DEL DÍA:
${gamesText}

INSTRUCCIONES:
1. Analiza CADA juego con métricas sabermétricas (ERA, WHIP, FIP, wRC+, park factors).
2. Solo reporta apuestas con Edge ≥ 8%.
3. Confianza: 60-65%=marginal, 66-72%=sólido, 73%+=fuerte. NUNCA bajo 60%.
4. Selecciona las 5-8 mejores entradas.
5. RESPONDE ÚNICAMENTE CON ESTE JSON (sin markdown, sin texto extra):

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
      "key_metric": "<Métrica principal>"
    }
  ],
  "props_alert": [],
  "avoid_today": "<1-2 oraciones>"
}`;

const response = await fetch("/api-nvidia/chat/completions", {
          method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [{ role: "user", content: promptText }],
          temperature: 0.1,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error NVIDIA (${response.status})`);
      }

      const raw = await response.json();
      const textResponse = raw.choices?.[0]?.message?.content;

      if (!textResponse) throw new Error("Respuesta vacía del modelo");

      // Extraer JSON
      let parsed;
      try {
        parsed = JSON.parse(textResponse);
      } catch {
        const clean = textResponse.replace(/```json|```/g, "").trim();
        const start = clean.indexOf("{");
        const end = clean.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          parsed = JSON.parse(clean.slice(start, end + 1));
        } else {
          throw new Error("La IA no devolvió un JSON válido");
        }
      }

      setData(parsed);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [date, fetchMLBGames]);

  const filteredBets = data?.best_bets?.filter((b) => {
    if (filter === "ALL") return true;
    return b.type?.toUpperCase().includes(filter);
  }) || [];

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        button:hover:not(:disabled) { opacity: 0.85; }
      `}</style>

      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoTop}>MLB Analytics</span>
          <span style={styles.logoMain}>⚾ EDGE BOARD</span>
          <span style={styles.logoSub}>NVIDIA IA · Sabermétrica</span>
        </div>
        <div style={styles.datePicker}>
          <span style={styles.dateLabel}>Fecha</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.dateInput} disabled={loading} />
          <button onClick={analyze} disabled={loading} style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}>
            {loading ? "..." : "▶ Analizar"}
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {!loading && !data && !error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>⚾</div>
            <div style={styles.emptyTitle}>Edge Board</div>
            <p style={styles.emptyDesc}>
              Selecciona fecha y presiona <strong>Analizar</strong>.<br />
              IA de NVIDIA + MLB Stats API
            </p>
          </div>
        )}

        {loading && (
          <div style={styles.loadingWrap}>
            <div>{[0, 1, 2].map((i) => (<span key={i} style={{ ...styles.loadingDot, animationDelay: `${i * 0.2}s` }} />))}</div>
            <div style={styles.loadingText}>Consultando IA...</div>
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
            <div style={{ marginBottom: "8px" }}><div style={styles.sectionTitle}>Resumen · {formatDate(data.date)}</div></div>
            <div style={styles.summaryGrid}>
              <div style={styles.statCard}><div style={styles.statNum}>{data.games_analyzed || "—"}</div><div style={styles.statLabel}>Juegos</div></div>
              <div style={styles.statCard}><div style={styles.statNum}>{data.bets_above_threshold || "—"}</div><div style={styles.statLabel}>Edge ≥8%</div></div>
              <div style={styles.statCard}><div style={styles.statNum}>{data.best_bets?.length || 0}</div><div style={styles.statLabel}>Picks</div></div>
            </div>

            {data.market_summary && (
              <div style={styles.contextBox}>
                <span style={{ color: ACCENT, fontWeight: "700", marginRight: "6px" }}>◆</span>
                {data.market_summary}
              </div>
            )}

            <div style={styles.filterRow}>
              {FILTERS.map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}>{f}</button>
              ))}
            </div>

            <div style={styles.sectionTitle}>Entradas ({filteredBets.length})</div>
            {filteredBets.length === 0 ? (
              <div style={{ color: MUTED, fontSize: "11px", padding: "12px 0" }}>Sin entradas.</div>
            ) : (
              <div style={styles.bestBetsGrid}>{filteredBets.map((bet, i) => (<BetCard key={i} bet={bet} rank={bet.rank || i + 1} />))}</div>
            )}

            {data.avoid_today && (
              <div style={styles.avoidBox}>
                <span style={{ color: "#EF4444", fontWeight: "700", marginRight: "6px" }}>⚠ EVITAR</span>
                {data.avoid_today}
              </div>
            )}

            <div style={{ height: "16px" }} />
            <div style={styles.disclaimer}>Fines educativos. MLB API + NVIDIA IA.</div>
          </>
        )}
      </main>
    </div>
  );
}
