import { useState, useCallback } from "react";

const ACCENT = "#C8F135";
const BG = "#0A0E0A";
const SURFACE = "#111611";
const BORDER = "#1E2A1E";
const TEXT = "#E8F0E8";
const MUTED = "#6B7F6B";

const API_KEY_NVIDIA = "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";

const styles = {
  app: { minHeight: "100vh", background: BG, color: TEXT, padding: "0" },
  header: { borderBottom: `1px solid ${BORDER}`, padding: "28px 32px 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
  logo: { display: "flex", flexDirection: "column", gap: "2px" },
  logoTop: { fontSize: "10px", letterSpacing: "0.25em", color: MUTED, textTransform: "uppercase" },
  logoMain: { fontSize: "22px", fontWeight: "700", color: ACCENT, letterSpacing: "-0.02em", lineHeight: 1 },
  logoSub: { fontSize: "11px", color: MUTED, letterSpacing: "0.15em" },
  datePicker: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  dateLabel: { fontSize: "11px", color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" },
  dateInput: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "4px", color: TEXT, fontFamily: "inherit", fontSize: "13px", padding: "8px 12px", outline: "none", cursor: "pointer" },
  btn: { background: ACCENT, color: "#0A0E0A", border: "none", borderRadius: "4px", padding: "9px 20px", fontSize: "12px", fontWeight: "700", fontFamily: "inherit", letterSpacing: "0.08em", cursor: "pointer", textTransform: "uppercase" },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  main: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  emptyState: { textAlign: "center", padding: "80px 0", color: MUTED },
  emptyIcon: { fontSize: "48px", marginBottom: "16px", opacity: 0.4 },
  emptyTitle: { fontSize: "14px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px", color: TEXT },
  emptyDesc: { fontSize: "12px", lineHeight: "1.6", maxWidth: "400px", margin: "0 auto" },
  loadingWrap: { textAlign: "center", padding: "80px 0" },
  loadingDot: { display: "inline-block", width: "8px", height: "8px", background: ACCENT, borderRadius: "50%", margin: "0 4px", animation: "pulse 1.2s ease-in-out infinite" },
  loadingText: { fontSize: "12px", color: MUTED, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "20px" },
  loadingPhase: { fontSize: "11px", color: ACCENT, marginTop: "8px", letterSpacing: "0.1em" },
  sectionTitle: { fontSize: "10px", letterSpacing: "0.25em", color: MUTED, textTransform: "uppercase", marginBottom: "16px", paddingBottom: "8px", borderBottom: `1px solid ${BORDER}` },
  bestBetsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px", marginBottom: "40px" },
  betCard: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "6px", padding: "20px", position: "relative", overflow: "hidden" },
  betCardAccent: { position: "absolute", top: 0, left: 0, width: "3px", height: "100%" },
  betRank: { fontSize: "10px", color: MUTED, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px" },
  betType: { fontSize: "10px", fontWeight: "700", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "4px", padding: "3px 8px", borderRadius: "3px", display: "inline-block" },
  betGame: { fontSize: "14px", fontWeight: "700", color: TEXT, margin: "8px 0 4px", lineHeight: 1.2 },
  betSelection: { fontSize: "16px", fontWeight: "700", color: ACCENT, marginBottom: "8px" },
  betLine: { fontSize: "12px", color: MUTED, marginBottom: "12px" },
  betReason: { fontSize: "12px", color: TEXT, lineHeight: "1.6", marginBottom: "12px", opacity: 0.85 },
  betFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  confBadge: { fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em" },
  edgeBadge: { fontSize: "10px", color: MUTED, letterSpacing: "0.1em" },
  confidenceBar: { height: "3px", background: BORDER, borderRadius: "2px", marginTop: "10px", overflow: "hidden" },
  confidenceFill: { height: "100%", borderRadius: "2px", transition: "width 1s ease" },
  divider: { height: "1px", background: BORDER, margin: "32px 0" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "32px" },
  statCard: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "6px", padding: "16px", textAlign: "center" },
  statNum: { fontSize: "28px", fontWeight: "700", color: ACCENT, lineHeight: 1, marginBottom: "4px" },
  statLabel: { fontSize: "10px", color: MUTED, letterSpacing: "0.15em", textTransform: "uppercase" },
  errorBox: { background: "#1A0A0A", border: "1px solid #3A1A1A", borderRadius: "6px", padding: "20px", textAlign: "center", color: "#FF6B6B", fontSize: "13px" },
  errorTitle: { fontWeight: "700", marginBottom: "8px" },
  errorMessage: { fontSize: "12px", opacity: 0.8, marginBottom: "16px" },
  retryBtn: { background: "transparent", border: "1px solid #FF6B6B", borderRadius: "4px", color: "#FF6B6B", fontFamily: "inherit", fontSize: "11px", padding: "6px 14px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" },
  disclaimer: { fontSize: "10px", color: MUTED, textAlign: "center", padding: "24px 0", borderTop: `1px solid ${BORDER}`, lineHeight: "1.6", letterSpacing: "0.05em" },
  filterRow: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
  filterBtn: { background: "transparent", border: `1px solid ${BORDER}`, borderRadius: "4px", color: MUTED, fontFamily: "inherit", fontSize: "11px", padding: "6px 14px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" },
  filterBtnActive: { borderColor: ACCENT, color: ACCENT },
  contextBox: { background: SURFACE, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}`, borderRadius: "6px", padding: "14px 18px", fontSize: "12px", color: TEXT, marginBottom: "28px", lineHeight: "1.6", opacity: 0.9 },
  avoidBox: { background: "#150A0A", border: "1px solid #2A1010", borderLeft: "3px solid #EF4444", borderRadius: "6px", padding: "14px 18px", fontSize: "12px", color: "#FCA5A5", lineHeight: "1.6" },
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
      <div style={{ paddingLeft: "8px" }}>
        <div style={styles.betRank}>ENTRADA #{rank} DEL DÍA</div>
        <span style={{ ...styles.betType, background: colors.bg, color: colors.text }}>{bet.type}</span>
        <div style={styles.betGame}>{bet.game}</div>
        <div style={styles.betSelection}>{bet.selection}</div>
        <div style={styles.betLine}>Línea: {bet.line}</div>
        <div style={styles.betReason}>{bet.reason}</div>
        <div style={styles.betFooter}>
          <span style={{ ...styles.confBadge, color: colors.bar }}>{bet.confidence}% CONFIANZA</span>
          <span style={styles.edgeBadge}>EDGE: {bet.edge}</span>
        </div>
        <ConfidenceBar pct={confPct} color={colors.bar} />
      </div>
    </div>
  );
}

const buildPrompt = (dateStr, gamesData) => `Eres un analista sabermétrico de MLB. Especialista en estadística avanzada.

FECHA: ${dateStr}

JUEGOS DE HOY (API oficial MLB):
${gamesData}

INSTRUCCIONES:
1. Analiza SOLO los juegos listados arriba con métricas sabermétricas.
2. Reporta solo apuestas con Edge ≥ 8%.
3. Confianza: 60-65% = marginal, 66-72% = sólido, 73%+ = fuerte. No reportar bajo 60%.
4. Elige las mejores 5-8 entradas rankeadas por Edge.
5. RESPONDE ÚNICAMENTE CON EL JSON. Sin texto adicional, sin markdown, sin explicaciones.

{
  "date": "${dateStr}",
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

export default function App() {
  const [date, setDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState("");
  const [filter, setFilter] = useState("ALL");

  const fetchMLBGames = useCallback(async (targetDate) => {
    const res = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${targetDate}&hydrate=probablePitcher(note)`);
    if (!res.ok) throw new Error("No se pudo conectar con la API de MLB.");
    const json = await res.json();
    if (!json.dates || json.dates.length === 0) throw new Error("No hay juegos programados para esta fecha.");
    return json.dates[0].games.map((g) => {
      const away = g.teams.away.team.name;
      const home = g.teams.home.team.name;
      const awayP = g.teams.away.probablePitcher ? g.teams.away.probablePitcher.fullName : "TBD";
      const homeP = g.teams.home.probablePitcher ? g.teams.home.probablePitcher.fullName : "TBD";
      return `- ${away} (${awayP}) vs ${home} (${homeP})`;
    }).join("\n");
  }, []);

  const extractJSON = (text) => {
    try { return JSON.parse(text); } catch {}
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try { return JSON.parse(text.slice(start, end + 1)); } catch {}
    }
    throw new Error("El modelo no devolvió un JSON válido.");
  };

  const analyze = useCallback(async () => {
    setLoading(true);
    setData(null);
    setError(null);

    const phases = [
      "Consultando MLB API oficial...",
      "Extrayendo rotaciones y abridores...",
      "Contactando IA de NVIDIA...",
      "Calculando Edge sabermétrico...",
      "Rankeando mejores entradas...",
    ];

    let phaseIndex = 0;
    setPhase(phases[0]);
    const phaseInterval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      setPhase(phases[phaseIndex]);
    }, 3000);

    try {
      const gamesData = await fetchMLBGames(date);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch("/api-nvidia/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY_NVIDIA}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [{ role: "user", content: buildPrompt(date, gamesData) }],
          temperature: 0.1,
          max_tokens: 2048,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || `Error del servidor NVIDIA (${response.status})`);
      }

      const raw = await response.json();
      clearInterval(phaseInterval);

      const textResponse = raw.choices?.[0]?.message?.content;
      if (!textResponse) throw new Error("Respuesta vacía del modelo.");

      const parsed = extractJSON(textResponse);
      setData(parsed);
    } catch (err) {
      clearInterval(phaseInterval);
      if (err.name === "AbortError") {
        setError("La solicitud tardó demasiado. Intenta de nuevo.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setPhase("");
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
          <span style={styles.logoSub}>NVIDIA AI + MLB Stats API</span>
        </div>
        <div style={styles.datePicker}>
          <span style={styles.dateLabel}>Fecha</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.dateInput} disabled={loading} />
          <button onClick={analyze} disabled={loading} style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}>
            {loading ? "Analizando..." : "▶️ Analizar"}
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {!loading && !data && !error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>⚾</div>
            <div style={styles.emptyTitle}>Edge Board Listo</div>
            <p style={styles.emptyDesc}>Selecciona una fecha y presiona <strong>Analizar</strong>. El sistema consulta la API oficial de MLB y utiliza IA de NVIDIA para encontrar las entradas con mayor ventaja estadística.</p>
          </div>
        )}

        {loading && (
          <div style={styles.loadingWrap}>
            <div>{[0, 1, 2].map((i) => (<span key={i} style={{ ...styles.loadingDot, animationDelay: `${i * 0.2}s` }} />))}</div>
            <div style={styles.loadingText}>Procesando pizarra completa</div>
            <div style={styles.loadingPhase}>{phase}</div>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorTitle}>⚠ Error de Análisis</div>
            <div style={styles.errorMessage}>{error}</div>
            <button onClick={analyze} style={styles.retryBtn}>Reintentar</button>
          </div>
        )}

        {data && !loading && (
          <>
            <div style={{ marginBottom: "8px" }}><div style={styles.sectionTitle}>Resumen · {formatDate(data.date)}</div></div>
            <div style={styles.summaryGrid}>
              <div style={styles.statCard}><div style={styles.statNum}>{data.games_analyzed || "—"}</div><div style={styles.statLabel}>Juegos analizados</div></div>
              <div style={styles.statCard}><div style={styles.statNum}>{data.bets_above_threshold || "—"}</div><div style={styles.statLabel}>Entradas ≥8% edge</div></div>
              <div style={styles.statCard}><div style={styles.statNum}>{data.best_bets?.length || 0}</div><div style={styles.statLabel}>Seleccionadas hoy</div></div>
              <div style={styles.statCard}>
                <div style={styles.statNum}>
                  {data.best_bets?.length > 0
                    ? `${Math.round(data.best_bets.reduce((a, b) => a + (b.confidence || 0), 0) / data.best_bets.length)}%`
                    : "—"}
                </div>
                <div style={styles.statLabel}>Confianza promedio</div>
              </div>
            </div>

            {data.market_summary && (
              <div style={styles.contextBox}><span style={{ color: ACCENT, fontWeight: "700", marginRight: "8px" }}>◆ CONTEXTO DEL DÍA</span>{data.market_summary}</div>
            )}

            <div style={styles.filterRow}>
              {FILTERS.map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}>{f}</button>
              ))}
            </div>

            <div style={styles.sectionTitle}>Mejores entradas del día ({filteredBets.length})</div>
            {filteredBets.length === 0 ? (
              <div style={{ color: MUTED, fontSize: "13px", padding: "20px 0" }}>No hay entradas para este filtro.</div>
            ) : (
              <div style={styles.bestBetsGrid}>{filteredBets.map((bet, i) => (<BetCard key={i} bet={bet} rank={bet.rank || i + 1} />))}</div>
            )}

            {data.props_alert?.length > 0 && (
              <>
                <div style={styles.divider} />
                <div style={styles.sectionTitle}>Props Alert</div>
                <div style={styles.bestBetsGrid}>
                  {data.props_alert.map((p, i) => (
                    <div key={i} style={{ ...styles.betCard, borderColor: "#2A2A1A" }}>
                      <div style={{ ...styles.betCardAccent, background: "#FBBF24" }} />
                      <div style={{ paddingLeft: "8px" }}>
                        <span style={{ ...styles.betType, background: "#1A1A0D", color: "#FBBF24" }}>PROP</span>
                        <div style={styles.betGame}>{p.player}</div>
                        <div style={{ ...styles.betSelection, fontSize: "13px" }}>{p.prop}</div>
                        <div style={styles.betReason}>{p.reason}</div>
                        <div style={{ ...styles.confBadge, color: "#FBBF24" }}>{p.confidence}% CONFIANZA</div>
                        <ConfidenceBar pct={p.confidence} color="#FBBF24" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {data.avoid_today && (
              <>
                <div style={styles.divider} />
                <div style={styles.avoidBox}><span style={{ color: "#EF4444", fontWeight: "700", marginRight: "8px" }}>⚠ EVITAR HOY</span>{data.avoid_today}</div>
              </>
            )}

            <div style={{ height: "32px" }} />
            <div style={styles.disclaimer}>DISCLAIMER: Análisis estadístico con fines educativos. API oficial MLB + IA de NVIDIA. Las apuestas conllevan riesgos.</div>
          </>
        )}
      </main>
    </div>
  );
}
