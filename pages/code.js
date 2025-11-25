// pages/code.js
import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function CodeInterpreter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('auto');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter some code to explain');
      return;
    }
    
    setLoading(true);
    setOutput('');

    try {
      const detectLang = language === 'auto' ? '' : `(${language} code)`;
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: `Explain this code ${detectLang} in simple, beginner-friendly terms. Break it down step by step and describe what each part does:\n\n${input}`,
          language: 'English',
          tone: 'Friendly',
          maxTokens: 500,
          type: 'prompt'
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setOutput(data.prompt || data.result || 'Explanation not available');
      } else {
        alert('❌ ' + (data.error || 'Failed to explain code'));
      }
    } catch (e) {
      console.error('Code explanation error:', e);
      alert('⚠️ ' + (e.message || 'Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const clearCode = () => {
    setInput('');
    setOutput('');
  };

  const copyExplanation = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('✅ Explanation copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const insertSampleCode = () => {
    const sampleCode = `// Sample JavaScript code
function calculateSum(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log(result);`;
    setInput(sampleCode);
  };

  return (
    <Layout>
      <Head>
        <title>Code Interpreter & Explainer | Free AI-Powered Code Analysis</title>
        <meta 
          name="description" 
          content="Understand any code instantly. Free AI-powered code interpreter that explains Python, JavaScript, and other programming languages in simple terms." 
        />
        <meta 
          name="keywords" 
          content="code interpreter, code explainer, python code explanation, javascript explanation, learn programming, code analysis, ai code helper" 
        />
      </Head>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'relative'
      }}>

        <h1 style={{ 
          textAlign: 'center', 
          color: '#1e293b',
          marginBottom: '0.5rem',
          fontSize: '2.25rem',
          fontWeight: '700',
          paddingTop: '0.5rem'
        }}>
          💻 Code Interpreter & Explainer
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '1.125rem',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Paste any code and get a simple, beginner-friendly explanation instantly
        </p>

        {/* Language Selection */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <label style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#374151' 
          }}>
            Language:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              backgroundColor: 'white',
              fontSize: '14px'
            }}
          >
            <option value="auto">Auto-detect</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="PHP">PHP</option>
            <option value="Ruby">Ruby</option>
            <option value="Go">Go</option>
          </select>
          
          <button
            type="button"
            onClick={insertSampleCode}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: 'auto'
            }}
          >
            Try Sample Code
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste your ${language === 'auto' ? 'code' : language + ' code'} here...`}
              rows="10"
              style={{ 
                width: '100%', 
                padding: '16px', 
                fontSize: '14px', 
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                lineHeight: '1.5',
                backgroundColor: '#1f2937',
                color: '#f3f4f6'
              }}
              required
              aria-label="Code input for explanation"
            />
            {input && (
              <button
                type="button"
                onClick={clearCode}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'white'
                }}
                aria-label="Clear code"
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
              padding: '16px', 
              backgroundColor: loading ? '#94a3b8' : '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            aria-label={loading ? 'Explaining code...' : 'Explain code'}
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
                Analyzing Code...
              </>
            ) : (
              <>🔍 Explain Code</>
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
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <h3 style={{ 
                margin: 0, 
                color: '#1e293b',
                fontSize: '1.25rem'
              }}>
                Code Explanation:
              </h3>
              
              <button
                onClick={copyExplanation}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0d9488',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s'
                }}
                aria-label="Copy explanation to clipboard"
              >
                📋 Copy Explanation
              </button>
            </div>
            
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              backgroundColor: '#f8fafc', 
              padding: '16px', 
              borderRadius: '6px',
              fontSize: '16px',
              lineHeight: '1.6',
              borderLeft: '4px solid #2563eb'
            }}>
              {output}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ 
            color: '#1e293b', 
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            🚀 How It Helps You Learn
          </h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              borderLeft: '4px solid #0ea5e9'
            }}>
              <strong>Step-by-Step Breakdown</strong>
              <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                Understand each line and function in simple language
              </p>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              borderLeft: '4px solid #22c55e'
            }}>
              <strong>Multiple Languages</strong>
              <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                Supports JavaScript, Python, Java, C++, PHP, Ruby, Go and more
              </p>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#fef7ed',
              borderRadius: '8px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <strong>Beginner Friendly</strong>
              <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                No technical jargon - perfect for learning programming
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 NEW: EDUCATIONAL ARTICLE SECTION */}
        <div style={articleSectionStyle}>
          <h2 style={articleTitleStyle}>💡 कोडिंग सीखने की कंप्लीट गाइड - 2024</h2>
          
          <div style={articleContentStyle}>
            <h3 style={articleSubtitleStyle}>प्रोग्रामिंग क्यों सीखें? (Why Learn Programming?)</h3>
            <p style={articleParagraphStyle}>
              आज के डिजिटल युग में, प्रोग्रामिंग सीखना सिर्फ एक स्किल नहीं, बल्कि एक सुपरपावर है। 
              स्टैटिस्टिक्स के मुताबिक, 2025 तक भारत में 10+ मिलियन डेवलपर्स की जरूरत होगी। 
              प्रोग्रामिंग सीखने से आप न सिर्फ high-paying jobs पा सकते हैं, बल्कि अपने ideas 
              को reality में भी बदल सकते हैं।
            </p>

            <h3 style={articleSubtitleStyle}>बेस्ट प्रोग्रामिंग लैंग्वेजेज फॉर बिगिनर्स</h3>
            
            <div style={tipBoxStyle}>
              <h4 style={tipTitleStyle}>1. Python (पायथन)</h4>
              <p style={articleParagraphStyle}>
                <strong>सबसे आसान लैंग्वेज:</strong> Simple syntax, English जैसी language<br/>
                <strong>यूज केस:</strong> Web Development, Data Science, AI, Automation<br/>
                <strong>सैलरी:</strong> ₹6-15 LPA (Entry Level)<br/>
                <strong>बेस्ट फॉर:</strong> Complete beginners, Data Science enthusiasts
              </p>
            </div>

            <div style={tipBoxStyle}>
              <h4 style={tipTitleStyle}>2. JavaScript (जावास्क्रिप्ट)</h4>
              <p style={articleParagraphStyle}>
                <strong>वेब डेवलपमेंट की भाषा:</strong> Frontend और Backend दोनों के लिए<br/>
                <strong>यूज केस:</strong> Websites, Web Apps, Mobile Apps, Games<br/>
                <strong>सैलरी:</strong> ₹5-12 LPA (Entry Level)<br/>
                <strong>बेस्ट फॉर:</strong> Web development में interest रखने वाले
              </p>
            </div>

            <div style={tipBoxStyle}>
              <h4 style={tipTitleStyle}>3. Java (जावा)</h4>
              <p style={articleParagraphStyle}>
                <strong>एंटरप्राइज लेवल लैंग्वेज:</strong> Large companies में widely used<br/>
                <strong>यूज केस:</strong> Android Apps, Enterprise Software, Banking Systems<br/>
                <strong>सैलरी:</strong> ₹4-10 LPA (Entry Level)<br/>
                <strong>बेस्ट फॉर:</strong> Corporate jobs और Android development
              </p>
            </div>

            <h3 style={articleSubtitleStyle}>कोडिंग सीखने का सही तरीका</h3>
            
            <div style={stepByStepStyle}>
              <div style={stepItemStyle}>
                <div style={stepNumberStyle}>1</div>
                <div style={stepContentStyle}>
                  <h5 style={stepTitleStyle}>Basics से शुरुआत करें</h5>
                  <p style={stepDescStyle}>Variables, Data Types, Loops, Functions की concepts समझें</p>
                </div>
              </div>
              
              <div style={stepItemStyle}>
                <div style={stepNumberStyle}>2</div>
                <div style={stepContentStyle}>
                  <h5 style={stepTitleStyle}>Practice, Practice, Practice</h5>
                  <p style={stepDescStyle}>रोज 1-2 घंटे coding practice करें। Small projects बनाएं</p>
                </div>
              </div>
              
              <div style={stepItemStyle}>
                <div style={stepNumberStyle}>3</div>
                <div style={stepContentStyle}>
                  <h5 style={stepTitleStyle}>Read Others' Code</h5>
                  <p style={stepDescStyle}>दूसरों का code समझें। GitHub पर open source projects explore करें</p>
                </div>
              </div>
              
              <div style={stepItemStyle}>
                <div style={stepNumberStyle}>4</div>
                <div style={stepContentStyle}>
                  <h5 style={stepTitleStyle}>Build Real Projects</h5>
                  <p style={stepDescStyle}>Simple calculator, To-do app, Personal website जैसे projects बनाएं</p>
                </div>
              </div>
            </div>

            <h3 style={articleSubtitleStyle}>कॉमन कोडिंग मिस्टेक्स और उनके सॉल्यूशन</h3>
            
            <div style={mistakesGridStyle}>
              <div style={mistakeItemStyle}>
                <div style={mistakeIconStyle}>❌</div>
                <div style={mistakeContentStyle}>
                  <h5 style={mistakeTitleStyle}>Syntax Errors</h5>
                  <p style={mistakeDescStyle}>Missing semicolons, brackets mismatch</p>
                  <p style={solutionStyle}><strong>Solution:</strong> Code editor की auto-complete feature use करें</p>
                </div>
              </div>
              
              <div style={mistakeItemStyle}>
                <div style={mistakeIconStyle}>❌</div>
                <div style={mistakeContentStyle}>
                  <h5 style={mistakeTitleStyle}>Logic Errors</h5>
                  <p style={mistakeDescStyle}>Code runs but gives wrong output</p>
                  <p style={solutionStyle}><strong>Solution:</strong> Debugging tools use करें, step-by-step test करें</p>
                </div>
              </div>
              
              <div style={mistakeItemStyle}>
                <div style={mistakeIconStyle}>❌</div>
                <div style={mistakeContentStyle}>
                  <h5 style={mistakeTitleStyle}>No Comments</h5>
                  <p style={mistakeDescStyle}>Code without explanations</p>
                  <p style={solutionStyle}><strong>Solution:</strong> Regular comments add करें, clean code लिखें</p>
                </div>
              </div>
            </div>

            <h3 style={articleSubtitleStyle}>फ्री रिसोर्सेज टू लर्न कोडिंग</h3>
            
            <div style={resourcesGridStyle}>
              <div style={resourceItemStyle}>
                <div style={resourceIconStyle}>🎓</div>
                <div style={resourceContentStyle}>
                  <h5 style={resourceTitleStyle}>FreeCodeCamp</h5>
                  <p style={resourceDescStyle}>Complete free coding courses with certifications</p>
                </div>
              </div>
              
              <div style={resourceItemStyle}>
                <div style={resourceIconStyle}>📚</div>
                <div style={resourceContentStyle}>
                  <h5 style={resourceTitleStyle}>W3Schools</h5>
                  <p style={resourceDescStyle}>Web technologies के लिए best tutorials</p>
                </div>
              </div>
              
              <div style={resourceItemStyle}>
                <div style={resourceIconStyle}>💻</div>
                <div style={resourceContentStyle}>
                  <h5 style={resourceTitleStyle}>YouTube Channels</h5>
                  <p style={resourceDescStyle}>CodeWithHarry, Apna College, FreeCodeCamp</p>
                </div>
              </div>
              
              <div style={resourceItemStyle}>
                <div style={resourceIconStyle}>🔗</div>
                <div style={resourceContentStyle}>
                  <h5 style={resourceTitleStyle}>GitHub</h5>
                  <p style={resourceDescStyle}>Real-world projects और open source code</p>
                </div>
              </div>
            </div>

            <h3 style={articleSubtitleStyle}>कोड रीडिंग के टिप्स (Code Reading Tips)</h3>
            <ul style={articleListStyle}>
              <li><strong>Start Small:</strong> छोटे codes से शुरुआत करें</li>
              <li><strong>Understand Flow:</strong> Code execution flow समझें</li>
              <li><strong>Break Down:</strong> Complex code को small parts में break करें</li>
              <li><strong>Use Debugger:</strong> Step-by-step execution देखें</li>
              <li><strong>Read Documentation:</strong> Official documentation पढ़ें</li>
              <li><strong>Practice Regularly:</strong> रोज नया code read और analyze करें</li>
            </ul>

            <div style={warningBoxStyle}>
              <h4 style={warningTitleStyle}>💡 महत्वपूर्ण सलाह</h4>
              <p style={articleParagraphStyle}>
                कोडिंग सीखने में time और patience की जरूरत होती है। Overnight success की 
                expectation न रखें। Consistent practice और curiosity आपको successful 
                programmer बना सकती है। हमारे Code Interpreter tool का use करके आप 
                किसी भी code को easily understand कर सकते हैं और अपनी learning speed 
                improve कर सकते हैं।
              </p>
            </div>

            <div style={articleConclusionStyle}>
              <h4 style={conclusionTitleStyle}>निष्कर्ष</h4>
              <p style={articleParagraphStyle}>
                प्रोग्रामिंग सीखना एक rewarding journey है जो आपको problem-solving skills, 
                creative thinking, और high-demand career opportunities देता है। हमारे 
                Code Interpreter tool के साथ, आप किसी भी programming language के code 
                को easily understand कर सकते हैं। याद रखें - हर expert programmer कभी 
                beginner ही था। Consistent practice और right resources के साथ, आप भी 
                successful programmer बन सकते हैं!
              </p>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Layout>
  );
}

// 🔥 NEW STYLES FOR ARTICLES
const articleSectionStyle = {
  marginTop: '3rem',
  padding: '2rem',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

const articleTitleStyle = {
  color: '#1e293b',
  fontSize: '1.75rem',
  fontWeight: '700',
  marginBottom: '1.5rem',
  textAlign: 'center',
  lineHeight: '1.4'
};

const articleContentStyle = {
  lineHeight: '1.7',
  fontSize: '16px'
};

const articleSubtitleStyle = {
  color: '#2563eb',
  fontSize: '1.35rem',
  fontWeight: '600',
  margin: '2rem 0 1rem 0',
  borderBottom: '2px solid #2563eb',
  paddingBottom: '0.5rem'
};

const articleParagraphStyle = {
  color: '#374151',
  fontSize: '1rem',
  marginBottom: '1rem',
  textAlign: 'left',
  lineHeight: '1.6'
};

const tipBoxStyle = {
  backgroundColor: '#dbeafe',
  padding: '1.5rem',
  borderRadius: '8px',
  margin: '1.5rem 0',
  borderLeft: '4px solid #2563eb',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const tipTitleStyle = {
  color: '#1e40af',
  fontWeight: '600',
  marginBottom: '0.5rem',
  fontSize: '1.1rem'
};

const articleListStyle = {
  color: '#374151',
  paddingLeft: '1.5rem',
  marginBottom: '1.5rem',
  lineHeight: '1.6'
};

const warningBoxStyle = {
  backgroundColor: '#fef3c7',
  padding: '1.5rem',
  borderRadius: '8px',
  margin: '1.5rem 0',
  borderLeft: '4px solid #d97706',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const warningTitleStyle = {
  color: '#92400e',
  fontWeight: '600',
  marginBottom: '0.5rem',
  fontSize: '1.1rem'
};

const articleConclusionStyle = {
  backgroundColor: '#f0f9ff',
  padding: '1.5rem',
  borderRadius: '8px',
  border: '2px solid #bae6fd',
  marginTop: '2rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const conclusionTitleStyle = {
  color: '#0369a1',
  fontWeight: '600',
  marginBottom: '1rem',
  fontSize: '1.2rem'
};

const stepByStepStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  margin: '1.5rem 0'
};

const stepItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
};

const stepNumberStyle = {
  backgroundColor: '#2563eb',
  color: 'white',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  flexShrink: 0
};

const stepContentStyle = {
  flex: 1
};

const stepTitleStyle = {
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '0.5rem',
  fontSize: '1.1rem'
};

const stepDescStyle = {
  color: '#64748b',
  lineHeight: '1.5'
};

const mistakesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1rem',
  margin: '1.5rem 0'
};

const mistakeItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  border: '1px solid #fee2e2',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
};

const mistakeIconStyle = {
  fontSize: '1.5rem',
  flexShrink: 0
};

const mistakeContentStyle = {
  flex: 1
};

const mistakeTitleStyle = {
  fontWeight: '600',
  color: '#dc2626',
  marginBottom: '0.5rem'
};

const mistakeDescStyle = {
  color: '#64748b',
  fontSize: '0.9rem',
  marginBottom: '0.5rem'
};

const solutionStyle = {
  color: '#16a34a',
  fontSize: '0.9rem',
  fontWeight: '500'
};

const resourcesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1rem',
  margin: '1.5rem 0'
};

const resourceItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
};

const resourceIconStyle = {
  fontSize: '1.5rem',
  flexShrink: 0
};

const resourceContentStyle = {
  flex: 1
};

const resourceTitleStyle = {
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '0.25rem'
};

const resourceDescStyle = {
  color: '#64748b',
  fontSize: '0.9rem',
  lineHeight: '1.4'
};
