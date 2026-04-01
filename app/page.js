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
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#202124]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              SmartReport <span className="text-blue-600">AI</span>
            </h1>
          </div>
          <span className="text-sm text-gray-500 hidden sm:inline">
            日報作成を、もっとスマートに。
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow">
        <div className="mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200 min-w-max">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-4 text-sm font-bold transition-all relative ${
                  selectedCategory.id === category.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category.id)}
                  {category.name}
                </div>
                {selectedCategory.id === category.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Layout className="w-4 h-4 text-blue-600" />
            テンプレート:
          </div>

          <div className="relative flex-grow max-w-xs">
            <select
              value={selectedTemplate.id}
              onChange={(e) =>
                setSelectedTemplate(
                  selectedCategory.templates.find((t) => t.id === e.target.value)
                )
              }
              className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 pr-10 outline-none cursor-pointer"
            >
              {selectedCategory.templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <p className="text-xs text-gray-500 italic">
            {selectedTemplate.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-fit">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                入力フォーム
              </h2>
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                リセット
              </button>
            </div>

            <div className="p-6 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTemplate.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {groupedFields.map((groupName) => (
                    <div key={groupName} className="space-y-4">
                      <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-l-2 border-blue-600 pl-2">
                        {groupName}
                      </h3>

                      <div className="grid grid-cols-1 gap-4">
                        {selectedTemplate.fields
                          .filter(
                            (f) => (f.group || "基本情報") === groupName
                          )
                          .map((field) => (
                            <div key={field.id} className="space-y-1.5">
                              <label className="text-sm font-medium text-gray-700">
                                {field.label}
                              </label>

                              {field.type === "textarea" ? (
                                <textarea
                                  rows={3}
                                  value={formData[field.id] || ""}
                                  onChange={(e) =>
                                    handleInputChange(field.id, e.target.value)
                                  }
                                  placeholder={field.placeholder || ""}
                                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={formData[field.id] || ""}
                                  onChange={(e) =>
                                    handleInputChange(field.id, e.target.value)
                                  }
                                  placeholder={field.placeholder || ""}
                                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="space-y-3 pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || isFormEmpty}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isGenerating || isFormEmpty
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg active:scale-[0.98]"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      AIで文章を生成
                    </>
                  )}
                </button>

                <button
                  onClick={handleFullCopy}
                  disabled={isFormEmpty}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                    isFormEmpty
                      ? "border-gray-100 text-gray-300"
                      : isFullCopied
                      ? "border-green-500 text-green-600 bg-green-50"
                      : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {isFullCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      コピー完了
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-4 h-4" />
                      入力内容をコピー
                    </>
                  )}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-[500px]">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                生成結果
              </h2>

              {generatedText && (
                <button
                  onClick={handleCopy}
                  className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    isCopied
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Clipboard className="w-3.5 h-3.5" />
                  )}
                  {isCopied ? "コピー済" : "結果をコピー"}
                </button>
              )}
            </div>

            <div className="p-6 flex-grow overflow-y-auto max-h-[800px]">
              {!generatedText && !isGenerating && (
                <div className="flex flex-col items-center justify-center text-gray-400 h-full py-20 text-center">
                  <FileText className="w-12 h-12 opacity-20 mb-4" />
                  <p className="text-sm">
                    フォームに入力して、
                    <br />
                    「AIで文章を生成」をクリックしてください。
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
              )}

              {generatedText && (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown>{generatedText}</ReactMarkdown>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          © 2026 SmartReport AI. Powered by Gemini.
        </p>
      </footer>
    </div>
  );
}
