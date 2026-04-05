"use client";

import { useEffect, useState } from "react";

const tabs = ["AP日報", "モーニング", "ミーティング", "OB", "定着"];

const templates = {
  AP日報: ["標準AP日報"],
  モーニング: ["モーニング振り返り", "モーニング依頼"],
  ミーティング: ["ミーティング振り返り", "セットアップ"],
  OB: ["OB振り返り"],
  定着: ["定着振り返り"],
};

function getTodayDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

function createEmptyTabData() {
  const today = getTodayDate();

  return {
    AP日報: {
      date: today,
      text: "",
      goodPoint: "",
      improvementPoint: "",
      apSystem: "",
      result: "",
    },
    モーニング: {
      date: today,
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
      date: today,
      speaker: "",
      content: "",
      insight: "",
      ap: "",
      result: "",
    },
    OB: {
      date: today,
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
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("AP日報");
  const [template, setTemplate] = useState("標準AP日報");
  const [isMobile, setIsMobile] = useState(false);
  const [tabData, setTabData] = useState(createEmptyTabData());

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
    const fresh = createEmptyTabData();
    setTabData((prev) => ({
      ...prev,
      [activeTab]: { ...fresh[activeTab] },
    }));
  };

  const handleGenerate = () => {
    let resultText = "";

    if (activeTab === "AP日報") {
      resultText =
        `【AP日報】\n` +
        `日付: ${currentData.date}\n\n` +
        `【内容】\n${currentData.text}\n\n` +
        `～システムの振り返り～\n` +
        `【良かった点】\n${currentData.goodPoint}\n\n` +
        `【改善点】\n${currentData.improvementPoint}\n\n` +
        `【AP】\n${currentData.apSystem}`;
    }

    if (activeTab === "モーニング" && template === "モーニング振り返り") {
      resultText =
        `【モーニング振り返り】\n` +
        `日付: ${currentData.date}\n\n` +
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

    if (activeTab === "ミーティング" && template === "ミーティング振り返り") {
      resultText =
        `【ミーティング振り返り】\n` +
        `日付: ${currentData.date}\n` +
        `スピーカー: ${currentData.speaker}\n\n` +
        `【内容】\n${currentData.content}\n\n` +
        `【気づき】\n${currentData.insight}\n\n` +
        `【AP】\n${currentData.ap}`;
    }

    if (activeTab === "ミーティング" && template === "セットアップ") {
      resultText =
        `【セットアップ】\n` +
        `日付: ${currentData.date}\n` +
        `セットアップした方: ${currentData.speaker}\n\n` +
        `【内容】\n${currentData.content}\n\n` +
        `【気づき】\n${currentData.insight}\n\n` +
        `【AP】\n${currentData.ap}`;
    }

    if (activeTab === "OB") {
      resultText =
        `【OB振り返り】\n` +
        `日付: ${currentData.date}\n` +
        `名前: ${currentData.name}\n` +
        `年齢: ${currentData.age}\n\n` +
        `【内容】\n${currentData.content}`;
    }

    if (activeTab === "定着") {
      resultText =
        `【定着振り返り】\n` +
        `名前: ${currentData.name}\n\n` +
        `【今日話した内容】\n${currentData.todayTalk}`;
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

      <div style={{ padding: "24px" }}>
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
          style={{ padding: "10px", borderRadius: "8px", marginBottom: "20px" }}
        >
          {templates[activeTab].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "20px" }}>
            <h2>{activeTab} 入力</h2>

            <button onClick={handleReset}>リセット</button>

            <input
              placeholder="日付"
              value={currentData.date || ""}
              onChange={(e) => updateField("date", e.target.value)}
              style={{ width: "100%", marginTop: "10px" }}
            />

            <textarea
              placeholder="内容"
              value={currentData.text || currentData.content || ""}
              onChange={(e) => updateField("text", e.target.value)}
              style={{ width: "100%", height: "150px", marginTop: "10px" }}
            />

            <button onClick={handleGenerate} style={{ marginTop: "10px" }}>
              生成
            </button>
          </div>

          <div style={{ background: "white", borderRadius: "16px", padding: "20px" }}>
            <h2>生成コメント</h2>

            <button onClick={handleCopy}>コピー</button>

            <div style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
              {currentData.result || "ここに結果が出る"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
