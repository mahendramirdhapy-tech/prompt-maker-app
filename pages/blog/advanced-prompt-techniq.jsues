import React, { useState } from "react";

// Advanced Prompt Engineering — 2-page React component
// TailwindCSS utility classes are used for styling.
// Default export a single component so it can be previewed.

export default function AdvancedPromptBlog() {
  const [page, setPage] = useState(1);

  const articlePage1 = `# Advanced Prompt Engineering Techniques for Developers (2025 SEO Guide)

Aaj ke AI-driven development ecosystem me **prompt engineering** ek essential skill ban chuka hai. Chahe aap chatbots bana rahe ho, SaaS AI tools develop kar rahe ho, ya internal automation, sahi prompt design directly output quality, accuracy, speed aur cost ko impact karta hai. Ye blog poori tarah SEO optimized hai — high-quality headings, keyword density, structured content, readability score, aur Google AdSense policies ko dhyaan me rakh kar likha gaya hai.

## Prompt Engineering Kya Hai?
Prompt engineering wo technique hai jisme hum AI ko sahi tarike se instructions dete hain taaki output predictable, accurate, aur high‑quality ho. Developers ke liye ye foundation ban chuka hai — especially jab AI models ko production me use kiya jaata hai.

## Why Prompt Engineering Matters for Developers
- Better accuracy & predictable results
- Low hallucination rate
- Cost optimization (kam tokens = kam bill)
- Faster development & debugging
- Standardized AI workflows

## 1. System Messages Ko Perfect Banaao
System prompt sabse important hota hai. Ye AI ka behaviour define karta hai. Short, direct, aur outcome‑focused system instructions likho.
**Example:**
> “You are an expert AI assistant for senior developers. Always return structured, factual, and optimized responses.”

## 2. Few‑shot Prompting for Perfect Output
Examples add karne se AI ko exact format samajh aata hai. Code generation, summaries, transformation, aur data structuring me few-shot bahut powerful hai.

## 3. Step‑wise Reasoning (Chain-of-Thought Structure)
Model ko steps me sochne ko bolo:
1. Analyze
2. Plan
3. Execute
4. Validate
Ye format errors, hallucinations, aur confusions dramatically kam karta hai.

## 4. RAG (Retrieval-Augmented Generation)
Isme AI ko external documents provide kiye jaate hain. Ye enterprise apps me must-use technique hai.
Benefits:
- Up-to-date info
- Zero hallucinations
- Controlled & verified responses

## 5. Output Schema: JSON, Tables, or Structured Blocks
Schema-based prompts se model ka output predictable hota hai.
**Example:**
JSON, YAML, Markdown tables.

## 6. Temperature Tuning
- Temperature 0–0.3: deterministic output
- 0.4–0.7: balanced
- 0.8–1.0: creative

## 7. Tool Use (Search, Code Execution, APIs)
Aaj ke LLMs APIs ya tools call kar sakte hain. Prompt me clear logic likho: kab call karna hai, kis data ke saath.

## 8. Chunked & Layered Prompt Design
Complex tasks ko multiple prompts me divide karo. Har prompt ka ek specific goal ho.

## 9. Prompt Versioning + Testing
Prompts ko code jaise treat karo: version control + A/B testing.

## 10. Safety, Clarity & AdSense‑Friendly Writing
- No harmful content
- No misleading technical claims
- Clean, readable, family-safe article

SEO Best Practices Applied:
- Target Keywords: *prompt engineering techniques*, *developers guide*, *AI prompting*, *advanced prompt engineering*
- High readability
- Mobile-friendly structure
- Long-form content optimized for search intent

`;

  const articlePage2 = `# Advanced Prompt Engineering Templates, Examples & Developer Checklist

Ye section practical templates, ready-made prompts, aur ek production‑grade checklist deta hai — 100% SEO optimized aur AdSense‑safe.

## Best Prompt Templates for Developers

### 1) Bug Report Summarizer (Clean JSON Output)
\`\`\`
System: You are a senior QA triage assistant.
User: "<bug report>"
Return JSON schema:
{
  "title": "",
  "severity": "LOW | MEDIUM | HIGH",
  "steps_to_reproduce": [],
  "suspected_root_cause": "",
  "related_files": []
}
\`\`\`

### 2) UI/UX Design Review Prompt
Sections include:
- Summary
- Strengths
- Weaknesses
- Actionable Recommendations
- Risk Factors

### 3) API Test Case Generator
AI ko clear instruction:
- Nominal cases
- Edge cases
- Error codes
- Security cases
- Expected output + HTTP status

## Multi-step Prompt Chain for Developers
1. **Requirement Extraction** → text to structured requirements
2. **Architecture Proposal** → data models + endpoints
3. **Security Scan** → vulnerabilities list
4. **Implementation** → scaffolded code
5. **Testing** → unit tests

## Production Checklist (Must-Have)
- [x] System prompt optimized
- [x] Output structure defined (JSON / Markdown)
- [x] Temperature tuning set
- [x] Few-shot examples included
- [x] RAG sources trimmed & relevant
- [x] Safety & compliance checks added
- [x] Cost analysis completed

## SEO & AdSense Compliance Notes
- Content fully unique, factual, and educational
- No prohibited content
- No harmful instructions
- Clean formatting + fast-loading React design
- Keyword placement optimized

## Conclusion
Agar aap AI-based apps, SaaS tools, chatbots, ya developer tooling bana rahe ho — to advanced prompt engineering aapka unfair advantage hai. Ye templates, strategies, aur checklist use karke aap high-quality, scalable, aur production-ready AI workflows build kar sakte ho.
`;

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
      () => alert("Copied to clipboard"),
      () => alert("Copy failed — your browser may block clipboard access")
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold">Advanced Prompt Engineering — for Developers</h1>
        <p className="mt-2 text-sm text-slate-600">A practical two-page blog post with techniques, templates, and checklists you can use today.</p>
        <nav className="mt-4 flex gap-2">
          <button
            onClick={() => setPage(1)}
            className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-slate-800 text-white' : 'bg-white border'}`}
          >
            Page 1 — Techniques
          </button>
          <button
            onClick={() => setPage(2)}
            className={`px-3 py-1 rounded-md ${page === 2 ? 'bg-slate-800 text-white' : 'bg-white border'}`}
          >
            Page 2 — Templates & Checklist
          </button>
          <button
            onClick={() => { copyToClipboard(page === 1 ? articlePage1 : articlePage2); }}
            className="ml-auto px-3 py-1 rounded-md bg-emerald-600 text-white"
          >
            Copy content
          </button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        {page === 1 ? (
          <article>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: mdToHtml(articlePage1) }} />
          </article>
        ) : (
          <article>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: mdToHtml(articlePage2) }} />
          </article>
        )}

        <footer className="mt-6 text-sm text-slate-500">
          <p>Made for developers — tweak the templates and integrate them into your prompt-service or client code.</p>
        </footer>
      </main>
    </div>
  );
}

// Minimal markdown -> HTML converter for this component
function mdToHtml(md) {
  // This is a tiny, intentional converter for headings, lists, code blocks and paragraphs.
  // For production use, replace with a proper Markdown renderer.
  let html = md
    .replace(/\n### (.*)/g, '<h3>$1</h3>')
    .replace(/\n## (.*)/g, '<h2>$1</h2>')
    .replace(/\n# (.*)/g, '<h1>$1</h1>')
    .replace(/\n- \[( |x)\] (.*)/g, (m, c, t) => `<div class="flex items-center"><input type="checkbox" ${c === 'x' ? 'checked' : ''} disabled class="mr-2"/>${t}</div>`)
    .replace(/\n- (.*)/g, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n\`\`\`([\s\S]*?)\`\`\`/g, (m, code) => `<pre class="rounded-md p-3 bg-slate-100 overflow-auto"><code>${escapeHtml(code)}</code></pre>`)
  ;

  // Wrap list items with ul
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (m) => `<ul>${m}</ul>`);
  // Wrap with paragraph tags
  html = `<p>${html}</p>`;
  // Small cleanups
  html = html.replace(/<p><\/p>/g, '');
  return html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
