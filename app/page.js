"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "reflection_sheet_v1";

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
      quitReason: "",
      todayTalk: "",
      setupBy: "",
      nextSchedule: "",
      claimRisk: "",
      praised: "",
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const fresh = createEmptyTabData();

        setActiveTab(parsed.activeTab || "AP日報");
        setTemplate(parsed.template || "標準AP日報");
        setTabData({
          ...fresh,
          ...(parsed.tabData || {}),
          AP日報: { ...fresh.AP日報, ...(parsed.tabData?.AP日報 || {}) },
          モーニング: { ...fresh.モーニング, ...(parsed.tabData?.モーニング || {}) },
          ミーティング: { ...fresh.ミーティング, ...(parsed.tabData?.ミーティング || {}) },
          OB: { ...fresh.OB, ...(parsed.tabData?.OB || {}) },
          定着: { ...fresh.定着, ...(parsed.tabData?.定着 || {}) },
        });
      }
    } catch (error) {
      console.error("保存データの読み込みに失敗しました", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeTab,
          template,
          tabData,
        })
      );
    } catch (error) {
      console.error("保存に失敗しました", error);
    }
  }, [activeTab, template, tabData, isLoaded]);

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
        `名前: ${currentData.name}\n` +
        `稼働拠点: ${currentData.base}\n` +
        `稼働時間: ${currentData.hours}\n` +
        `トーク覚えたか: ${currentData.talked}\n` +
        `勤怠ブレあったか: ${currentData.attendance}\n` +
        `生活デッドライン: ${currentData.deadline}\n\n` +
        `【辞める理由があるなら】\n${currentData.quitReason}\n\n` +
        `【今日話した内容】\n${currentData.todayTalk}\n\n` +
        `セットアップ組んだ人: ${currentData.setupBy}\n` +
        `次回予定日: ${currentData.nextSchedule}\n` +
        `クレームリスク: ${currentData.claimRisk}\n` +
        `天才と褒めたか: ${currentData.praised}\n\n` +
        `【1週間後どういう状態にするか】\n${currentData.nextState}`;
    }

    updateField("result", resultText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentData.result || "");
    alert("コピーしました！");
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeTab,
          template,
          tabData,
        })
      );
      alert("保存しました！");
    } catch (error) {
      console.error("保存に失敗しました", error);
      alert("保存に失敗しました");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7" }}>
      <div
        style={{
          background: "#eab308",
          color: "white",
          padding: isMobile ? "16px" : "20px",
          fontSize: isMobile ? "20px" : "26px",
          fontWeight: "bold",
          letterSpacing: "1px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        振り返りシート
      </div>

      <div style={{ padding: isMobile ? "16px" : "24px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
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
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            fontSize: "16px",
            width: isMobile ? "100%" : "260px",
          }}
        >
          {templates[activeTab].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ margin: 0, fontSize: isMobile ? "24px" : "28px" }}>
                {activeTab} 入力
              </h2>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={handleSave} style={subButton}>
                  保存
                </button>
                <button onClick={handleReset} style={subButton}>
                  このタブをリセット
                </button>
              </div>
            </div>

            {activeTab === "AP日報" && (
              <>
                <input
                  placeholder="日付"
                  style={inputStyle}
                  value={currentData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />

                <textarea
                  placeholder="標準AP日報の内容"
                  value={currentData.text}
                  onChange={(e) => updateField("text", e.target.value)}
                  style={{ ...textareaStyle, minHeight: "160px" }}
                />

                <div style={sectionTitleStyle}>～システムの振り返り～</div>

                <textarea
                  placeholder="【良かった点】"
                  value={currentData.goodPoint}
                  onChange={(e) => updateField("goodPoint", e.target.value)}
                  style={textareaStyle}
                />

                <textarea
                  placeholder="【改善点】"
                  value={currentData.improvementPoint}
                  onChange={(e) => updateField("improvementPoint", e.target.value)}
                  style={textareaStyle}
                />

                <textarea
                  placeholder="【AP】"
                  value={currentData.apSystem}
                  onChange={(e) => updateField("apSystem", e.target.value)}
                  style={textareaStyle}
                />
              </>
            )}

            {activeTab === "モーニング" && template === "モーニング振り返り" && (
              <>
                <input
                  placeholder="日付"
                  style={inputStyle}
                  value={currentData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
                <textarea
                  placeholder="【マナー】"
                  style={textareaStyle}
                  value={currentData.manner}
                  onChange={(e) => updateField("manner", e.target.value)}
                />
                <textarea
                  placeholder="【インパクト】"
                  style={textareaStyle}
                  value={currentData.impact}
                  onChange={(e) => updateField("impact", e.target.value)}
                />
                <input
                  placeholder="スピーカー"
                  style={inputStyle}
                  value={currentData.speaker}
                  onChange={(e) => updateField("speaker", e.target.value)}
                />
                <textarea
                  placeholder="【内容】"
                  style={textareaStyle}
                  value={currentData.content}
                  onChange={(e) => updateField("content", e.target.value)}
                />
                <textarea
                  placeholder="【気づき】"
                  style={textareaStyle}
                  value={currentData.insight}
                  onChange={(e) => updateField("insight", e.target.value)}
                />
                <textarea
                  placeholder="【AP】"
                  style={textareaStyle}
                  value={currentData.ap}
                  onChange={(e) => updateField("ap", e.target.value)}
                />
                <textarea
                  placeholder="【ビジョン】"
                  style={textareaStyle}
                  value={currentData.vision}
                  onChange={(e) => updateField("vision", e.target.value)}
                />
              </>
            )}

            {activeTab === "モーニング" && template === "モーニング依頼" && (
              <>
                <input
                  placeholder="ターゲット（年齢）"
                  style={inputStyle}
                  value={currentData.targetAge}
                  onChange={(e) => updateField("targetAge", e.target.value)}
                />
                <input
                  placeholder="入社〇週目"
                  style={inputStyle}
                  value={currentData.joinWeek}
                  onChange={(e) => updateField("joinWeek", e.target.value)}
                />
                <textarea
                  placeholder="【現状】"
                  style={textareaStyle}
                  value={currentData.currentState}
                  onChange={(e) => updateField("currentState", e.target.value)}
                />
                <textarea
                  placeholder="【課題】"
                  style={textareaStyle}
                  value={currentData.issue}
                  onChange={(e) => updateField("issue", e.target.value)}
                />
                <textarea
                  placeholder="【要望】"
                  style={textareaStyle}
                  value={currentData.request}
                  onChange={(e) => updateField("request", e.target.value)}
                />
                <textarea
                  placeholder="【着地】"
                  style={textareaStyle}
                  value={currentData.landing}
                  onChange={(e) => updateField("landing", e.target.value)}
                />
              </>
            )}

            {activeTab === "ミーティング" && (
              <>
                <input
                  placeholder="日付"
                  style={inputStyle}
                  value={currentData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
                <input
                  placeholder={
                    template === "セットアップ" ? "セットアップした方" : "スピーカー"
                  }
                  style={inputStyle}
                  value={currentData.speaker}
                  onChange={(e) => updateField("speaker", e.target.value)}
                />
                <textarea
                  placeholder="【内容】"
                  style={textareaStyle}
                  value={currentData.content}
                  onChange={(e) => updateField("content", e.target.value)}
                />
                <textarea
                  placeholder="【気づき】"
                  style={textareaStyle}
                  value={currentData.insight}
                  onChange={(e) => updateField("insight", e.target.value)}
                />
                <textarea
                  placeholder="【AP】"
                  style={textareaStyle}
                  value={currentData.ap}
                  onChange={(e) => updateField("ap", e.target.value)}
                />
              </>
            )}

            {activeTab === "OB" && (
              <>
                <input
                  placeholder="日付"
                  style={inputStyle}
                  value={currentData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
                <input
                  placeholder="名前"
                  style={inputStyle}
                  value={currentData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
                <input
                  placeholder="年齢"
                  style={inputStyle}
                  value={currentData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                />
                <textarea
                  placeholder="【内容】"
                  style={textareaStyle}
                  value={currentData.content}
                  onChange={(e) => updateField("content", e.target.value)}
                />
                <textarea
                  placeholder="【その人の魅力的な目標】"
                  style={textareaStyle}
                  value={currentData.goal}
                  onChange={(e) => updateField("goal", e.target.value)}
                />
                <textarea
                  placeholder="【その人の危機感】"
                  style={textareaStyle}
                  value={currentData.crisis}
                  onChange={(e) => updateField("crisis", e.target.value)}
                />
                <textarea
                  placeholder="【どう提案したのか？】"
                  style={textareaStyle}
                  value={currentData.proposal}
                  onChange={(e) => updateField("proposal", e.target.value)}
                />
                <textarea
                  placeholder="【よかった点】"
                  style={textareaStyle}
                  value={currentData.good}
                  onChange={(e) => updateField("good", e.target.value)}
                />
                <textarea
                  placeholder="【問題点】"
                  style={textareaStyle}
                  value={currentData.problem}
                  onChange={(e) => updateField("problem", e.target.value)}
                />
                <textarea
                  placeholder="【改善策】"
                  style={textareaStyle}
                  value={currentData.solution}
                  onChange={(e) => updateField("solution", e.target.value)}
                />
              </>
            )}

            {activeTab === "定着" && (
              <>
                <input
                  placeholder="名前"
                  style={inputStyle}
                  value={currentData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
                <input
                  placeholder="稼働拠点"
                  style={inputStyle}
                  value={currentData.base}
                  onChange={(e) => updateField("base", e.target.value)}
                />
                <input
                  placeholder="稼働時間"
                  style={inputStyle}
                  value={currentData.hours}
                  onChange={(e) => updateField("hours", e.target.value)}
                />
                <input
                  placeholder="トーク覚えたか"
                  style={inputStyle}
                  value={currentData.talked}
                  onChange={(e) => updateField("talked", e.target.value)}
                />
                <input
                  placeholder="勤怠ブレあったか"
                  style={inputStyle}
                  value={currentData.attendance}
                  onChange={(e) => updateField("attendance", e.target.value)}
                />
                <input
                  placeholder="生活デッドライン"
                  style={inputStyle}
                  value={currentData.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                />
                <textarea
                  placeholder="【辞める理由があるなら】"
                  style={textareaStyle}
                  value={currentData.quitReason}
                  onChange={(e) => updateField("quitReason", e.target.value)}
                />
                <textarea
                  placeholder="【今日話した内容】"
                  style={textareaStyle}
                  value={currentData.todayTalk}
                  onChange={(e) => updateField("todayTalk", e.target.value)}
                />
                <input
                  placeholder="セットアップ組んだ人"
                  style={inputStyle}
                  value={currentData.setupBy}
                  onChange={(e) => updateField("setupBy", e.target.value)}
                />
                <input
                  placeholder="次回予定日"
                  style={inputStyle}
                  value={currentData.nextSchedule}
                  onChange={(e) => updateField("nextSchedule", e.target.value)}
                />
                <input
                  placeholder="クレームリスク"
                  style={inputStyle}
                  value={currentData.claimRisk}
                  onChange={(e) => updateField("claimRisk", e.target.value)}
                />
                <input
                  placeholder="天才と褒めたか"
                  style={inputStyle}
                  value={currentData.praised}
                  onChange={(e) => updateField("praised", e.target.value)}
                />
                <textarea
                  placeholder="【1週間後どういう状態にするか】"
                  style={textareaStyle}
                  value={currentData.nextState}
                  onChange={(e) => updateField("nextState", e.target.value)}
                />
              </>
            )}

            <button onClick={handleGenerate} style={mainButton}>
              生成
            </button>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ marginBottom: "16px", fontSize: isMobile ? "24px" : "28px" }}>
              生成コメント
            </h2>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={handleSave} style={subButton}>
                保存
              </button>
              <button onClick={handleCopy} style={subButton}>
                コピー
              </button>
            </div>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "14px",
                minHeight: "250px",
                marginTop: "10px",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {currentData.result || "ここに結果が出る"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const textareaStyle = {
  width: "100%",
  minHeight: "100px",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  resize: "vertical",
};

const sectionTitleStyle = {
  fontWeight: "bold",
  fontSize: "18px",
  marginTop: "8px",
  marginBottom: "10px",
  color: "#444",
};

const mainButton = {
  marginTop: "10px",
  background: "#eab308",
  color: "white",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  width: "100%",
  fontWeight: "bold",
  cursor: "pointer",
};

const subButton = {
  background: "#eab308",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};
