"use client";

import { useEffect, useState } from "react";

const tabs = ["AP日報", "モーニング", "ミーティング", "OB", "定着"];

const templates = {
  AP日報: ["標準AP日報"],
  モーニング: ["モーニング振り返り"],
  ミーティング: ["ミーティング振り返り"],
  OB: ["OB振り返り"],
  定着: ["定着振り返り"],
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  border: "1px solid #bfbfbf",
  borderRadius: "6px",
  boxSizing: "border-box",
  fontSize: "16px",
};

const textareaStyle = {
  width: "100%",
  minHeight: "110px",
  padding: "12px",
  marginBottom: "10px",
  border: "1px solid #bfbfbf",
  borderRadius: "6px",
  boxSizing: "border-box",
  fontSize: "16px",
  resize: "vertical",
};

const cardStyle = {
  background: "white",
  padding: "24px",
  borderRadius: "16px",
  boxSizing: "border-box",
};

const buttonStyle = {
  marginTop: "10px",
  background: "#eab308",
  color: "white",
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("AP日報");
  const [template, setTemplate] = useState("標準AP日報");
  const [text, setText] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(text || "");
    alert("コピーしました！");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7" }}>
      <div
        style={{
          background: "#eab308",
          color: "white",
          padding: isMobile ? "18px 16px" : "24px 20px",
          fontSize: isMobile ? "20px" : "24px",
          fontWeight: "bold",
        }}
      >
        振り返りシート
      </div>

      <div style={{ padding: isMobile ? "16px" : "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
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
                padding: isMobile ? "10px 14px" : "10px 15px",
                borderRadius: "12px",
                border: "none",
                background: activeTab === tab ? "#eab308" : "#ddd",
                color: activeTab === tab ? "white" : "black",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: isMobile ? "15px" : "16px",
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
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
            width: isMobile ? "100%" : "auto",
            maxWidth: "100%",
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
          <div style={cardStyle}>
            <h2 style={{ fontSize: isMobile ? "24px" : "28px", marginBottom: "20px" }}>
              {activeTab} 入力
            </h2>

            <input placeholder="担当者/AP名" style={inputStyle} />

            {activeTab === "モーニング" && (
              <>
                <input placeholder="日付" style={inputStyle} />
                <textarea placeholder="【マナー】" style={textareaStyle} />
                <textarea placeholder="【インパクト】" style={textareaStyle} />
                <input placeholder="スピーカー" style={inputStyle} />
                <textarea placeholder="【内容】" style={textareaStyle} />
                <textarea placeholder="【気づき】" style={textareaStyle} />
                <textarea placeholder="【AP】" style={textareaStyle} />
                <textarea placeholder="【ビジョン】" style={textareaStyle} />
              </>
            )}

            {activeTab === "ミーティング" && (
              <>
                <input placeholder="スピーカー" style={inputStyle} />
                <textarea placeholder="【内容】" style={textareaStyle} />
                <textarea placeholder="【気づき】" style={textareaStyle} />
                <textarea placeholder="【AP】" style={textareaStyle} />
              </>
            )}

            {activeTab === "OB" && (
              <>
                <input placeholder="日付" style={inputStyle} />
                <input placeholder="名前" style={inputStyle} />
                <input placeholder="年齢" style={inputStyle} />
                <textarea placeholder="【内容】" style={textareaStyle} />
                <textarea placeholder="【その人の魅力的な目標】" style={textareaStyle} />
                <textarea placeholder="【その人の危機感】" style={textareaStyle} />
                <textarea placeholder="【どう提案したのか？】" style={textareaStyle} />
                <textarea placeholder="【よかった点】" style={textareaStyle} />
                <textarea placeholder="【問題点】" style={textareaStyle} />
                <textarea placeholder="【改善策】" style={textareaStyle} />
              </>
            )}

            {activeTab === "定着" && (
              <>
                <input placeholder="名前" style={inputStyle} />
                <input placeholder="稼働拠点" style={inputStyle} />
                <input placeholder="稼働時間" style={inputStyle} />
                <input placeholder="トーク覚えたか" style={inputStyle} />
                <input placeholder="勤怠ブレあったか" style={inputStyle} />
                <input placeholder="生活デッドライン" style={inputStyle} />
                <textarea placeholder="【今日話した内容】" style={textareaStyle} />
                <input placeholder="セットアップ組んだ人" style={inputStyle} />
                <input placeholder="次回予定日" style={inputStyle} />
                <input placeholder="クレームリスク" style={inputStyle} />
                <input placeholder="天才と褒めたか" style={inputStyle} />
                <textarea
                  placeholder="【1週間後どういう状態にするか】"
                  style={textareaStyle}
                />
              </>
            )}

            {activeTab === "AP日報" && (
              <textarea
                placeholder="標準AP日報の内容"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                  ...textareaStyle,
                  minHeight: "150px",
                }}
              />
            )}

            <button style={buttonStyle}>生成</button>
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: isMobile ? "24px" : "28px", marginBottom: "20px" }}>
              生成コメント
            </h2>

            <button
              onClick={handleCopy}
              style={{
                marginBottom: "10px",
                background: "#eab308",
                color: "white",
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              コピー
            </button>

            <div
              style={{
                border: "1px solid #ccc",
                minHeight: isMobile ? "220px" : "280px",
                padding: "14px",
                borderRadius: "6px",
                background: "white",
                boxSizing: "border-box",
                fontSize: "16px",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {text || "ここに結果が出る"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
