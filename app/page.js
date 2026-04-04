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

export default function Home() {
  const [activeTab, setActiveTab] = useState("AP日報");
  const [template, setTemplate] = useState("標準AP日報");
  const [text, setText] = useState("");

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

        {/* ▼ テンプレ選択 */}
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

            <input
              placeholder="担当者/AP名"
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <textarea
              placeholder={`${template} の内容`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ width: "100%", height: "150px", padding: "10px" }}
            />

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
