import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Clarity InfoTech | Software Engineering & Cloud Solutions",
  description: "Clarity InfoTech delivers enterprise-grade software engineering, DevOps automation, cloud architecture, and security audit systems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-sans h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <div id="root"></div>
        <Script
          src="http://localhost:3000/loader.js"
          data-api-key="PUB_67B32A79924D2EA331A4"
          data-domain="localhost:3001"
          data-api-url="http://localhost:3000"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
