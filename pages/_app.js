// pages/_app.js
import Head from 'next/head';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>AI Prompt Maker - Free Prompt Generator | SEO, Code, Email, Translation Tools</title>
        <meta name="title" content="Prompt Maker - Free AI Tools | Code Debugger, Translator, SEO Tools" />
        <meta
          name="description"
          content="Free AI prompt generator for SEO content, coding, email writing & translation. Create perfect ChatGPT prompts instantly. No signup required."
        />
        <meta name="keywords" content="ai prompt generator, free prompt maker, code debugger, ai translator, seo tools, free ai tools, no signup ai tools, prompt maker, promptmaker, chatgpt prompts, free ai tools, ai content generator, free ai prompt generator online, best chatgpt prompts for seo, ai prompt maker for content writing, free prompt generator for coding, ai email writer generator, seo content prompt generator, meta description ai generator, blog post ideas generator ai, content optimization prompts, keyword research ai tools" />
        <meta name="author" content="Prompt Maker" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aipromptmaker.online/" />
        <meta property="og:title" content="Prompt Maker - Free AI Tools Platform" />
        <meta
          property="og:description"
          content="Free AI tools - Prompt Generator, Code Debugger, Translator, SEO Tools. No Signup Required."
        />
        <meta property="og:image" content="https://aipromptmaker.online/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://aipromptmaker.online/" />
        <meta property="twitter:title" content="Prompt Maker - Free AI Tools Platform" />
        <meta
          property="twitter:description"
          content="Free AI tools - Prompt Generator, Code Debugger, Translator, SEO Tools."
        />
        <meta property="twitter:image" content="https://aipromptmaker.online/og-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="FeI7rBqbWesNjgaCWozMEhBcFPU7EjubLYkWmS85vOI" />
            <meta name="google-adsense-account" content="ca-pub-8739462043637379" />
      </Head>

      {/* ✅ AUTO ADS CODE */}
     

      {/* ✅ NEW GOOGLE TAG - UPDATED CODE */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=GTN-GL5G74"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GTN-GL5G74');
          `,
        }}
      />

      {/* Main Component */}
      <Component {...pageProps} />
    </>
  );
            }
