import { useState } from "react";

const WORKS = [
  {
    id: "demolition",
    icon: "🔨",
    name: "철거",
    desc: "기존 마감재 철거",
    unit: "평",
    prices: { basic: 15000, mid: 20000, premium: 28000 },
    note: { basic: "합지·장판 철거 기준", mid: "강마루·타일 철거 기준", premium: "전체 마감재 철거 기준" },
    specialNote: "폐기물 처리비 포함 기준. 석면 등 특수 폐기물 발생 시 추가 비용 발생",
  },
  {
    id: "flooring",
    icon: "🟫",
    name: "바닥재",
    desc: "강화마루·강마루·원목",
    unit: "평",
    prices: { basic: 90000, mid: 170000, premium: 320000 },
    note: { basic: "강화마루 기준 (두께 8~12mm)", mid: "강마루 기준 (두께 6~7mm)", premium: "원목마루 기준 (두께 18mm 이상)" },
    specialNote: "자재비+시공비 포함. 바닥 평탄화 작업 필요 시 추가 비용 발생",
  },
  {
    id: "wallpaper",
    icon: "📜",
    name: "도배",
    desc: "합지·실크·수입벽지",
    unit: "평",
    prices: { basic: 18000, mid: 28000, premium: 45000 },
    note: { basic: "합지벽지 기준", mid: "실크벽지 기준", premium: "수입·친환경 벽지 기준" },
    specialNote: "전용면적 기준 시공면적은 약 2.5~3배. 천장 포함 기준",
  },
  {
    id: "bathroom",
    icon: "🚿",
    name: "욕실",
    desc: "위생도기·타일 교체",
    unit: "개소",
    prices: { basic: 3500000, mid: 5500000, premium: 9000000 },
    note: { basic: "국산 도기·타일 기준", mid: "중급 도기·포세린 타일 기준", premium: "수입 도기·대형 타일 기준" },
    specialNote: "철거+타일+위생도기+방수 포함. 구조 변경·배관 교체 시 추가 비용 발생",
  },
  {
    id: "kitchen",
    icon: "🍳",
    name: "주방",
    desc: "싱크대·상부장",
    unit: "식",
    prices: { basic: 4000000, mid: 7000000, premium: 14000000 },
    note: { basic: "PET·LPM 도어 기준", mid: "UV·도장 도어 기준", premium: "도장·무늬목 도어 기준" },
    specialNote: "상·하부장+상판 포함. 빌트인 가전·타일 작업 별도",
  },
  {
    id: "lighting",
    icon: "💡",
    name: "조명",
    desc: "LED 교체",
    unit: "평",
    prices: { basic: 12000, mid: 22000, premium: 38000 },
    note: { basic: "기본 LED 매입등", mid: "중급 LED+간접조명", premium: "디자인 조명+스마트 시스템" },
    specialNote: "전기 공사 포함 기준. 배선 교체 필요 시 전기 공종 별도 추가 권장",
  },
  {
    id: "molding",
    icon: "📏",
    name: "몰딩",
    desc: "걸레받이·천장 몰딩",
    unit: "평",
    prices: { basic: 10000, mid: 18000, premium: 28000 },
    note: { basic: "PVC 걸레받이 기준", mid: "MDF 몰딩 기준", premium: "목재·특수 몰딩 기준" },
    specialNote: "걸레받이+천장 몰딩 포함 기준",
  },
  {
    id: "door",
    icon: "🚪",
    name: "문·중문",
    desc: "ABS·목재·유리",
    unit: "짝",
    prices: { basic: 400000, mid: 750000, premium: 1400000 },
    note: { basic: "ABS 도어 기준", mid: "MDF 도장 도어 기준", premium: "원목·유리 중문 기준" },
    specialNote: "문짝+문틀+경첩 포함. 철거비 별도",
  },
  {
    id: "sash",
    icon: "🪟",
    name: "샷시",
    desc: "외부창호 교체",
    unit: "세트",
    prices: { basic: 8000000, mid: 14000000, premium: 25000000 },
    note: { basic: "일반 PVC 창호 기준", mid: "시스템창호 기준", premium: "독일식·고단열 시스템창호 기준" },
    specialNote: "전체 세대 창호 교체 기준. 층간 소음·단열 효과 큼. 시공 기간 1~2일",
  },
];

const PYEONG_PRESETS = {
  // 바닥재: 전용평수, 도배: 전용평수×2.6, 몰딩: 전용평수×1.3 (둘레 개념)
  59:  { demolition: 18, flooring: 18, wallpaper: 47, bathroom: 1, kitchen: 1, lighting: 18, molding: 23, door: 4, sash: 1 },
  84:  { demolition: 25, flooring: 25, wallpaper: 65, bathroom: 2, kitchen: 1, lighting: 25, molding: 33, door: 5, sash: 1 },
  119: { demolition: 36, flooring: 36, wallpaper: 93, bathroom: 2, kitchen: 1, lighting: 36, molding: 47, door: 6, sash: 1 },
  132: { demolition: 40, flooring: 40, wallpaper: 104, bathroom: 3, kitchen: 1, lighting: 40, molding: 52, door: 7, sash: 1 },
}

const PYEONG_OPTIONS = [
  { value: 59,  label: "59㎡",  supply: "공급 약 25평", exclusive: "전용 약 18평", desc: "소형 국민평형" },
  { value: 84,  label: "84㎡",  supply: "공급 약 34평", exclusive: "전용 약 25평", desc: "국민평형" },
  { value: 119, label: "119㎡", supply: "공급 약 48평", exclusive: "전용 약 36평", desc: "중대형" },
  { value: 132, label: "132㎡", supply: "공급 약 52평", exclusive: "전용 약 40평", desc: "대형" },
]

const GRADES = [
  {
    id: "basic",
    label: "보급형",
    color: "#94a3b8",
    desc: "실용·합리적",
    details: [
      "국산 중저가 자재 사용",
      "합지벽지·강화마루·국산 도기",
      "기본 기능 중심, 내구성 무난",
      "빠른 시공·저렴한 유지비",
      "전월세·단기 거주에 적합",
    ],
    range: "평당 약 100~150만원 수준",
  },
  {
    id: "mid",
    label: "중급",
    color: "#f59e0b",
    desc: "균형·무난함",
    details: [
      "국산 중고가 자재 사용",
      "실크벽지·강마루·포세린 타일",
      "디자인과 내구성 균형",
      "일반 아파트 리모델링 표준",
      "자가 거주·장기 생활에 적합",
    ],
    range: "평당 약 150~200만원 수준",
  },
  {
    id: "premium",
    label: "고급",
    color: "#6366f1",
    desc: "퀄리티·프리미엄",
    details: [
      "수입·고급 브랜드 자재 사용",
      "수입벽지·원목마루·수입 도기",
      "높은 심미성·프리미엄 마감",
      "맞춤 제작·디자인 컨셉 적용",
      "고급 아파트·펜트하우스에 적합",
    ],
    range: "평당 약 200~300만원 이상",
  },
];

function formatKRW(n) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억원`;
  if (n >= 10000) return `${Math.round(n / 10000).toLocaleString()}만원`;
  return `${n.toLocaleString()}원`;
}

export default function App() {
  const [step, setStep] = useState(0);
  const [area, setArea] = useState(null);
  const [selected, setSelected] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [grade, setGrade] = useState("mid");

  const handlePyeongSelect = (val) => {
    setArea(val);
    setQuantities(PYEONG_PRESETS[val]);
  };

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

  const stepLabels = ["면적·공종 선택", "수량 확인", "등급 선택", "견적 결과"];

  const reset = () => {
    setStep(0); setArea(null); setSelected([]); setQuantities({}); setGrade("mid");
  };

  return (
    <div style={styles.root}>
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.badge}>🏠 인테리어 공사비</div>
          <h1 style={styles.title}>간편 견적기</h1>
          <p style={styles.subtitle}>평형 선택 → 공종 선택 → 즉시 견적</p>
        </div>

        <div style={styles.stepRow}>
          {stepLabels.map((label, i) => (
            <div key={i} style={styles.stepItem}>
              <div style={{
                ...styles.stepDot,
                background: i < step ? "#10b981" : i === step ? "#6366f1" : "#e2e8f0",
                color: i <= step ? "#fff" : "#94a3b8",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{
                ...styles.stepLabel,
                color: i === step ? "#1e293b" : "#94a3b8",
                fontWeight: i === step ? "700" : "400",
              }}>{label}</span>
              {i < stepLabels.length - 1 && <div style={styles.stepLine} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>전용면적을 선택해주세요</h2>
            <p style={styles.cardDesc}>선택하시면 공종별 수량이 자동으로 입력됩니다 (수정 가능)</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 16 }}>
              {PYEONG_OPTIONS.map((p) => (
                <div key={p.value} onClick={() => handlePyeongSelect(p.value)} style={{
                  borderRadius: 12, padding: "10px 4px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  position: "relative", transition: "all 0.2s", userSelect: "none",
                  background: area === p.value ? "#eef2ff" : "#f8fafc",
                  border: area === p.value ? "2px solid #6366f1" : "2px solid #e2e8f0",
                  boxShadow: area === p.value ? "0 4px 16px rgba(99,102,241,0.15)" : "none",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#1e293b" }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, textAlign: "center" }}>{p.desc}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8", textAlign: "center" }}>{p.supply}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8", textAlign: "center" }}>{p.exclusive}</div>
                  {area === p.value && <div style={styles.checkBadge}>✓</div>}
                </div>
              ))}
              <div style={{
                borderRadius: 12, padding: "10px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                position: "relative", userSelect: "none",
                background: typeof area === "number" && !PYEONG_OPTIONS.find(p => p.value === area) ? "#eef2ff" : "#f8fafc",
                border: typeof area === "number" && !PYEONG_OPTIONS.find(p => p.value === area) ? "2px solid #6366f1" : "2px solid #e2e8f0",
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#1e293b" }}>직접입력</div>
                <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700 }}>내 평형</div>
                <input
                  type="number"
                  min="1"
                  placeholder="㎡"
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: "100%", padding: "3px 2px", border: "1.5px solid #c7d2fe", borderRadius: 6, fontSize: 11, fontWeight: 700, textAlign: "center", color: "#1e293b", outline: "none", marginTop: 2, boxSizing: "border-box" }}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > 0) {
                      const preset = Object.keys(PYEONG_PRESETS).reduce((closest, key) =>
                        Math.abs(key - val) < Math.abs(closest - val) ? parseInt(key) : closest, 84
                      );
                      const ratio = val / preset;
                      const base = PYEONG_PRESETS[preset];
                      const custom = {};
                      Object.keys(base).forEach(k => {
                        custom[k] = ["bathroom", "kitchen", "sash"].includes(k) ? base[k] : Math.round(base[k] * ratio);
                      });
                      setArea(val);
                      setQuantities(custom);
                    }
                  }}
                />
                <div style={{ fontSize: 9, color: "#94a3b8" }}>전용면적</div>
              </div>
            </div>

            <div style={{ ...styles.divider }} />

            <h2 style={styles.cardTitle}>어떤 공사를 하실 건가요?</h2>
            <p style={styles.cardDesc}>해당하는 공종을 모두 선택하세요</p>
            <div style={{
              ...styles.grid,
              opacity: !area ? 0.35 : 1,
              pointerEvents: !area ? "none" : "auto",
              transition: "opacity 0.3s",
            }}>
              {WORKS.map((w) => {
                const isOn = selected.includes(w.id);
                return (
                  <div key={w.id} onClick={() => toggleWork(w.id)} style={{
                    ...styles.workCard,
                    background: isOn ? "#eef2ff" : "#f8fafc",
                    border: isOn ? "2px solid #6366f1" : "2px solid #e2e8f0",
                    transform: isOn ? "translateY(-2px)" : "none",
                    boxShadow: isOn ? "0 4px 16px rgba(99,102,241,0.15)" : "none",
                  }}>
                    <span style={styles.workIcon}>{w.icon}</span>
                    <span style={styles.workName}>{w.name}</span>
                    <span style={styles.workDesc}>{w.desc}</span>
                    {isOn && <div style={styles.checkBadge}>✓</div>}
                  </div>
                );
              })}
            </div>
            {!area && (
              <div style={styles.pyeongHint}>⬆ 전용면적을 먼저 선택해주세요</div>
            )}
            <button style={{
              ...styles.btn,
              opacity: (!area || selected.length === 0) ? 0.4 : 1,
              cursor: (!area || selected.length === 0) ? "not-allowed" : "pointer",
            }}
              onClick={() => area && selected.length > 0 && setStep(1)}>다음 단계 →</button>
          </div>
        )}

        {step === 1 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>수량을 확인해주세요</h2>
            <p style={styles.cardDesc}>전용 {area}㎡ 기준으로 자동 입력됐어요. 다르면 수정하세요</p>
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
                    <input type="number" min="0" value={quantities[w.id] || ""}
                      onChange={(e) => setQuantities((prev) => ({ ...prev, [w.id]: e.target.value }))}
                      style={styles.input} />
                    <span style={styles.unitLabel}>{w.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(0)}>← 이전</button>
              <button style={{ ...styles.btn, opacity: !allQuantitiesFilled ? 0.4 : 1, cursor: !allQuantitiesFilled ? "not-allowed" : "pointer" }}
                onClick={() => allQuantitiesFilled && setStep(2)}>다음 단계 →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>마감 등급을 선택하세요</h2>
            <p style={styles.cardDesc}>원하는 품질 수준을 골라주세요</p>
            <div style={styles.gradeList}>
              {GRADES.map((g) => (
                <div key={g.id} onClick={() => setGrade(g.id)} style={{
                  ...styles.gradeCard,
                  border: grade === g.id ? `2.5px solid ${g.color}` : "2.5px solid #e2e8f0",
                  background: grade === g.id ? "#f8fafc" : "#fff",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                    <div style={{ ...styles.gradeDot, background: g.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={styles.gradeLabel}>{g.label}</div>
                      <div style={styles.gradeDesc}>{g.desc} · {g.range}</div>
                    </div>
                    {grade === g.id && <div style={{ ...styles.checkBadge, position: "static", flexShrink: 0, background: g.color }}>✓</div>}
                  </div>
                  {grade === g.id && (
                    <div style={styles.gradeDetailBox}>
                      {g.details.map((d, i) => (
                        <div key={i} style={styles.gradeDetailItem}>· {d}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(1)}>← 이전</button>
              <button style={styles.btn} onClick={() => setStep(3)}>견적 보기 →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📋 견적 결과</h2>
            <p style={styles.cardDesc}>전용 {area}㎡ · {GRADES.find((g) => g.id === grade)?.label} 기준</p>
            <div style={styles.resultList}>
              {selectedWorks.map((w) => {
                const qty = parseFloat(quantities[w.id] || 0);
                const amount = qty * w.prices[grade];
                return (
                  <div key={w.id} style={styles.resultBlock}>
                    <div style={styles.resultRow}>
                      <div style={styles.resultLeft}>
                        <span>{w.icon}</span>
                        <span style={styles.resultName}>{w.name}</span>
                      </div>
                      <div style={styles.resultAmount}>{formatKRW(amount)}</div>
                    </div>
                    <div style={styles.resultCalc}>
                      {qty}{w.unit} × {formatKRW(w.prices[grade])} — {w.note[grade]}
                    </div>
                    {w.specialNote && (
                      <div style={styles.specialNote}>※ {w.specialNote}</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={styles.totalBox}>
              <div style={styles.totalLabel}>총 예상 공사비</div>
              <div style={styles.totalAmount}>{formatKRW(total)}</div>
              <div style={styles.totalNote}>※ 현장 상황에 따라 ±20% 차이 있을 수 있습니다</div>
            </div>

            <div style={styles.disclaimerBox}>
              <div style={styles.disclaimerTitle}>📌 견적 산출 기준</div>
              <div style={styles.disclaimerText}>· 2026년 수도권 시장 평균 단가 기준</div>
              <div style={styles.disclaimerText}>· 자재비 + 시공비 + 부가세 포함</div>
              <div style={styles.disclaimerText}>· 구조 변경·배관 교체는 별도 비용 발생</div>
              <div style={styles.disclaimerText}>· 정확한 견적은 현장 실측 후 전문업체 확인 필요</div>
            </div>

            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(2)}>← 이전</button>
              <button style={styles.btn} onClick={reset}>다시 계산하기</button>
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
    position: "relative", overflow: "hidden", padding: "24px 16px 48px",
  },
  bgCircle1: { position: "fixed", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" },
  bgCircle2: { position: "fixed", bottom: -100, left: -100, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)", pointerEvents: "none" },
  container: { maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 1 },
  header: { textAlign: "center", marginBottom: 28 },
  badge: { display: "inline-block", background: "#eef2ff", color: "#6366f1", borderRadius: 20, padding: "8px 20px", fontSize: 16, fontWeight: 800, marginBottom: 10, letterSpacing: 0.5 },
  title: { fontSize: 34, fontWeight: 900, color: "#1e293b", margin: "0 0 6px", letterSpacing: -1 },
  subtitle: { fontSize: 14, color: "#64748b", margin: 0 },
  stepRow: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, gap: 0 },
  stepItem: { display: "flex", alignItems: "center", gap: 4 },
  stepDot: { width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, transition: "all 0.3s" },
  stepLabel: { fontSize: 10, whiteSpace: "nowrap" },
  stepLine: { width: 10, height: 2, background: "#e2e8f0", margin: "0 2px" },
  card: { background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" },
  cardTitle: { fontSize: 20, fontWeight: 800, color: "#1e293b", margin: "0 0 6px" },
  cardDesc: { fontSize: 13, color: "#64748b", margin: "0 0 20px" },
  pyeongGrid: { display: "flex", flexWrap: "nowrap", gap: 6, marginBottom: 16 },
  pyeongCard: { borderRadius: 12, padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, position: "relative", transition: "all 0.2s", userSelect: "none", flex: 1, minWidth: 0 },
  pyeongLabel: { fontSize: 12, fontWeight: 800, color: "#1e293b" },
  pyeongSub: { fontSize: 9, color: "#94a3b8", textAlign: "center" },
  pyeongDesc: { fontSize: 10, color: "#6366f1", fontWeight: 700, textAlign: "center" },
  customPyeongInput: { width: "100%", padding: "3px 4px", border: "1.5px solid #c7d2fe", borderRadius: 6, fontSize: 12, fontWeight: 700, textAlign: "center", color: "#1e293b", outline: "none", marginTop: 2, boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 24 },
  workCard: { borderRadius: 14, padding: "14px 10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative", transition: "all 0.2s", userSelect: "none" },
  workIcon: { fontSize: 26 },
  workName: { fontSize: 13, fontWeight: 700, color: "#1e293b" },
  workDesc: { fontSize: 11, color: "#94a3b8", textAlign: "center" },
  checkBadge: { position: "absolute", top: 8, right: 8, background: "#6366f1", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  btn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3, transition: "opacity 0.2s" },
  btnSecondary: { flex: 1, padding: "14px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  btnRow: { display: "flex", gap: 10, marginTop: 20 },
  qtyList: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 },
  qtyRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", borderRadius: 12, padding: "12px 16px", gap: 12 },
  qtyLeft: { display: "flex", alignItems: "center", gap: 10 },
  qtyName: { fontSize: 14, fontWeight: 700, color: "#1e293b" },
  qtyUnit: { fontSize: 11, color: "#94a3b8" },
  qtyRight: { display: "flex", alignItems: "center", gap: 6 },
  input: { width: 70, padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 15, fontWeight: 700, textAlign: "right", color: "#1e293b", outline: "none" },
  unitLabel: { fontSize: 12, color: "#64748b", fontWeight: 600, minWidth: 18 },
  gradeList: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 },
  gradeCard: { display: "flex", alignItems: "center", gap: 14, borderRadius: 14, padding: "16px 18px", cursor: "pointer", position: "relative", transition: "all 0.2s" },
  gradeDot: { width: 16, height: 16, borderRadius: "50%", flexShrink: 0 },
  gradeLabel: { fontSize: 15, fontWeight: 800, color: "#1e293b" },
  gradeDesc: { fontSize: 12, color: "#94a3b8" },
  resultList: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  resultBlock: { background: "#f8fafc", borderRadius: 12, padding: "12px 14px" },
  resultRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  resultLeft: { display: "flex", alignItems: "center", gap: 8 },
  resultName: { fontSize: 14, fontWeight: 700, color: "#1e293b" },
  resultAmount: { fontSize: 15, fontWeight: 800, color: "#6366f1", whiteSpace: "nowrap" },
  resultCalc: { fontSize: 11, color: "#64748b", marginTop: 2 },
  specialNote: { fontSize: 11, color: "#f59e0b", marginTop: 4, lineHeight: 1.5 },
  totalBox: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 12 },
  totalLabel: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 6 },
  totalAmount: { fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1 },
  totalNote: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 6 },
  disclaimerBox: { background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 8 },
  disclaimerTitle: { fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 8 },
  disclaimerText: { fontSize: 11, color: "#64748b", lineHeight: 2 },
  gradeDetailBox: { marginTop: 12, paddingTop: 12, borderTop: "1px solid #e2e8f0", width: "100%" },
  gradeDetailItem: { fontSize: 12, color: "#475569", lineHeight: 1.9 },
  divider: { borderTop: "1.5px solid #f1f5f9", margin: "20px 0" },
  pyeongHint: { textAlign: "center", fontSize: 13, color: "#94a3b8", marginBottom: 12 },
};
