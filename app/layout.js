import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Prompt Maker",
  description: "Create amazing AI prompts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-EQXC7722KC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EQXC7722KC');
          `}
        </Script>
        
        {/* Auto Ads Code */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8739462043637379"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
            <meta name="google-adsense-account" content="ca-pub-8739462043637379" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
