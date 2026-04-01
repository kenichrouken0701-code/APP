"use client";

import React, { useState, useEffect } from "react";
import {
  Clipboard,
  RotateCcw,
  Send,
  Layout,
  FileText,
  Check,
  Loader2,
  Sparkles,
  ChevronDown,
  Target,
  Trash2,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { GoogleGenAI } from "@google/genai";

const ai =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      })
    : null;

const CATEGORIES = [
  { id: "ap_report", name: "AP日報" },
  { id: "morning_reflection", name: "モーニング振り返り" },
  { id: "meeting", name: "ミーティング" },
  { id: "ob", name: "OB" },
  { id: "retention", name: "定着" },
];

export default function SmartReportApp() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [input, setInput] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!ai) return alert("APIキー設定して");

    setIsGenerating(true);

    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: input,
      });

      setGeneratedText(res.text || "");
    } catch (e) {
      alert("AIエラー");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b p-4 font-bold">
        SmartReport AI
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-xl text-sm ${
              selectedCategory.id === c.id
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="grid md:grid-cols-2 gap-6 p-4">
        {/* Input */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <textarea
            className="w-full border p-3 rounded-xl"
            rows={10}
            placeholder="入力してください"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !input}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {isGenerating ? "生成中..." : "AI生成"}
          </button>
        </div>

        {/* Output */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          {generatedText ? (
            <>
              <button
                onClick={handleCopy}
                className="mb-2 text-sm"
              >
                {copied ? "コピー済" : "コピー"}
              </button>

              <div className="prose">
                <ReactMarkdown>{generatedText}</ReactMarkdown>
              </div>
            </>
          ) : (
            <p className="text-gray-400">
              ここに結果が表示されます
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
