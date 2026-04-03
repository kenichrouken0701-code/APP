"use client";

import React, { useState, useEffect } from "react";
import {
  Clipboard,
  RotateCcw,
  FileText,
  Check,
  Loader2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// --- データ ---
const CATEGORIES = [
  {
    id: "ap",
    name: "AP日報",
    templates: [
      {
        id: "ap1",
        name: "標準AP日報",
        description: "営業数値を記録します",
        fields: [
          { id: "name", label: "担当者/AP名", type: "text" },
          { id: "date", label: "日付", type: "text" },
          { id: "call", label: "コール数", type: "text" },
          { id: "apo", label: "アポ数", type: "text" },
          { id: "good", label: "良かった点", type: "textarea" },
          { id: "bad", label: "改善点", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "morning",
    name: "モーニング振り返り",
    templates: [
      {
        id: "morning1",
        name: "基本振り返り",
        description: "朝の振り返り",
        fields: [
          { id: "date", label: "日付", type: "text" },
          { id: "speaker", label: "スピーカー", type: "text" },
          { id: "content", label: "内容", type: "textarea" },
          { id: "insight", label: "気づき", type: "textarea" },
          { id: "ap", label: "AP", type: "textarea" },
        ],
      },
    ],
  },
];

// --- メイン ---
export default function App() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [template, setTemplate] = useState(CATEGORIES[0].templates[0]);
  const [form, setForm] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTemplate(category.templates[0]);
  }, [category]);

  useEffect(() => {
    const obj = {};
    template.fields.forEach((f) => (obj[f.id] = ""));
    setForm(obj);
    setResult("");
  }, [template]);

  const handleChange = (id, val) => {
    setForm({ ...form, [id]: val });
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      let text = "【生成結果】\n\n";
      template.fields.forEach((f) => {
        text += `${f.label}: ${form[f.id]}\n`;
      });
      setResult(text);
      setLoading(false);
    }, 500);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const obj = {};
    template.fields.forEach((f) => (obj[f.id] = ""));
    setForm(obj);
    setResult("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* header */}
      <div className="bg-blue-700 text-white p-6 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">振り返りシート</h1>
          <p>Version: v2.14</p>
        </div>
        <button onClick={handleReset}>リセット</button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左 */}
        <div className="bg-white p-6 rounded-xl">
          <input
            className="border p-2 w-full mb-4"
            placeholder="担当者/AP名"
            value={form.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          {/* タブ */}
          <div className="flex gap-2 mb-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded ${
                  category.id === c.id ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* テンプレ */}
          <select
            className="border p-2 w-full mb-4"
            value={template.id}
            onChange={(e) =>
              setTemplate(
                category.templates.find((t) => t.id === e.target.value)
              )
            }
          >
            {category.templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* フォーム */}
          {template.fields.map((f) => (
            <div key={f.id} className="mb-3">
              <label>{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  className="border p-2 w-full"
                  value={form[f.id]}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                />
              ) : (
                <input
                  className="border p-2 w-full"
                  value={form[f.id]}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                />
              )}
            </div>
          ))}

          {/* ボタン */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCopy}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              {copied ? "コピー済" : "コピー"}
            </button>

            <button
              onClick={handleGenerate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "生成中..." : "生成"}
            </button>
          </div>
        </div>

        {/* 右 */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-xl mb-4">生成コメント</h2>

          <div className="border p-4 min-h-[300px] whitespace-pre-wrap">
            {result || "まだ生成されていません"}
          </div>
        </div>
      </div>
    </div>
  );
}
