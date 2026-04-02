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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { GoogleGenAI } from "@google/genai";

const CATEGORIES = [
  {
    id: "ap_report",
    name: "AP日報",
    templates: [
      {
        id: "ap_standard",
        name: "標準AP日報",
        description: "営業数値を詳細に記録し、プロフェッショナルな報告書を作成します。",
        fields: [
          { id: "name", label: "担当者/AP名", type: "text", placeholder: "" },
          { id: "date", label: "日付", type: "text", placeholder: "2026/03/28" },
          { id: "d_hours", label: "稼働時間", type: "text", placeholder: "h", group: "デイリー" },
          { id: "d_staff", label: "稼働人数", type: "text", placeholder: "人", group: "デイリー" },
          { id: "d_calls", label: "コール数", type: "text", placeholder: "件", group: "デイリー" },
          { id: "d_valid", label: "有効数", type: "text", placeholder: "件", group: "デイリー" },
          { id: "d_toss", label: "トス数", type: "text", placeholder: "件", group: "デイリー" },
          { id: "d_apo", label: "アポ数", type: "text", placeholder: "件", group: "デイリー" },
          { id: "d_hear_name", label: "ヒアリング数(名前)", type: "text", placeholder: "件", group: "デイリー" },
          { id: "d_hear_tel", label: "ヒアリング数(電話番号)", type: "text", placeholder: "件", group: "デイリー" },
          { id: "d_out", label: "アウト", type: "text", placeholder: "件", group: "デイリー" },
          { id: "m_hours", label: "稼働時間", type: "text", placeholder: "h", group: "月間累計" },
          { id: "m_apo", label: "アポ数", type: "text", placeholder: "件", group: "月間累計" },
          { id: "impression", label: "所感", type: "textarea", placeholder: "今日の振り返り", group: "テキスト系" },
          { id: "good_point", label: "良かった点", type: "textarea", placeholder: "具体的な成果や行動", group: "テキスト系" },
          { id: "improvement_point", label: "改善点", type: "textarea", placeholder: "次へのアクション", group: "テキスト系" }
        ],
        promptInstruction:
          "【AP日報】形式で、数値データを整理し、所感や改善点をプロフェッショナルな文章に整形してください。",
      },
    ],
  },
  {
    id: "morning_reflection",
    name: "モーニング振り返り",
    templates: [
      {
        id: "morning_detailed",
        name: "モーニング振り返りテンプレ",
        description: "マナーやインパクト、気づきを深掘りする振り返りです。",
        fields: [
          { id: "date", label: "日付", type: "text", placeholder: "2026/03/28" },
          { id: "speaker", label: "スピーカー", type: "text", placeholder: "登壇者名" },
          { id: "manner", label: "マナー", type: "textarea", placeholder: "立ち振る舞い", group: "行動・姿勢" },
          { id: "impact", label: "インパクト", type: "textarea", placeholder: "周囲への影響", group: "行動・姿勢" },
          { id: "content", label: "内容", type: "textarea", placeholder: "話の要点", group: "内容・気づき" },
          { id: "insight", label: "気づき", type: "textarea", placeholder: "学びや発見", group: "内容・気づき" },
          { id: "ap", label: "AP", type: "textarea", placeholder: "具体的な次の一手", group: "未来・展望" }
        ],
        promptInstruction:
          "モーニング振り返りとして、入力内容を整理し、自己成長につながる前向きな文章に整形してください。",
      },
    ],
  },
  {
    id: "meeting",
    name: "ミーティング",
    templates: [
      {
        id: "meeting_reflection",
        name: "ミーティング振り返り",
        description: "会議の内容と成果を振り返ります。",
        fields: [
          { id: "speaker", label: "スピーカー", type: "text", placeholder: "登壇者名" },
          { id: "content", label: "内容", type: "textarea", placeholder: "要点" },
          { id: "insight", label: "気づき", type: "textarea", placeholder: "学び" },
          { id: "ap", label: "AP", type: "textarea", placeholder: "アクションプラン" }
        ],
        promptInstruction:
          "ミーティングの要点を整理し、具体的なアクションプランを明確にした文章を作成してください。",
      },
    ],
  },
  {
    id: "ob",
    name: "OB",
    templates: [
      {
        id: "ob_reflection",
        name: "OB振り返り",
        description: "オブザーバーとしてのフィードバックを整理します。",
        fields: [
          { id: "name", label: "名前", type: "text", placeholder: "氏名" },
          { id: "age", label: "年齢", type: "text", placeholder: "年齢" },
          { id: "goal", label: "魅力的な目標", type: "textarea", placeholder: "目標" },
          { id: "crisis", label: "危機感", type: "textarea", placeholder: "危機感" },
          { id: "proposal", label: "どう提案したか", type: "textarea", placeholder: "提案内容" },
          { id: "good", label: "よかった点", type: "textarea", placeholder: "良かった点" },
          { id: "problem", label: "問題点", type: "textarea", placeholder: "問題点" },
          { id: "solution", label: "改善策", type: "textarea", placeholder: "改善策" }
        ],
        promptInstruction:
          "オブザーバーFBとして、営業スキルの向上に繋がる論理的で具体的なフィードバック文章を作成してください。",
      },
    ],
  },
  {
    id: "retention",
    name: "定着",
    templates: [
      {
        id: "retention_reflection",
        name: "定着振り返り",
        description: "定着に向けた振り返りを行い、継続的な成長をサポートします。",
        fields: [
          { id: "name", label: "名前", type: "text", group: "基本情報", placeholder: "氏名" },
          { id: "base", label: "稼働拠点", type: "text", group: "基本情報", placeholder: "拠点名" },
          { id: "hours", label: "稼働時間", type: "text", group: "基本情報", placeholder: "時間" },
          { id: "talk_learned", label: "トーク覚えたか", type: "text", group: "基本情報", placeholder: "はい / いいえ" },
          { id: "attendance_gap", label: "勤怠ブレ", type: "text", group: "基本情報", placeholder: "有 / 無" },
          { id: "deadline", label: "生活デッドライン", type: "text", group: "基本情報", placeholder: "内容" },
          { id: "content", label: "今日話した内容", type: "textarea", group: "面談内容", placeholder: "話したこと" },
          { id: "setup_by", label: "セットアップ組んだ人", type: "text", group: "フォロー状況", placeholder: "名前" },
          { id: "next_schedule", label: "次回予定", type: "text", group: "フォロー状況", placeholder: "日付や時間" },
          { id: "claim_risk", label: "クレームリスク", type: "text", group: "フォロー状況", placeholder: "有 / 無" },
          { id: "praised", label: "天才と褒めたか", type: "text", group: "フォロー状況", placeholder: "はい / いいえ" },
          { id: "one_week_goal", label: "1週間後の目標状態", type: "textarea", group: "目標", placeholder: "1週間後どういう状態にしたいか" }
        ],
        promptInstruction:
          "定着振り返りとして、マネジメント視点で事実を整理し、リスクや今後の期待を込めた文章を作成してください。",
      },
    ],
  },
];

const ai =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY })
    : null;

async function generateReport(template, formData) {
  if (!ai) throw new Error("APIキーが設定されていません。");

  const inputContext = Object.entries(formData)
    .map(([k, v]) => {
      const field = template.fields.find((f) => f.id === k);
      return `${field?.label || k}: ${v}`;
    })
    .join("\n");

  const prompt = `
以下の入力内容をもとに、高品質な日報・振り返り文章を生成してください。

【テンプレート】
${template.name}

【生成指示】
${template.promptInstruction}

【入力内容】
${inputContext}

要件:
- 自然で読みやすい日本語
- 実務でそのまま使える文面
- Markdown形式で整理して出力
- 未入力項目は無理に膨らませない
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "生成に失敗しました。";
}

export default function SmartReportApp() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(CATEGORIES[0].templates[0]);
  const [formData, setFormData] = useState({});
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullCopied, setIsFullCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedTemplate(selectedCategory.templates[0]);
  }, [selectedCategory]);

  useEffect(() => {
    const initialData = {};
    selectedTemplate.fields.forEach((field) => {
      initialData[field.id] = "";
    });
    setFormData(initialData);
    setGeneratedText("");
    setError(null);
  }, [selectedTemplate]);

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateReport(selectedTemplate, formData);
      setGeneratedText(result);
    } catch {
      setError("AI生成中にエラーが発生しました。APIキーの設定を確認してください。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setError("コピーに失敗しました。");
    }
  };

  const handleFullCopy = async () => {
    try {
      let text = `【${selectedCategory.name} - ${selectedTemplate.name}】\n\n`;
      selectedTemplate.fields.forEach((field) => {
        const value = formData[field.id] || "";
        if (value) text += `${field.label}: ${value}\n`;
      });
      if (generatedText) text += `\n--- 生成結果 ---\n\n${generatedText}`;
      await navigator.clipboard.writeText(text);
      setIsFullCopied(true);
      setTimeout(() => setIsFullCopied(false), 2000);
    } catch {
      setError("コピーに失敗しました。");
    }
  };

  const handleReset = () => {
    if (window.confirm("入力内容をリセットしますか？")) {
      const initialData = {};
      selectedTemplate.fields.forEach((field) => {
        initialData[field.id] = "";
      });
      setFormData(initialData);
      setGeneratedText("");
      setError(null);
    }
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case "ap_report":
        return <FileText className="h-4 w-4" />;
      case "morning_reflection":
        return <Sparkles className="h-4 w-4" />;
      case "meeting":
        return <Layout className="h-4 w-4" />;
      case "ob":
        return <Send className="h-4 w-4" />;
      case "retention":
        return <Target className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const groupedFields = Array.from(
    new Set(selectedTemplate.fields.map((f) => f.group || "基本情報"))
  );

  return (
    <div className="min-h-screen bg-[#e9edf5] text-[#2f3a4b]">
      <header className="bg-[#2f58d8] text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4cb43] shadow">
              <FileText className="h-7 w-7 text-[#2f58d8]" />
            </div>
            <div>
              <h1 className="text-[28px] font-black leading-none sm:text-[40px]">
                営業コメント作成ツール〜エイコメン〜
              </h1>
              <p className="mt-1 text-base font-semibold text-white/90">
                Version: v2.14
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-6 sm:flex">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-lg font-bold text-white/95 transition hover:text-white"
            >
              <RotateCcw className="h-5 w-5" />
              リセット
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
              ?
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-7">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[30px] border border-[#d8dde8] bg-[#f5f6fa] p-6 shadow-[0_12px_30px_rgba(31,41,55,0.08)]">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full max-w-[420px]">
                <label className="mb-2 block text-[15px] font-bold text-[#374151]">
                  担当者/AP名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-[54px] w-full rounded-2xl border border-[#cfd5e1] bg-white px-4 text-base outline-none transition focus:border-[#2f58d8] focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="flex h-[54px] items-center gap-3 rounded-2xl border border-[#d6dbe7] bg-white px-5">
                <div className="h-5 w-5 rounded-md border border-[#bcc4d3] bg-white" />
                <span className="text-lg font-bold text-[#374151]">サカイ販路</span>
              </div>
            </div>

            <div className="mb-6 overflow-x-auto">
              <div className="flex min-w-max gap-5 border-b border-[#d7dde8] pb-1">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex min-w-[90px] flex-col items-center justify-center rounded-t-[22px] px-3 py-4 text-sm font-black transition ${
                      selectedCategory.id === category.id
                        ? "bg-[#e8eefb] text-[#2f58d8] border border-b-0 border-[#cad7ff]"
                        : "text-[#667085] hover:text-[#2f58d8]"
                    }`}
                  >
                    <div className="mb-2">{getCategoryIcon(category.id)}</div>
                    <span className="text-center leading-tight">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-3 text-[17px] font-black text-[#1f2937]">
                {selectedCategory.name}
              </div>

              <div className="relative mb-4 max-w-[420px]">
                <select
                  value={selectedTemplate.id}
                  onChange={(e) =>
                    setSelectedTemplate(
                      selectedCategory.templates.find((t) => t.id === e.target.value)
                    )
                  }
                  className="h-[54px] w-full appearance-none rounded-2xl border border-[#cfd5e1] bg-white px-4 pr-10 text-base outline-none transition focus:border-[#2f58d8] focus:ring-4 focus:ring-blue-100"
                >
                  {selectedCategory.templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-slate-400" />
              </div>

              <div className="rounded-xl border border-dashed border-[#b9f0c3] bg-[#f8fff9] px-4 py-3 text-sm font-medium text-slate-500">
                {selectedTemplate.description}
              </div>
            </div>

            <div className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTemplate.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-8"
                >
                  {groupedFields.map((groupName) => (
                    <div key={groupName}>
                      <div className="mb-4 border-b border-[#d9dee8] pb-3">
                        <h3 className="text-[18px] font-black text-[#1f2937]">
                          {groupName}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {selectedTemplate.fields
                          .filter((f) => (f.group || "基本情報") === groupName)
                          .map((field) => (
                            <div
                              key={field.id}
                              className={field.type === "textarea" ? "md:col-span-2" : ""}
                            >
                              <label className="mb-2 block text-[15px] font-bold text-[#374151]">
                                {field.label}
                              </label>

                              {field.type === "textarea" ? (
                                <textarea
                                  rows={4}
                                  value={formData[field.id] || ""}
                                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  placeholder={field.placeholder || ""}
                                  className="w-full rounded-2xl border border-[#cfd5e1] bg-white px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-[#2f58d8] focus:ring-4 focus:ring-blue-100 resize-none"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={formData[field.id] || ""}
                                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  placeholder={field.placeholder || ""}
                                  className="h-[54px] w-full rounded-2xl border border-[#cfd5e1] bg-white px-4 text-base outline-none transition placeholder:text-slate-400 focus:border-[#2f58d8] focus:ring-4 focus:ring-blue-100"
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={handleFullCopy}
                  className={`flex h-[52px] items-center justify-center gap-2 rounded-2xl border text-base font-black transition ${
                    isFullCopied
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-[#d0d7e4] bg-white text-[#2f58d8] hover:bg-[#eef3ff]"
                  }`}
                >
                  {isFullCopied ? <Check className="h-5 w-5" /> : <Clipboard className="h-5 w-5" />}
                  {isFullCopied ? "コピー完了" : "コピー"}
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`flex h-[52px] items-center justify-center gap-2 rounded-2xl text-base font-black transition ${
                    isGenerating
                      ? "bg-[#dbe3f4] text-slate-400"
                      : "bg-[#2f58d8] text-white hover:bg-[#2348bc]"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      生成する
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-[#d8dde8] bg-[#f5f6fa] p-6 shadow-[0_12px_30px_rgba(31,41,55,0.08)]">
            <div className="rounded-[24px] border border-[#dfe4ee] bg-white overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#d5dbe7] px-6 py-5">
                <h2 className="flex items-center gap-3 text-[20px] font-black text-[#334155]">
                  <div className="text-[#2f58d8]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  生成コメント
                </h2>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="flex h-[50px] items-center gap-2 rounded-2xl border border-[#d7dde9] bg-white px-4 text-base font-black text-slate-600 transition hover:bg-slate-50"
                  >
                    <RotateCcw className="h-5 w-5" />
                    リセット(終話)
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!generatedText}
                    className={`flex h-[50px] items-center gap-2 rounded-2xl px-4 text-base font-black transition ${
                      !generatedText
                        ? "cursor-not-allowed bg-[#dbe3f4] text-white/70"
                        : isCopied
                        ? "bg-green-500 text-white"
                        : "bg-[#2f58d8] text-white hover:bg-[#2348bc]"
                    }`}
                  >
                    {isCopied ? <Check className="h-5 w-5" /> : <Clipboard className="h-5 w-5" />}
                    {isCopied ? "コピー済" : "コピー"}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {!generatedText && !isGenerating && (
                  <div className="min-h-[620px] rounded-[22px] border border-[#d9dee8] bg-[#fbfcfe] p-5">
                    <p className="text-[20px] font-medium text-[#374151]">
                      該当するテンプレートがありません。
                    </p>
                  </div>
                )}

                {isGenerating && (
                  <div className="min-h-[620px] rounded-[22px] border border-[#d9dee8] bg-[#fbfcfe] p-5">
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                      <div className="h-4 w-full rounded bg-slate-200"></div>
                      <div className="h-4 w-5/6 rounded bg-slate-200"></div>
                      <div className="h-4 w-2/3 rounded bg-slate-200"></div>
                    </div>
                  </div>
                )}

                {generatedText && (
                  <div className="min-h-[620px] rounded-[22px] border border-[#d9dee8] bg-[#fbfcfe] p-5">
                    <div className="prose prose-sm max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-[#2f58d8]">
                      <ReactMarkdown>{generatedText}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
