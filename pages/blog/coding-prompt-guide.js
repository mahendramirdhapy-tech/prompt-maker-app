// pages/blog/coding-prompt-guide.js
import Head from 'next/head';
import Link from 'next/link';

export default function CodingPromptGuide() {
  return (
    <>
      <Head>
        <title>How to Generate Coding Prompts That Actually Work | Prompt Maker</title>
        <meta
          name="description"
          content="Learn how to write precise AI prompts for coding, debugging, automation, and app development. Stop getting vague code with these expert techniques."
        />
        <meta name="keywords" content="ai coding prompts, programming ai prompts, debug with ai, automation prompts, app development ai" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="How to Generate Coding Prompts That Actually Work" />
        <meta property="og:description" content="Stop getting vague code! Learn how to write precise prompts for debugging, automation, and app development." />
        <meta property="og:type" content="article" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "How to Generate Coding Prompts That Actually Work",
              "description": "Stop getting vague code! Here's how to write precise prompts for debugging, automation, and app development.",
              "datePublished": "2025-11-09",
              "author": {
                "@type": "Organization",
                "name": "Prompt Maker"
              }
            })
          }}
        />
      </Head>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6' }}>
        <nav style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </nav>

        <article>
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>
              How to Generate Coding Prompts That Actually Work
            </h1>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Published on: 9 November 2025
            </div>
          </header>

          <div style={{ color: '#374151' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Tired of getting vague, incomplete, or incorrect code from AI? The problem might be in your prompts. Here's how to write coding prompts that deliver production-ready code.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '2rem 0 1rem 0', color: '#111827' }}>
              Specify Programming Language and Version
            </h2>
            <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <strong>Instead of:</strong> "Write a function to sort an array"<br/>
              <strong>Use:</strong> "Write a Python 3.9 function using built-in sorted() method to sort a list of integers in descending order"
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '2rem 0 1rem 0', color: '#111827' }}>
              Include Edge Cases and Error Handling
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Always specify how to handle edge cases, invalid inputs, and potential errors.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '2rem 0 1rem 0', color: '#111827' }}>
              Define Input/Output Format Clearly
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Be explicit about input parameters, return types, and data formats.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '2rem 0 1rem 0', color: '#111827' }}>
              Ask for Code Comments and Documentation
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Request inline comments and documentation for better code understanding.
            </p>

            <div style={{ backgroundColor: '#fef3f2', padding: '1.5rem', borderRadius: '12px', margin: '2rem 0' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '1rem', color: '#dc2626' }}>🚫 Common Mistake</h3>
              <p style={{ margin: 0 }}>
                Don't just say "fix this code." Provide the error message, expected behavior, and what you've tried already.
              </p>
            </div>

            <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '12px', margin: '2rem 0' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>💡 Pro Tip for Debugging</h3>
              <p style={{ margin: 0 }}>
                When debugging, provide: (1) The exact error message, (2) Your code snippet, (3) What you expected to happen, (4) What actually happened.
              </p>
            </div>
          </div>

          <footer style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Ready to write better coding prompts?</p>
              <Link 
                href="/" 
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                }}
              >
                🚀 Generate Coding Prompts Now
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}
