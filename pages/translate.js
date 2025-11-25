// pages/translate.js
import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function Translator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fromLang, setFromLang] = useState('English');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter some text to translate');
      return;
    }
    
    setLoading(true);
    setOutput('');

    const targetLang = fromLang === 'English' ? 'Hindi' : 'English';
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: `Translate the following text from ${fromLang} to ${targetLang}. Only provide the translation without any additional text:\n\n${input}`,
          language: targetLang,
          tone: 'Professional',
          maxTokens: 500,
          type: 'prompt'
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setOutput(data.prompt || data.result || 'Translation not available');
      } else {
        alert('❌ ' + (data.error || 'Translation failed'));
      }
    } catch (e) {
      console.error('Translation error:', e);
      alert('⚠️ ' + (e.message || 'Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    if (output) {
      setInput(output);
      setOutput('');
    }
    setFromLang(fromLang === 'English' ? 'Hindi' : 'English');
  };

  const clearText = () => {
    setInput('');
    setOutput('');
  };

  const copyTranslation = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('✅ Translation copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Hindi ↔ English Translator | Free Online Translation Tool & Language Guide</title>
        <meta 
          name="description" 
          content="Free online Hindi to English and English to Hindi translator. Fast, accurate translations with professional results. Complete language learning guide and translation tips." 
        />
        <meta 
          name="keywords" 
          content="hindi to english translator, english to hindi translation, free translator, online translation, hindi english converter, language translator, hindi learning, english learning, translation tips" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="AI Prompt Maker" />
        <meta property="og:title" content="Hindi ↔ English Translator & Complete Language Guide" />
        <meta property="og:description" content="Free AI-powered Hindi-English translator with comprehensive language learning guide and translation strategies." />
      </Head>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '0 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>

        {/* Tool Section */}
        <div style={{ 
          padding: '2rem',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          marginBottom: '3rem'
        }}>

          <h1 style={{ 
            textAlign: 'center', 
            color: '#1e293b',
            marginBottom: '1.5rem',
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            🔄 Hindi ↔ English Translator
          </h1>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '20px', 
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: fromLang === 'English' ? '#3b82f6' : '#e2e8f0',
              color: fromLang === 'English' ? 'white' : '#64748b',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              <span>{fromLang === 'English' ? '🇺🇸' : '🇮🇳'}</span>
              {fromLang}
            </div>
            
            <button
              onClick={swapLanguages}
              style={{
                padding: '10px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
              title="Swap languages"
              aria-label="Swap languages"
            >
              ⇄
            </button>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: fromLang === 'Hindi' ? '#3b82f6' : '#e2e8f0',
              color: fromLang === 'Hindi' ? 'white' : '#64748b',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              <span>{fromLang === 'Hindi' ? '🇺🇸' : '🇮🇳'}</span>
              {fromLang === 'English' ? 'Hindi' : 'English'}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Enter text in ${fromLang}...`}
                rows="6"
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  fontSize: '16px', 
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                required
                aria-label={`Text to translate from ${fromLang}`}
              />
              {input && (
                <button
                  type="button"
                  onClick={clearText}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  aria-label="Clear text"
                >
                  ✕
                </button>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{ 
                width: '100%', 
                padding: '14px', 
                backgroundColor: loading ? '#94a3b8' : '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              aria-label={loading ? 'Translating...' : 'Translate text'}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Translating...
                </>
              ) : (
                <>🌐 Translate</>
              )}
            </button>
          </form>

          {output && (
            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h2 style={{ 
                  margin: 0, 
                  color: '#1e293b',
                  fontSize: '1.25rem'
                }}>
                  Translation Result:
                </h2>
                <button
                  onClick={copyTranslation}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#0d9488',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  aria-label="Copy translation to clipboard"
                >
                  📋 Copy
                </button>
              </div>
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                backgroundColor: '#f8fafc', 
                padding: '16px', 
                borderRadius: '6px',
                fontSize: '16px',
                lineHeight: '1.5',
                minHeight: '100px',
                borderLeft: '4px solid #3b82f6'
              }}>
                {output}
              </div>
            </div>
          )}
        </div>

        {/* Educational Content Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#1e293b',
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: '700'
          }}>
            The Complete Guide to Hindi-English Translation
          </h2>

          {/* Introduction */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            marginBottom: '2rem',
            borderLeft: '4px solid #0ea5e9'
          }}>
            <h3 style={{ color: '#0369a1', marginTop: 0 }}>🌍 Introduction to Hindi-English Language Bridge</h3>
            <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
              Hindi and English represent two of the world's most influential languages, connecting over 1.5 billion people globally. 
              While English serves as the lingua franca of business and technology, Hindi connects the cultural heart of India 
              and its diaspora worldwide. Effective translation between these languages requires understanding both linguistic 
              structures and cultural contexts.
            </p>
            <p style={{ lineHeight: '1.7' }}>
              This comprehensive guide explores the art and science of Hindi-English translation, providing practical strategies, 
              cultural insights, and technical knowledge to bridge these two rich linguistic worlds.
            </p>
          </div>

          {/* Language Comparison */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              📊 Hindi vs English: Key Linguistic Differences
            </h3>
            
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#475569', marginTop: 0 }}>🔤 Alphabet and Writing Systems</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <h5 style={{ color: '#166534', marginTop: 0 }}>🇮🇳 Hindi (Devanagari Script)</h5>
                  <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem', margin: 0 }}>
                    <li>48 primary characters (13 vowels, 35 consonants)</li>
                    <li>Written left to right</li>
                    <li>Phonetic writing system</li>
                    <li>Matra symbols for vowel modifications</li>
                    <li>Connected script with headline (shirorekha)</li>
                  </ul>
                </div>
                
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#fef7ed',
                  borderRadius: '8px',
                  border: '1px solid '#fed7aa'
                }}>
                  <h5 style={{ color: '#9a3412', marginTop: 0 }}>🇺🇸 English (Latin Script)</h5>
                  <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem', margin: 0 }}>
                    <li>26 basic letters</li>
                    <li>Written left to right</li>
                    <li>Non-phonetic spelling</li>
                    <li>Capital and lowercase forms</li>
                    <li>Disconnected script</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ color: '#475569', marginTop: 0 }}>⚡ Grammar and Sentence Structure</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '6px' }}>
                  <strong style={{ color: '#047857' }}>Hindi Grammar:</strong>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                    <li>SOV word order (Subject-Object-Verb)</li>
                    <li>Gendered nouns (masculine/feminine)</li>
                    <li>Postpositions instead of prepositions</li>
                    <li>Verb conjugation based on gender</li>
                  </ul>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '6px' }}>
                  <strong style={{ color: '#1d4ed8' }}>English Grammar:</strong>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                    <li>SVO word order (Subject-Verb-Object)</li>
                    <li>Neutral gender for most nouns</li>
                    <li>Prepositions</li>
                    <li>Simpler verb conjugation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Translation Challenges */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              🎯 Common Translation Challenges and Solutions
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid '#fecaca'
              }}>
                <h4 style={{ color: '#dc2626', marginTop: 0 }}>🤔 Idioms and Cultural References</h4>
                <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                  <strong>Challenge:</strong> Direct translation of idioms often makes no sense. 
                  "उल्टा चोर कोतवाल को डांटे" literally means "The thief scolds the watchman."
                </p>
                <p style={{ lineHeight: '1.6', margin: 0 }}>
                  <strong>Solution:</strong> Find equivalent expressions. The above idiom translates to 
                  "The pot calling the kettle black" in English.
                </p>
              </div>
              
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid '#bae6fd'
              }}>
                <h4 style={{ color: '#0c4a6e', marginTop: 0 }}>🔤 Honorifics and Formality</h4>
                <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                  <strong>Challenge:</strong> Hindi has complex honorific systems (आप, तुम, तू) 
                  that don't directly map to English "you."
                </p>
                <p style={{ lineHeight: '1.6', margin: 0 }}>
                  <strong>Solution:</strong> Use context-appropriate language. "आप" becomes formal "you," 
                  while "तू" might become casual address or be omitted.
                </p>
              </div>
              
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid '#bbf7d0'
              }}>
                <h4 style={{ color: '#166534', marginTop: 0 }}>📝 Compound Words</h4>
                <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                  <strong>Challenge:</strong> Hindi frequently uses compound words like "रसोईघर" 
                  (kitchen + room = kitchen).
                </p>
                <p style={{ lineHeight: '1.6', margin: 0 }}>
                  <strong>Solution:</strong> Break down components or find single-word equivalents. 
                  "रसोईघर" simply becomes "kitchen" in English.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Translation Examples */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              💼 Practical Translation Examples
            </h3>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ color: '#475569', marginTop: 0 }}>📚 Everyday Conversation</h4>
              
              <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Hindi:</strong> "क्या आप मुझे बाजार का रास्ता बता सकते हैं?"
                  </div>
                  <div style={{ textAlign: 'center', color: '#3b82f6', fontWeight: 'bold' }}>→</div>
                  <div>
                    <strong>English:</strong> "Can you tell me the way to the market?"
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Hindi:</strong> "मुझे यह पसंद है।"
                  </div>
                  <div style={{ textAlign: 'center', color: '#3b82f6', fontWeight: 'bold' }}>→</div>
                  <div>
                    <strong>English:</strong> "I like this."
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginTop: '1.5rem'
            }}>
              <h4 style={{ color: '#475569', marginTop: 0 }}>🏢 Business and Formal Context</h4>
              
              <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Hindi:</strong> "कृपया इस रिपोर्ट को शुक्रवार तक पूरा करें।"
                  </div>
                  <div style={{ textAlign: 'center', color: '#3b82f6', fontWeight: 'bold' }}>→</div>
                  <div>
                    <strong>English:</strong> "Please complete this report by Friday."
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Hindi:</strong> "हमें इस परियोजना के लिए आपकी विशेषज्ञता की आवश्यकता है।"
                  </div>
                  <div style={{ textAlign: 'center', color: '#3b82f6', fontWeight: 'bold' }}>→</div>
                  <div>
                    <strong>English:</strong> "We need your expertise for this project."
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Translation Strategies */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              🛠️ Effective Translation Strategies
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#fef7ed',
                borderRadius: '8px',
                border: '1px solid '#fed7aa'
              }}>
                <h4 style={{ color: '#9a3412', marginTop: 0 }}>1. Understand Context First</h4>
                <p style={{ lineHeight: '1.6', margin: 0 }}>
                  Read the entire sentence or paragraph before translating. Context determines meaning, 
                  especially for words with multiple interpretations.
                </p>
              </div>
              
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid '#bae6fd'
              }}>
                <h4 style={{ color: '#0c4a6e', marginTop: 0 }}>2. Preserve Meaning, Not Words</h4>
                <p style={{ lineHeight: '1.6', margin: 0 }}>
                  Focus on conveying the intended meaning rather than word-for-word translation. 
                  This ensures natural-sounding results in the target language.
                </p>
              </div>
              
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid '#bbf7d0'
              }}>
                <h4 style={{ color: '#166534', marginTop: 0 }}>3. Consider Cultural Nuances</h4>
                <p style={{ lineHeight: '1.6', margin: 0 }}>
                  Adapt references, idioms, and cultural concepts to make sense in the target language 
                  while maintaining the original intent.
                </p>
              </div>
            </div>
          </div>

          {/* Language Learning Tips */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              📚 Language Learning Tips for Hindi & English
            </h3>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#faf5ff',
              borderRadius: '8px',
              border: '1px solid '#e9d5ff'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: '#6b21a8', marginTop: 0 }}>🇮🇳 For English Speakers Learning Hindi</h4>
                  <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                    <li>Start with Devanagari script mastery</li>
                    <li>Practice gender agreement early</li>
                    <li>Learn common verb conjugations</li>
                    <li>Focus on listening comprehension</li>
                    <li>Use spaced repetition for vocabulary</li>
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ color: '#1e40af', marginTop: 0 }}>🇺🇸 For Hindi Speakers Learning English</h4>
                  <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                    <li>Master English article usage (a, an, the)</li>
                    <li>Practice preposition combinations</li>
                    <li>Learn phrasal verbs systematically</li>
                    <li>Focus on English sentence rhythm</li>
                    <li>Build academic and professional vocabulary</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Translation */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              💼 Professional Translation Services
            </h3>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
                While AI translators like ours are excellent for everyday use, professional human translation 
                remains essential for:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#fef7ed', borderRadius: '6px' }}>
                  <strong>Legal Documents</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px' }}>Contracts, certificates, court documents requiring precise terminology</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
                  <strong>Medical Content</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px' }}>Patient records, prescriptions, medical research papers</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
                  <strong>Literary Works</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px' }}>Books, poetry, creative writing requiring cultural adaptation</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#faf5ff', borderRadius: '6px' }}>
                  <strong>Marketing Materials</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px' }}>Advertisements, brand messaging, cultural localization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div style={{
            padding: '2rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid '#bae6fd'
          }}>
            <h3 style={{ color: '#0369a1', marginTop: 0 }}>🌉 Bridge Languages, Connect Cultures</h3>
            <p style={{ lineHeight: '1.7', fontSize: '1.125rem', marginBottom: '1rem' }}>
              Hindi-English translation is more than converting words—it's about bridging cultures, 
              enabling communication, and fostering understanding between diverse communities. 
              Whether you're using our AI translator for quick conversations or studying these languages deeply, 
              you're participating in a global exchange that enriches both languages and their speakers.
            </p>
            <p style={{ lineHeight: '1.7', fontSize: '1.125rem', margin: 0 }}>
              Use the translation tool above for immediate needs, and refer to this guide for deeper understanding 
              and learning strategies. Happy translating!
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            div {
              padding: 1rem !important;
            }
            
            h1 {
              font-size: 1.75rem !important;
            }
            
            h2 {
              font-size: 1.5rem !important;
            }
            
            h3 {
              font-size: 1.25rem !important;
            }
            
            .language-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 480px) {
            .translation-example {
              grid-template-columns: 1fr !important;
              text-align: center !important;
            }
            
            .translation-example div:first-child {
              text-align: center !important;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}
