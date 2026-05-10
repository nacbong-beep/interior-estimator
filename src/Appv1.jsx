import { useState } from "react";

const WORKS = [
  {
    id: "demolition",
    icon: "🔨",
    name: "철거",
    desc: "기존 마감재 철거",
    unit: "평",
    prices: { basic: 10000, mid: 15000, premium: 20000 },
  },
  {
    id: "flooring",
    icon: "🪵",
    name: "바닥재",
    desc: "강화마루·강마루·원목",
    unit: "평",
    prices: { basic: 90000, mid: 170000, premium: 320000 },
  },
  {
    id: "wallpaper",
    icon: "🖼️",
    name: "도배",
    desc: "합지·실크·수입벽지",
    unit: "평",
    prices: { basic: 18000, mid: 28000, premium: 45000 },
  },
  {
    id: "paint",
    icon: "🎨",
    name: "도장",
    desc: "벽면 페인트",
    unit: "평",
    prices: { basic: 15000, mid: 22000, premium: 35000 },
  },
  {
    id: "bathroom",
    icon: "🚿",
    name: "욕실",
    desc: "위생도기·타일 교체",
    unit: "개소",
    prices: { basic: 2500000, mid: 4500000, premium: 7000000 },
  },
  {
    id: "kitchen",
    icon: "🍳",
    name: "주방",
    desc: "싱크대·상부장",
    unit: "식",
    prices: { basic: 3000000, mid: 6000000, premium: 12000000 },
  },
  {
    id: "lighting",
    icon: "💡",
    name: "조명",
    desc: "LED 교체",
    unit: "평",
    prices: { basic: 8000, mid: 15000, premium: 28000 },
  },
  {
    id: "molding",
    icon: "📐",
    name: "몰딩",
    desc: "걸레받이·천장 몰딩",
    unit: "평",
    prices: { basic: 8000, mid: 14000, premium: 22000 },
  },
  {
    id: "door",
    icon: "🚪",
    name: "문·중문",
    desc: "ABS·목재·유리",
    unit: "짝",
    prices: { basic: 350000, mid: 650000, premium: 1200000 },
  },
  {
    id: "electric",
    icon: "⚡",
    name: "전기",
    desc: "콘센트·스위치 교체",
    unit: "평",
    prices: { basic: 10000, mid: 16000, premium: 25000 },
  },
];

const GRADES = [
  { id: "basic", label: "보급형", color: "#94a3b8", desc: "실용·합리적" },
  { id: "mid", label: "중급", color: "#f59e0b", desc: "균형·무난함" },
  { id: "premium", label: "고급", color: "#6366f1", desc: "퀄리티·프리미엄" },
];

function formatKRW(n) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억원`;
  if (n >= 10000) return `${Math.round(n / 10000).toLocaleString()}만원`;
  return `${n.toLocaleString()}원`;
}

export default function App() {
  const [step, setStep] = useState(1); // 1: 공종선택, 2: 면적/수량, 3: 등급, 4: 결과
  const [selected, setSelected] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [grade, setGrade] = useState("mid");

  const toggleWork = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedWorks = WORKS.filter((w) => selected.includes(w.id));

  const total = selectedWorks.reduce((sum, w) => {
    const qty = parseFloat(quantities[w.id] || 0);
    return sum + qty * w.prices[grade];
  }, 0);

  const allQuantitiesFilled = selectedWorks.every(
    (w) => quantities[w.id] && parseFloat(quantities[w.id]) > 0
  );

  const stepLabels = ["공종 선택", "수량 입력", "등급 선택", "견적 결과"];

  return (
    <div style={styles.root}>
      {/* BG decoration */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>🏗️ 인테리어 공사비</div>
          <h1 style={styles.title}>간편 견적기</h1>
          <p style={styles.subtitle}>공종 선택 → 수량 입력 → 견적 완성</p>
        </div>

        {/* Step indicator */}
        <div style={styles.stepRow}>
          {stepLabels.map((label, i) => (
            <div key={i} style={styles.stepItem}>
              <div
                style={{
                  ...styles.stepDot,
                  background:
                    i + 1 < step
                      ? "#10b981"
                      : i + 1 === step
                      ? "#6366f1"
                      : "#e2e8f0",
                  color: i + 1 <= step ? "#fff" : "#94a3b8",
                }}
              >
                {i + 1 < step ? "✓" : i + 1}
              </div>
              <span
                style={{
                  ...styles.stepLabel,
                  color: i + 1 === step ? "#1e293b" : "#94a3b8",
                  fontWeight: i + 1 === step ? "700" : "400",
                }}
              >
                {label}
              </span>
              {i < stepLabels.length - 1 && <div style={styles.stepLine} />}
            </div>
          ))}
        </div>

        {/* STEP 1: 공종 선택 */}
        {step === 1 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>어떤 공사를 하실 건가요?</h2>
            <p style={styles.cardDesc}>해당하는 공종을 모두 선택하세요</p>
            <div style={styles.grid}>
              {WORKS.map((w) => {
                const isOn = selected.includes(w.id);
                return (
                  <div
                    key={w.id}
                    onClick={() => toggleWork(w.id)}
                    style={{
                      ...styles.workCard,
                      background: isOn ? "#eef2ff" : "#f8fafc",
                      border: isOn ? "2px solid #6366f1" : "2px solid #e2e8f0",
                      transform: isOn ? "translateY(-2px)" : "none",
                      boxShadow: isOn
                        ? "0 4px 16px rgba(99,102,241,0.15)"
                        : "none",
                    }}
                  >
                    <span style={styles.workIcon}>{w.icon}</span>
                    <span style={styles.workName}>{w.name}</span>
                    <span style={styles.workDesc}>{w.desc}</span>
                    {isOn && <div style={styles.checkBadge}>✓</div>}
                  </div>
                );
              })}
            </div>
            <button
              style={{
                ...styles.btn,
                opacity: selected.length === 0 ? 0.4 : 1,
                cursor: selected.length === 0 ? "not-allowed" : "pointer",
              }}
              onClick={() => selected.length > 0 && setStep(2)}
            >
              다음 단계 →
            </button>
          </div>
        )}

        {/* STEP 2: 수량 입력 */}
        {step === 2 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>수량을 입력해주세요</h2>
            <p style={styles.cardDesc}>아파트 전용면적 기준으로 입력하세요</p>
            <div style={styles.qtyList}>
              {selectedWorks.map((w) => (
                <div key={w.id} style={styles.qtyRow}>
                  <div style={styles.qtyLeft}>
                    <span style={{ fontSize: 22 }}>{w.icon}</span>
                    <div>
                      <div style={styles.qtyName}>{w.name}</div>
                      <div style={styles.qtyUnit}>{w.unit} 단위</div>
                    </div>
                  </div>
                  <div style={styles.qtyRight}>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={quantities[w.id] || ""}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [w.id]: e.target.value,
                        }))
                      }
                      style={styles.input}
                    />
                    <span style={styles.unitLabel}>{w.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(1)}>
                ← 이전
              </button>
              <button
                style={{
                  ...styles.btn,
                  opacity: !allQuantitiesFilled ? 0.4 : 1,
                  cursor: !allQuantitiesFilled ? "not-allowed" : "pointer",
                }}
                onClick={() => allQuantitiesFilled && setStep(3)}
              >
                다음 단계 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 등급 선택 */}
        {step === 3 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>마감 등급을 선택하세요</h2>
            <p style={styles.cardDesc}>원하는 품질 수준을 골라주세요</p>
            <div style={styles.gradeList}>
              {GRADES.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setGrade(g.id)}
                  style={{
                    ...styles.gradeCard,
                    border:
                      grade === g.id
                        ? `2.5px solid ${g.color}`
                        : "2.5px solid #e2e8f0",
                    background: grade === g.id ? "#f8fafc" : "#fff",
                  }}
                >
                  <div
                    style={{
                      ...styles.gradeDot,
                      background: g.color,
                    }}
                  />
                  <div>
                    <div style={styles.gradeLabel}>{g.label}</div>
                    <div style={styles.gradeDesc}>{g.desc}</div>
                  </div>
                  {grade === g.id && (
                    <div
                      style={{ ...styles.checkBadge, background: g.color }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(2)}>
                ← 이전
              </button>
              <button style={styles.btn} onClick={() => setStep(4)}>
                견적 보기 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: 결과 */}
        {step === 4 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📋 견적 결과</h2>
            <p style={styles.cardDesc}>
              {GRADES.find((g) => g.id === grade)?.label} 기준 개략 견적
            </p>

            <div style={styles.resultList}>
              {selectedWorks.map((w) => {
                const qty = parseFloat(quantities[w.id] || 0);
                const amount = qty * w.prices[grade];
                return (
                  <div key={w.id} style={styles.resultRow}>
                    <div style={styles.resultLeft}>
                      <span>{w.icon}</span>
                      <span style={styles.resultName}>{w.name}</span>
                      <span style={styles.resultQty}>
                        {qty}
                        {w.unit} × {formatKRW(w.prices[grade])}
                      </span>
                    </div>
                    <div style={styles.resultAmount}>{formatKRW(amount)}</div>
                  </div>
                );
              })}
            </div>

            <div style={styles.totalBox}>
              <div style={styles.totalLabel}>총 예상 공사비</div>
              <div style={styles.totalAmount}>{formatKRW(total)}</div>
              <div style={styles.totalNote}>
                ※ 현장 상황에 따라 ±20% 차이 있을 수 있습니다
              </div>
            </div>

            <div style={styles.disclaimer}>
              이 견적은 참고용 개략 금액입니다. 정확한 견적은 현장 실측 후
              전문업체 확인이 필요합니다.
            </div>

            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(3)}>
                ← 이전
              </button>
              <button
                style={styles.btn}
                onClick={() => {
                  setStep(1);
                  setSelected([]);
                  setQuantities({});
                  setGrade("mid");
                }}
              >
                다시 계산하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 60%, #fff7ed 100%)",
    fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "24px 16px 48px",
  },
  bgCircle1: {
    position: "fixed",
    top: -120,
    right: -120,
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "fixed",
    bottom: -100,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: 560,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: 28,
  },
  badge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#6366f1",
    borderRadius: 20,
    padding: "6px 16px",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: 900,
    color: "#1e293b",
    margin: "0 0 6px",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    margin: 0,
  },
  stepRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 0,
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
    transition: "all 0.3s",
  },
  stepLabel: {
    fontSize: 11,
    whiteSpace: "nowrap",
  },
  stepLine: {
    width: 20,
    height: 2,
    background: "#e2e8f0",
    margin: "0 4px",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px 24px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1e293b",
    margin: "0 0 6px",
  },
  cardDesc: {
    fontSize: 13,
    color: "#64748b",
    margin: "0 0 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: 10,
    marginBottom: 24,
  },
  workCard: {
    borderRadius: 14,
    padding: "14px 10px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    position: "relative",
    transition: "all 0.2s",
    userSelect: "none",
  },
  workIcon: { fontSize: 26 },
  workName: { fontSize: 13, fontWeight: 700, color: "#1e293b" },
  workDesc: { fontSize: 11, color: "#94a3b8", textAlign: "center" },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "#6366f1",
    color: "#fff",
    borderRadius: "50%",
    width: 18,
    height: 18,
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 0.3,
    transition: "opacity 0.2s",
  },
  btnSecondary: {
    flex: 1,
    padding: "14px",
    background: "#f1f5f9",
    color: "#64748b",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnRow: {
    display: "flex",
    gap: 10,
    marginTop: 20,
  },
  qtyList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 8,
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f8fafc",
    borderRadius: 12,
    padding: "12px 16px",
    gap: 12,
  },
  qtyLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  qtyName: { fontSize: 14, fontWeight: 700, color: "#1e293b" },
  qtyUnit: { fontSize: 11, color: "#94a3b8" },
  qtyRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  input: {
    width: 70,
    padding: "8px 10px",
    border: "2px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    textAlign: "right",
    color: "#1e293b",
    outline: "none",
  },
  unitLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 600,
    minWidth: 18,
  },
  gradeList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 8,
  },
  gradeCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    padding: "16px 18px",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s",
  },
  gradeDot: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    flexShrink: 0,
  },
  gradeLabel: { fontSize: 15, fontWeight: 800, color: "#1e293b" },
  gradeDesc: { fontSize: 12, color: "#94a3b8" },
  resultList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  resultRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f8fafc",
    borderRadius: 10,
    padding: "10px 14px",
  },
  resultLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
    flexWrap: "wrap",
  },
  resultName: { fontSize: 13, fontWeight: 700, color: "#1e293b" },
  resultQty: { fontSize: 11, color: "#94a3b8" },
  resultAmount: { fontSize: 14, fontWeight: 800, color: "#6366f1", whiteSpace: "nowrap" },
  totalBox: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: 16,
    padding: "20px",
    textAlign: "center",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 6 },
  totalAmount: { fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1 },
  totalNote: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 6 },
  disclaimer: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 1.6,
    marginBottom: 4,
  },
};
