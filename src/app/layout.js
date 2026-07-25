import "./globals.css";

export const metadata = {
  title: "Clarity InfoTech | Software Engineering & Cloud Solutions",
  description: "Clarity InfoTech delivers enterprise-grade software engineering, DevOps automation, cloud architecture, and security audit systems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-sans h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
