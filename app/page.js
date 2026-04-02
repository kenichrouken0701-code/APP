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

// --- Constants & Data ---
const CATEGORIES = [
  {
    id: "ap_report",
    name: "AP日報",
    templates: [
      {
        id: "ap_standard",
        name: "標準AP日報",
        description:
          "営業数値を詳細に記録し、プロフェッショナルな報告書を作成します。",
        fields: [
          { id: "name", label: "名前", type: "text", placeholder: "氏名を入力" },
          { id: "date", label: "日付", type: "text", placeholder: "2026/03/28" },
          {
            id: "d_hours",
            label: "稼働時間",
            type: "text",
            placeholder: "h",
            group: "デイリー",
          },
          {
            id: "d_staff",
            label: "稼働人数",
            type: "text",
            placeholder: "人",
            group: "デイリー",
          },
          {
            id: "d_calls",
            label: "コール数",
            type: "text",
            placeholder: "件",
            group: "デイリー",
          },
          {
            id: "d_valid",
            label: "有効数",
            type: "text",
            placeholder: "件",
            group: "デイリー",
          },
          {
            id: "d_toss",
            label: "トス数",
            type: "text",
            placeholder: "件",
            group: "デイリー",
          },
          {
            id: "d_apo",
            label: "アポ数",
            type: "text",
            placeholder: "件",
            group: "デイリー",
          },
          {
            id: "d_hear_name",
            label: "ヒアリング数(名前)",
            type: "text",
            placeholder: "件",
            group: "デイリー",
          },
          {
            id: "d_hear_tel",
            label: "ヒアリング数(電話番号)",
            type: "text",
            placeholder: "件",
            group: "デイリー",
          },
          {
            id: "d_out",
            label: "アウト",
            type: "text",
            placeholder: "件",
            group: "デイリー",
          },
          {
            id: "m_hours",
            label: "稼働時間",
            type: "text",
            placeholder: "h",
            group: "月間累計",
          },
          {
            id: "m_apo",
            label: "アポ数",
            type: "text",
            placeholder: "件",
            group: "月間累計",
          },
          {
            id: "impression",
            label: "所感",
            type: "textarea",
            placeholder: "今日の振り返り",
            group: "テキスト系",
          },
          {
            id: "good_point",
            label: "良かった点",
            type: "textarea",
            placeholder: "具体的な成果や行動",
            group: "テキスト系",
          },
          {
            id: "improvement_point",
            label: "改善点",
            type: "textarea",
            placeholder: "次へのアクション",
            group: "テキスト系",
          },
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
        description:
          "マナーやインパクト、気づきを深掘りする振り返りです。",
        fields: [
          { id: "date", label: "日付", type: "text", placeholder: "2026/03/28" },
          { id: "speaker", label: "スピーカー", type: "text", placeholder: "登壇者名" },
          {
            id: "manner",
            label: "マナー",
            type: "textarea",
            placeholder: "立ち振る舞い",
            group: "行動・姿勢",
          },
          {
            id: "impact",
            label: "インパクト",
            type: "textarea",
            placeholder: "周囲への影響",
            group: "行動・姿勢",
          },
          {
            id: "content",
            label: "内容",
            type: "textarea",
            placeholder: "話の要点",
            group: "内容・気づき",
          },
          {
            id: "insight",
            label: "気づき",
            type: "textarea",
            placeholder: "学びや発見",
            group: "内容・気づき",
          },
          {
            id: "ap",
            label: "AP",
            type: "textarea",
            placeholder: "具体的な次の一手",
            group: "未来・展望",
          },
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
          {
            id: "content",
            label: "内容",
            type: "textarea",
            placeholder: "要点",
          },
          {
            id: "insight",
            label: "気づき",
            type: "textarea",
            placeholder: "学び",
          },
          {
            id: "ap",
            label: "AP",
            type: "textarea",
            placeholder: "アクションプラン",
          },
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
          {
            id: "goal",
            label: "魅力的な目標",
            type: "textarea",
            placeholder: "目標",
          },
          {
            id: "crisis",
            label: "危機感",
            type: "textarea",
            placeholder: "危機感",
          },
          {
            id: "proposal",
            label: "どう提案したか",
            type: "textarea",
            placeholder: "提案内容",
          },
          {
            id: "good",
            label: "よかった点",
            type: "textarea",
            placeholder: "良かった点",
          },
          {
            id: "problem",
            label: "問題点",
            type: "textarea",
            placeholder: "問題点",
          },
          {
            id: "solution",
            label: "改善策",
            type: "textarea",
            placeholder: "改善策",
          },
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
        description:
          "定着に向けた振り返りを行い、継続的な成長をサポートします。",
        fields: [
          { id: "name", label: "名前", type: "text", group: "基本情報", placeholder: "氏名" },
          { id: "base", label: "稼働拠点", type: "text", group: "基本情報", placeholder: "拠点名" },
          { id: "hours", label: "稼働時間", type: "text", group: "基本情報", placeholder: "時間" },
          {
            id: "talk_learned",
            label: "トーク覚えたか",
            type: "text",
            group: "基本情報",
            placeholder: "はい / いいえ",
          },
          {
            id: "attendance_gap",
            label: "勤怠ブレ",
            type: "text",
            group: "基本情報",
            placeholder: "有 / 無",
          },
          {
            id: "deadline",
            label: "生活デッドライン",
            type: "text",
            group: "基本情報",
            placeholder: "内容",
          },
          {
            id: "content",
            label: "今日話した内容",
            type: "textarea",
            group: "面談内容",
            placeholder: "話したこと",
          },
          {
            id: "setup_by",
            label: "セットアップ組んだ人",
            type: "text",
            group: "フォロー状況",
            placeholder: "名前",
          },
          {
            id: "next_schedule",
            label: "次回予定",
            type: "text",
            group: "フォロー状況",
            placeholder: "日付や時間",
          },
          {
            id: "claim_risk",
            label: "クレームリスク",
            type: "text",
            group: "フォロー状況",
            placeholder: "有 / 無",
          },
          {
            id: "praised",
            label: "天才と褒めたか",
            type: "text",
            group: "フォロー状況",
            placeholder: "はい / いいえ",
          },
          {
            id: "one_week_goal",
            label: "1週間後の目標状態",
            type: "textarea",
            group: "目標",
            placeholder: "1週間後どういう状態にしたいか",
          },
        ],
        promptInstruction:
          "定着振り返りとして、マネジメント視点で事実を整理し、リスクや今後の期待を込めた文章を作成してください。",
      },
    ],
  },
];

// --- AI Logic ---
const ai =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY })
    : null;

async function generateReport(template, formData) {
  if (!ai) {
    throw new Error("APIキーが設定されていません。");
  }

  const model = "gemini-2.5-flash";
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
    model,
    contents: prompt,
  });

  return response.text || "生成に失敗しました。";
}

// --- Main Component ---
export default function SmartReportApp() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(
    CATEGORIES[0].templates[0]
  );
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
    } catch (err) {
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

      if (generatedText) {
        text += `\n--- 生成結果 ---\n\n${generatedText}`;
      }

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

  const isFormEmpty = Object.values(formData).every(
    (val) => !String(val).trim()
  );

  const getCategoryIcon = (id) => {
    switch (id) {
      case "ap_report":
        return <FileText className="w-4 h-4" />;
      case "morning_reflection":
        return <Sparkles className="w-4 h-4" />;
      case "meeting":
        return <Layout className="w-4 h-4" />;
      case "ob":
        return <Send className="w-4 h-4" />;
      case "retention":
        return <Target className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const groupedFields = Array.from(
    new Set(selectedTemplate.fields.map((f) => f.group || "基本情報"))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                SmartReport <span className="text-blue-600">AI</span>
              </h1>
              <p className="text-[11px] text-slate-400">日報作成を、もっとスマートに。</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-6 sm:py-8">
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex min-w-max gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  selectedCategory.id === category.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category.id)}
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Layout className="h-4 w-4 text-blue-600" />
              テンプレート
            </div>

            <div className="relative w-full max-w-xs">
              <select
                value={selectedTemplate.id}
                onChange={(e) =>
                  setSelectedTemplate(
                    selectedCategory.templates.find((t) => t.id === e.target.value)
                  )
                }
                className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                {selectedCategory.templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
            </div>

            <p className="text-xs text-slate-500">{selectedTemplate.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
                <Send className="h-4 w-4 text-blue-600" />
                入力フォーム
              </h2>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-red-500"
              >
                <RotateCcw className="h-3 w-3" />
                リセット
              </button>
            </div>

            <div className="space-y-6 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTemplate.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="space-y-6"
                >
                  {groupedFields.map((groupName) => (
                    <div key={groupName} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                          {groupName}
                        </h3>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {selectedTemplate.fields
                          .filter((f) => (f.group || "基本情報") === groupName)
                          .map((field) => (
                            <div key={field.id} className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">
                                {field.label}
                              </label>

                              {field.type === "textarea" ? (
                                <textarea
                                  rows={4}
                                  value={formData[field.id] || ""}
                                  onChange={(e) =>
                                    handleInputChange(field.id, e.target.value)
                                  }
                                  placeholder={field.placeholder || ""}
                                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={formData[field.id] || ""}
                                  onChange={(e) =>
                                    handleInputChange(field.id, e.target.value)
                                  }
                                  placeholder={field.placeholder || ""}
                                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || isFormEmpty}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition active:scale-[0.99] ${
                    isGenerating || isFormEmpty
                      ? "cursor-not-allowed bg-slate-200 text-slate-400"
                      : "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
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
                      AIで文章を生成
                    </>
                  )}
                </button>

                <button
                  onClick={handleFullCopy}
                  disabled={isFormEmpty}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-semibold transition ${
                    isFormEmpty
                      ? "cursor-not-allowed border-slate-200 text-slate-300"
                      : isFullCopied
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {isFullCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      コピー完了
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      入力内容をコピー
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

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm min-h-[520px]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
                <Sparkles className="h-4 w-4 text-amber-500" />
                生成結果
              </h2>

              {generatedText && (
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    isCopied
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Clipboard className="h-3.5 w-3.5" />
                  )}
                  {isCopied ? "コピー済" : "結果をコピー"}
                </button>
              )}
            </div>

            <div className="max-h-[800px] overflow-y-auto p-6">
              {!generatedText && !isGenerating && (
                <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center text-slate-400">
                  <div className="mb-4 rounded-full bg-slate-100 p-4">
                    <FileText className="h-10 w-10 opacity-60" />
                  </div>
                  <p className="text-sm leading-6">
                    フォームに入力して、
                    <br />
                    「AIで文章を生成」をクリックしてください。
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 w-3/4 rounded bg-slate-100"></div>
                  <div className="h-4 w-full rounded bg-slate-100"></div>
                  <div className="h-4 w-5/6 rounded bg-slate-100"></div>
                  <div className="h-4 w-2/3 rounded bg-slate-100"></div>
                </div>
              )}

              {generatedText && (
                <div className="prose prose-sm max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-blue-700">
                  <ReactMarkdown>{generatedText}</ReactMarkdown>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center">
        <p className="text-sm text-slate-500">
          © 2026 SmartReport AI. Powered by Gemini.
        </p>
      </footer>
    </div>
  );
}
