// pages/_app.js
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  // Service Worker Registration for PropellerAds
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Prompt Maker - Free AI Tools | Code Debugger, Translator, SEO Tools</title>
        <meta name="title" content="Prompt Maker - Free AI Tools | Code Debugger, Translator, SEO Tools" />
        <meta
          name="description"
          content="Free AI tools platform - AI Prompt Generator, Code Debugger, AI Translator, SEO Meta Tools. 100% Free, No Signup Required. Try Now!"
        />
        <meta name="keywords" content="ai prompt generator, free prompt maker, code debugger, ai translator, seo tools, free ai tools, no signup ai tools" />
        <meta name="author" content="Prompt Maker" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* PropellerAds Monetag - IMPORTANT */}
        <meta name="monetag" content="2ff36e6e9d16445611d088cf9546df1d" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:title" content="Prompt Maker - Free AI Tools Platform" />
        <meta
          property="og:description"
          content="Free AI tools - Prompt Generator, Code Debugger, Translator, SEO Tools. No Signup Required."
        />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yourdomain.com/" />
        <meta property="twitter:title" content="Prompt Maker - Free AI Tools Platform" />
        <meta
          property="twitter:description"
          content="Free AI tools - Prompt Generator, Code Debugger, Translator, SEO Tools."
        />
        <meta property="twitter:image" content="https://yourdomain.com/og-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="FeI7rBqbWesNjgaCWozMEhBcFPU7EjubLYkWmS85vOI" />
      </Head>

      {/* ✅ GOOGLE ADSENSE AUTO ADS - ADDED */}
      <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8739462043637379"
        crossOrigin="anonymous"
      />
      <Script
        id="google-adsense-auto"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-8739462043637379",
              enable_page_level_ads: true
            });
          `,
        }}
      />

      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-EQXC7722KC"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EQXC7722KC');
          `,
        }}
      />

      {/* PropellerAds Script */}
      <Script
        id="propellerads-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(e,t,n,o,r,s){e[o]=e[o]||function(){
            (e[o].q=e[o].q||[]).push(arguments)},e[o].l=1*new Date;
            r=t.createElement(n);s=t.getElementsByTagName(n)[0];
            r.async=1;r.src="https://cdn.propellerads.com/...";
            s.parentNode.insertBefore(r,s)})(window,document,"script","ppjs");

            ppjs('init', {
              website: 'YOUR_SITE_ID',
              subids: {},
              plugins: {
                push: {
                  permission: {
                    type: 'dismissible'
                  }
                }
              }
            });
          `,
        }}
      />

      {/* Main Component - YE LINE BILKUL NA HATAYEIN */}
      <Component {...pageProps} />
    </>
  );
}
