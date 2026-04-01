export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      
      {/* Header */}
      <div className="p-4 bg-white border-b">
        <h1 className="text-lg font-bold">SmartReport AI</h1>
      </div>

      {/* Main */}
      <div className="p-6 flex-1">
        <p>ここにアプリの中身が入ります</p>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          © 2026 SmartReport AI. Powered by Gemini.
        </p>
      </footer>

    </div>
  );
}
