// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="w1r0HBgP6j2vO_AMU3ZcWbrCBYoa_HLP_b_duOAm2B8" />
        
        {/* Character Encoding */}
        <meta charSet="utf-8" />
        
        {/* Viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Basic SEO */}
        <meta name="description" content="AI Prompt Maker - Transform your ideas into perfect AI prompts with multiple AI models. Free tool for creators, writers, and developers." />
        <meta name="keywords" content="AI prompts, prompt generator, AI writing, content creation, ChatGPT, GPT-4, AI tools, free AI" />
        <meta name="author" content="AI Prompt Maker" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aipromptmaker.online/" />
        <meta property="og:title" content="AI Prompt Maker - Free AI Prompt Generator" />
        <meta property="og:description" content="Transform your ideas into perfect AI prompts with multiple AI models. Free tool for creators and developers." />
        <meta property="og:image" content="https://aipromptmaker.online/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://aipromptmaker.online/" />
        <meta property="twitter:title" content="AI Prompt Maker - Free AI Prompt Generator" />
        <meta property="twitter:description" content="Transform your ideas into perfect AI prompts with multiple AI models." />
        <meta property="twitter:image" content="https://aipromptmaker.online/twitter-image.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://aipromptmaker.online/" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI Prompt Maker",
              "description": "Free AI Prompt Generator tool that transforms your ideas into perfect AI prompts",
              "url": "https://aipromptmaker.online/",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "permissions": "browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "AI Prompt Maker"
              }
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
