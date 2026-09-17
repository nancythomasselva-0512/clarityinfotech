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
          src="https://2all-ai.mccmrfip.in/loader.js"
          data-api-key="PUB_AE1FF5961D77F77B7229"
          data-domain="clarityinfotech-92hpgpzv5-nancythomas-projects.vercel.app"
          data-api-url="https://2all-ai.mccmrfip.in"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
