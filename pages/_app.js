// pages/_app.js
import Head from 'next/head';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>AI Prompt Maker - Free & Open Source (Hindi/English)</title>
        <meta name="title" content="AI Prompt Maker - Free & Open Source (Hindi/English)" />
        <meta
          name="description"
          content="Generate optimized AI prompts for free! Supports Hindi & English. Uses OpenRouter's free models with auto-fallback. No login needed. Try now!"
        />
        <meta name="keywords" content="ai prompt generator, free prompt maker, openrouter prompt, hindi ai prompt, gpt prompt, llama prompt, mistral prompt" />
        <meta name="author" content="Your Mahendra" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aipromptmaker.online/" />
        <meta property="og:title" content="AI Prompt Maker - Free & Open Source" />
        <meta
          property="og:description"
          content="Generate optimized AI prompts for free! Supports Hindi & English. No login. Try now!"
        />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yourdomain.com/" />
        <meta property="twitter:title" content="AI Prompt Maker - Free & Open Source" />
        <meta
          property="twitter:description"
          content="Generate optimized AI prompts for free! Supports Hindi & English."
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

      <Component {...pageProps} />
    </>
  );
}
