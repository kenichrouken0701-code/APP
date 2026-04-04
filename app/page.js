"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7" }}>
      {/* header */}
      <div style={{
        background: "#2f5be7",
        color: "white",
        padding: "20px",
        fontSize: "24px",
        fontWeight: "bold"
      }}>
        振り返りシート
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        padding: "20px"
      }}>
        
        {/* 左 */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <h2>入力</h2>

          <input
            placeholder="担当者/AP名"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <textarea
            placeholder="内容"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: "100%", height: "150px", padding: "10px" }}
          />

          <button style={{
            marginTop: "10px",
            background: "#facc15",
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
  );
}
