"use client";

import { useEffect, useState } from "react";

const tabs = ["AP日報", "モーニング", "ミーティング", "OB", "定着"];

const templates = {
  AP日報: ["標準AP日報"],
  モーニング: ["モーニング振り返り", "モーニング依頼"],
  ミーティング: ["ミーティング振り返り"],
  OB: ["OB振り返り"],
  定着: ["定着振り返り"],
};

const emptyTabData = {
  AP日報: { person: "", text: "", result: "" },
  モーニング: {
    person: "",
    date: "",
    manner: "",
    impact: "",
    speaker: "",
    content: "",
    insight: "",
    ap: "",
    vision: "",
    targetAge: "",
    joinWeek: "",
    currentState: "",
    issue: "",
    request: "",
    landing: "",
    result: "",
  },
  ミーティング: {
    person: "",
    speaker: "",
    content: "",
    insight: "",
    ap: "",
    result: "",
  },
  OB: {
    person: "",
    date: "",
    name: "",
    age: "",
    content: "",
    goal: "",
    crisis: "",
    proposal: "",
    good: "",
    problem: "",
    solution: "",
    result: "",
  },
  定着: {
    person: "",
    name: "",
    base: "",
    hours: "",
    talked: "",
    attendance: "",
    deadline: "",
    todayTalk: "",
    nextState: "",
    result: "",
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("AP日報");
  const [template, setTemplate] = useState("標準AP日報");
  const [isMobile, setIsMobile] = useState(false);
  const [tabData, setTabData] = useState(emptyTabData);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const currentData = tabData[activeTab];

  const updateField = (field, value) => {
    setTabData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value,
      },
    }));
  };

  const handleReset = () => {
    setTabData((prev) => ({
      ...prev,
      [activeTab]: { ...emptyTabData[activeTab] },
    }));
  };

  const handleGenerate = () => {
    let resultText = "";

    if (activeTab === "AP日報") {
      resultText =
        `【AP日報】\n` +
        `担当者/AP名: ${currentData.person}\n` +
        `内容:\n${currentData.text}`;
    }

    if (activeTab === "モーニング" && template === "モーニング振り返り") {
      resultText =
        `【モーニング振り返り】\n` +
        `担当者/AP名: ${currentData.person}\n` +
        `日付: ${currentData.date}\n` +
        `【マナー】\n${currentData.manner}\n\n` +
        `【インパクト】\n${currentData.impact}\n\n` +
        `スピーカー: ${currentData.speaker}\n\n` +
        `【内容】\n${currentData.content}\n\n` +
        `【気づき】\n${currentData.insight}\n\n` +
        `【AP】\n${currentData.ap}\n\n` +
        `【ビジョン】\n${currentData.vision}`;
    }

    if (activeTab === "モーニング" && template === "モーニング依頼") {
      resultText =
        `【モーニング依頼】\n` +
        `ターゲット（年齢）: ${currentData.targetAge}\n` +
        `入社〇週目: ${currentData.joinWeek}\n\n` +
        `【現状】\n${currentData.currentState}\n\n` +
        `【課題】\n${currentData.issue}\n\n` +
        `【要望】\n${currentData.request}\n\n` +
        `【着地】\n${currentData.landing}`;
    }

    if (activeTab === "ミーティング") {
      resultText =
        `【ミーティング振り返り】\n` +
        `担当者/AP名: ${currentData.person}\n` +
        `スピーカー: ${currentData.speaker}\n\n` +
        `【内容】\n${currentData.content}\n\n` +
        `【気づき】\n${currentData.insight}\n\n` +
        `【AP】\n${currentData.ap}`;
    }

    if (activeTab === "OB") {
      resultText =
        `【OB振り返り】\n` +
        `担当者/AP名: ${currentData.person}\n` +
        `日付: ${currentData.date}\n` +
        `名前: ${currentData.name}\n` +
        `年齢: ${currentData.age}\n\n` +
        `【内容】\n${currentData.content}\n\n` +
        `【その人の魅力的な目標】\n${currentData.goal}\n\n` +
        `【その人の危機感】\n${currentData.crisis}\n\n` +
        `【どう提案したのか？】\n${currentData.proposal}\n\n` +
        `【よかった点】\n${currentData.good}\n\n` +
        `【問題点】\n${currentData.problem}\n\n` +
        `【改善策】\n${currentData.solution}`;
    }

    if (activeTab === "定着") {
      resultText =
        `【定着振り返り】\n` +
        `担当者/AP名: ${currentData.person}\n` +
        `名前: ${currentData.name}\n` +
        `稼働拠点: ${currentData.base}\n` +
        `稼働時間: ${currentData.hours}\n` +
        `トーク覚えたか: ${currentData.talked}\n` +
        `勤怠ブレあったか: ${currentData.attendance}\n` +
        `生活デッドライン: ${currentData.deadline}\n\n` +
        `【今日話した内容】\n${currentData.todayTalk}\n\n` +
        `【1週間後どういう状態にするか】\n${currentData.nextState}`;
    }

    updateField("result", resultText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentData.result || "");
    alert("コピーしました！");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7" }}>
      <div style={{ background: "#eab308", color: "white", padding: "20px", fontSize: "26px", fontWeight: "bold" }}>
        振り返りシート
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setTemplate(templates[tab][0]);
              }}
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                border: "none",
                background: activeTab === tab ? "#eab308" : "#ddd",
                color: activeTab === tab ? "white" : "#333",
                fontWeight: "bold",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={{ padding: "12px", marginBottom: "20px", borderRadius: "10px" }}
        >
          {templates[activeTab].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px" }}>
          
          {/* 左 */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>{activeTab} 入力</h2>
              <button onClick={handleReset}>リセット</button>
            </div>

            {/* 👇ここが今回のポイント */}
            {!(activeTab === "モーニング" && template === "モーニング依頼") && (
              <input
                placeholder="担当者/AP名"
                value={currentData.person || ""}
                onChange={(e) => updateField("person", e.target.value)}
                style={inputStyle}
              />
            )}

            {/* モーニング依頼 */}
            {activeTab === "モーニング" && template === "モーニング依頼" && (
              <>
                <input placeholder="ターゲット（年齢）" value={currentData.targetAge} onChange={(e) => updateField("targetAge", e.target.value)} style={inputStyle} />
                <input placeholder="入社〇週目" value={currentData.joinWeek} onChange={(e) => updateField("joinWeek", e.target.value)} style={inputStyle} />
                <textarea placeholder="【現状】" value={currentData.currentState} onChange={(e) => updateField("currentState", e.target.value)} style={textareaStyle} />
                <textarea placeholder="【課題】" value={currentData.issue} onChange={(e) => updateField("issue", e.target.value)} style={textareaStyle} />
                <textarea placeholder="【要望】" value={currentData.request} onChange={(e) => updateField("request", e.target.value)} style={textareaStyle} />
                <textarea placeholder="【着地】" value={currentData.landing} onChange={(e) => updateField("landing", e.target.value)} style={textareaStyle} />
              </>
            )}

            <button onClick={handleGenerate} style={mainButton}>
              生成
            </button>
          </div>

          {/* 右 */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2>生成コメント</h2>
            <button onClick={handleCopy}>コピー</button>
            <div style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
              {currentData.result}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

const textareaStyle = {
  width: "100%",
  height: "100px",
  marginBottom: "10px",
};

const mainButton = {
  background: "#eab308",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
};
