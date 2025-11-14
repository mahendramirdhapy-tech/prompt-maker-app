// pages/prompt-builder.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function PromptBuilder() {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    // Save prompt logic here
    alert('Prompt saved successfully!');
    router.push('/prompts');
  };

  return (
    <div className="prompt-builder">
      <Head>
        <title>Prompt Builder - AI Prompt Maker</title>
      </Head>

      <button onClick={() => router.back()} className="back-button">
        ← Back to Library
      </button>

      <h1>Prompt Builder</h1>
      
      <div className="builder-form">
        <input
          type="text"
          placeholder="Prompt Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        
        <textarea
          placeholder="Enter your prompt here... Use {variables} for dynamic parts"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="prompt-textarea"
          rows="10"
        />
        
        <button onClick={handleSave} className="save-btn">
          Save Prompt
        </button>
      </div>
    </div>
  );
}
