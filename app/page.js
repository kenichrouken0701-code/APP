"use client";

import { useState } from "react";

const tabs = ["AP日報", "モーニング", "ミーティング", "OB", "定着"];

const templates = {
  "AP日報": ["標準AP日報"],
  "モーニング": ["モーニング振り返り"],
  "ミーティング": ["ミーティング振り返り"],
  "OB": ["OB振り返り"],
  "定着": ["定着振り返り"],
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px"
};

const textareaStyle = {
  width: "100%",
  height: "100px",
  padding: "10px",
  marginBottom: "10px"
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("AP日報");
  const [template, setTemplate] = useState("標準AP日報");
  const [text, setText] = useState("");

  // 🔥コピー機能
  const handleCopy = () => {
    navigator.clipboard.writeText(text || "");
    alert("コピーしました！");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7" }}>
      
      {/* header */}
      <div style={{
        background: "#eab308",
        color: "white",
        padding: "20px",
        fontSize: "24px",
        fontWeight: "bold"
      }}>
        振り返りシート
      </div>

      <div style={{ padding: "20px" }}>
        
        {/* タブ */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setTemplate(templates[tab][0]);
              }}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === tab ? "#eab308" : "#ddd",
                color: activeTab === tab ? "white" : "black",
                fontWeight: "bold"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* テンプレ選択 */}
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        >
          {templates[activeTab].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px"
        }}>
          
          {/* 左 */}
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px"
          }}>
            <h2>{activeTab} 入力</h2>

            <input placeholder="担当者/AP名" style={inputStyle} />

            {/* モーニング */}
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

            {/* ミーティング */}
            {activeTab === "ミーティング" && (
              <>
                <input placeholder="スピーカー" style={inputStyle} />
                <textarea placeholder="【内容】" style={textareaStyle} />
                <textarea placeholder="【気づき】" style={textareaStyle} />
                <textarea placeholder="【AP】" style={textareaStyle} />
              </>
            )}

            {/* OB */}
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

            {/* 定着 */}
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
                <textarea placeholder="【1週間後どういう状態にするか】" style={textareaStyle} />
              </>
            )}

            {/* AP日報 */}
            {activeTab === "AP日報" && (
              <textarea
                placeholder="標準AP日報の内容"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={textareaStyle}
              />
            )}

            <button style={{
              marginTop: "10px",
              background: "#eab308",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px"
            }}>
              生成
            </button>
          </div>

          {/* 右 */}
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px"
          }}>
            <h2>生成コメント</h2>

            {/* 🔥コピー */}
            <button
              onClick={handleCopy}
              style={{
                marginBottom: "10px",
                background: "#eab308",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              コピー
            </button>

            <div style={{
              border: "1px solid #ccc",
              minHeight: "200px",
              padding: "10px"
            }}>
              {text || "ここに結果が出る"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
