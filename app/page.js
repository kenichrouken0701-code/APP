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

export default function Home() {
  const [activeTab, setActiveTab] = useState("AP日報");
  const [template, setTemplate] = useState("標準AP日報");
  const [text, setText] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(text || "");
    alert("コピーしました！");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7" }}>
      
      {/* ===== HEADER ===== */}
      <div style={{
        background: "#eab308",
        color: "white",
        padding: isMobile ? "16px" : "20px",
        fontSize: isMobile ? "20px" : "26px",
        fontWeight: "bold",
        letterSpacing: "1px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        振り返りシート
      </div>

      <div style={{ padding: isMobile ? "16px" : "24px" }}>

        {/* ===== タブ ===== */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap"
        }}>
          {tabs.map(tab => (
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
                transition: "0.2s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===== テンプレ ===== */}
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            fontSize: "16px",
            width: isMobile ? "100%" : "260px"
          }}
        >
          {templates[activeTab].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {/* ===== メイン ===== */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "20px"
        }}>

          {/* ===== 左 ===== */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{ marginBottom: "16px" }}>{activeTab} 入力</h2>

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
                <textarea placeholder="【魅力的な目標】" style={textareaStyle} />
                <textarea placeholder="【危機感】" style={textareaStyle} />
                <textarea placeholder="【提案】" style={textareaStyle} />
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
                <textarea placeholder="【今日話した内容】" style={textareaStyle} />
                <textarea placeholder="【1週間後の状態】" style={textareaStyle} />
              </>
            )}

            {activeTab === "AP日報" && (
              <textarea
                placeholder="標準AP日報の内容"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ ...textareaStyle, minHeight: "160px" }}
              />
            )}

            <button style={mainButton}>
              生成
            </button>
          </div>

          {/* ===== 右 ===== */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{ marginBottom: "16px" }}>生成コメント</h2>

            <button onClick={handleCopy} style={subButton}>
              コピー
            </button>

            <div style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "14px",
              minHeight: "250px",
              marginTop: "10px",
              lineHeight: 1.6
            }}>
              {text || "ここに結果が出る"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ===== スタイル ===== */

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const textareaStyle = {
  width: "100%",
  minHeight: "100px",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
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
};
