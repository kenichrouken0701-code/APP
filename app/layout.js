import "./globals.css";

export const metadata = {
  title: "振り返りシート",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
