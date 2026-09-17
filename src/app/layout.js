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
          data-api-key="PUB_0CD9B0CABBEA84E27B09"
          data-domain="clarityinfotech-92hpgpzv5-nancythomas-projects.vercel.app"
          data-api-url="http://localhost:3000"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
