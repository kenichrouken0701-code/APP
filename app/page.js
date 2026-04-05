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
  AP日報: {
    person: "",
    date: "", // ←追加
    text: "",
    goodPoint: "",
    improvementPoint: "",
    apSystem: "",
    result: "",
  },
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
    date: "", // ←追加
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
        `日付: ${currentData.date}\n\n` + // ←追加
        `【内容】\n${currentData.text}\n\n` +
        `～システムの振り返り～\n` +
        `【良かった点】\n${currentData.goodPoint}\n\n` +
        `【改善点】\n${currentData.improvementPoint}\n\n` +
        `【AP】\n${currentData.apSystem}`;
    }

    if (activeTab === "ミーティング") {
      resultText =
        `【ミーティング振り返り】\n` +
        `担当者/AP名: ${currentData.person}\n` +
        `日付: ${currentData.date}\n` + // ←追加
        `スピーカー: ${currentData.speaker}\n\n` +
        `【内容】\n${currentData.content}\n\n` +
        `【気づき】\n${currentData.insight}\n\n` +
        `【AP】\n${currentData.ap}`;
    }

    updateField("result", resultText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentData.result || "");
    alert("コピーしました！");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7" }}>
      <div style={headerStyle}>振り返りシート</div>

      <div style={{ padding: "24px" }}>
        <div style={tabStyle}>
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

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h2>{activeTab} 入力</h2>

            <input
              placeholder="担当者/AP名"
              style={inputStyle}
              value={currentData.person}
              onChange={(e) => updateField("person", e.target.value)}
            />

            {(activeTab === "AP日報" || activeTab === "ミーティング") && (
              <input
                placeholder="日付"
                style={inputStyle}
                value={currentData.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            )}

            <button onClick={handleGenerate} style={mainButton}>
              生成
            </button>
          </div>

          <div style={cardStyle}>
            <h2>生成コメント</h2>

            <button onClick={handleCopy} style={subButton}>
              コピー
            </button>

            <div style={resultBox}>
              {currentData.result || "ここに結果が出る"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const headerStyle = {
  background: "#eab308",
  color: "white",
  padding: "20px",
  fontSize: "26px",
  fontWeight: "bold",
};

const tabStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const mainButton = {
  background: "#eab308",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
};

const subButton = {
  background: "#eab308",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "6px",
};

const resultBox = {
  marginTop: "10px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  minHeight: "200px",
  whiteSpace: "pre-wrap",
};
