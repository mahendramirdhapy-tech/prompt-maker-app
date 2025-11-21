// pages/_app.js
import Head from 'next/head';
import Script from 'next/script';

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
        <meta name="theme-color" content="#3B82F6" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://aipromptmaker.online/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aipromptmaker.online/" />
        <meta property="og:title" content="Prompt Maker - Free AI Tools Platform" />
        <meta
          property="og:description"
          content="Free AI tools - Prompt Generator, Code Debugger, Translator, SEO Tools. No Signup Required."
        />
        <meta property="og:image" content="https://aipromptmaker.online/og-image.jpg" />
        <meta property="og:site_name" content="Prompt Maker" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://aipromptmaker.online/" />
        <meta property="twitter:title" content="Prompt Maker - Free AI Tools Platform" />
        <meta
          property="twitter:description"
          content="Free AI tools - Prompt Generator, Code Debugger, Translator, SEO Tools."
        />
        <meta property="twitter:image" content="https://aipromptmaker.online/og-image.jpg" />
        <meta property="twitter:creator" content="@promptmaker" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="FeI7rBqbWesNjgaCWozMEhBcFPU7EjubLYkWmS85vOI" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Structured Data / JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Prompt Maker",
              "description": "Free AI tools platform with AI Prompt Generator, Code Debugger, AI Translator, and SEO Tools",
              "url": "https://aipromptmaker.online/",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Any",
              "permissions": "browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Prompt Maker"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Prompt Maker"
              }
            })
          }}
        />
      </Head>

      {/* ✅ Google Adsense Auto Ads Code */}
      <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8739462043637379"
        crossOrigin="anonymous"
        async
      />
      <Script
        id="google-auto-ads"
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

      {/* ✅ Google Analytics - Fixed Measurement ID */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GTN-GL5G74', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* ✅ Additional SEO Optimizations */}
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Prompt Maker",
            "url": "https://aipromptmaker.online/",
            "logo": "https://aipromptmaker.online/logo.png",
            "description": "Free AI tools platform for developers and content creators",
            "sameAs": [
              "https://twitter.com/promptmaker",
              "https://facebook.com/promptmaker"
            ]
          })
        }}
      />

      {/* Main Component */}
      <Component {...pageProps} />
    </>
  );
}
