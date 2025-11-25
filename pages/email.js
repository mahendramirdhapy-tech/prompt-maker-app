// pages/email.js
import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function EmailGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailType, setEmailType] = useState('professional');
  const [tone, setTone] = useState('formal');

  const emailTypes = {
    professional: 'Professional Business',
    marketing: 'Marketing Campaign',
    followup: 'Follow-up',
    invitation: 'Invitation',
    apology: 'Apology',
    thankyou: 'Thank You',
    sales: 'Sales Pitch',
    newsletter: 'Newsletter'
  };

  const tones = {
    formal: 'Formal',
    friendly: 'Friendly',
    persuasive: 'Persuasive',
    urgent: 'Urgent',
    casual: 'Casual'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter email details or topic');
      return;
    }
    
    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: `Write a ${tones[tone].toLowerCase()} ${emailTypes[emailType].toLowerCase()} email about: "${input}". 
          Include:
          - Clear subject line
          - Professional greeting
          - Well-structured body
          - Appropriate closing
          - Professional signature
          
          Make it engaging and effective for its purpose.`,
          language: 'English',
          tone: tones[tone],
          maxTokens: 600,
          type: 'prompt'
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setOutput(data.prompt || data.result || 'Email not generated');
      } else {
        alert('❌ ' + (data.error || 'Failed to generate email'));
      }
    } catch (e) {
      console.error('Email generation error:', e);
      alert('⚠️ ' + (e.message || 'Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => {
    setInput('');
    setOutput('');
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('✅ Email copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const insertExample = () => {
    const examples = {
      professional: "Requesting a meeting to discuss the Q3 project deliverables and timeline",
      marketing: "Announcing our new product launch with special early bird discounts",
      followup: "Following up on my previous email about the partnership proposal",
      invitation: "Inviting team members to the annual company retreat next month",
      apology: "Apologizing for the recent service disruption and explaining the resolution",
      thankyou: "Thanking a client for their continued business and partnership",
      sales: "Introducing our premium software solution to potential enterprise clients",
      newsletter: "Monthly update featuring company news, product updates, and industry insights"
    };
    setInput(examples[emailType]);
  };

  return (
    <Layout>
      <Head>
        <title>AI Email Generator | Professional Email Writing Tool & Guide</title>
        <meta 
          name="description" 
          content="Generate professional emails instantly. Free AI-powered email writer for business, marketing, sales. Learn email writing best practices with comprehensive guides." 
        />
        <meta 
          name="keywords" 
          content="email generator, ai email writer, professional email template, business email, marketing email, sales email, email writing tool, email best practices" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="AI Prompt Maker" />
        <meta property="og:title" content="AI Email Generator & Professional Writing Guide" />
        <meta property="og:description" content="Create perfect emails for any situation with our AI tool and learn professional email writing techniques." />
      </Head>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '0 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>

        {/* Main Tool Section */}
        <div style={{ 
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '2rem',
          marginBottom: '3rem'
        }}>

          <h1 style={{ 
            textAlign: 'center', 
            color: '#1e293b',
            marginBottom: '0.5rem',
            fontSize: '2.25rem',
            fontWeight: '700'
          }}>
            ✉️ AI Email Generator
          </h1>
          
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '1.125rem',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Create professional, engaging emails for any purpose in seconds
          </p>

          {/* Email Type and Tone Selection */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem', 
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Type:
              </label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {Object.entries(emailTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Tone:
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {Object.entries(tones).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Describe your ${emailTypes[emailType].toLowerCase()} email...`}
                rows="5"
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  fontSize: '16px', 
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}
                required
                aria-label="Email content description"
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px'
              }}>
                <button
                  type="button"
                  onClick={insertExample}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151'
                  }}
                >
                  Load Example
                </button>
                
                {input && (
                  <button
                    type="button"
                    onClick={clearInput}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#dc2626'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
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
              aria-label={loading ? 'Generating email...' : 'Generate email'}
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
                  Generating Email...
                </>
              ) : (
                <>✨ Generate Email</>
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
                  Your Generated Email:
                </h3>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={copyEmail}
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
                      gap: '6px'
                    }}
                    aria-label="Copy email to clipboard"
                  >
                    📋 Copy Email
                  </button>
                </div>
              </div>
              
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                backgroundColor: '#f8fafc', 
                padding: '20px', 
                borderRadius: '6px',
                fontSize: '15px',
                lineHeight: '1.6',
                borderLeft: '4px solid #2563eb',
                fontFamily: 'system-ui, sans-serif'
              }}>
                {output}
              </div>
            </div>
          )}

          {/* Email Types Guide */}
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
              📧 Perfect For Every Situation
            </h2>
            <div style={{ 
              display: 'grid', 
              gap: '1rem', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
            }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                borderLeft: '4px solid #0ea5e9'
              }}>
                <strong>Business & Professional</strong>
                <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                  Client communication, meetings, proposals
                </p>
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                borderLeft: '4px solid #22c55e'
              }}>
                <strong>Marketing & Sales</strong>
                <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                  Campaigns, promotions, product launches
                </p>
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: '#fef7ed',
                borderRadius: '8px',
                borderLeft: '4px solid #f59e0b'
              }}>
                <strong>Follow-ups & Reminders</strong>
                <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                  Gentle reminders, meeting follow-ups
                </p>
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                borderLeft: '4px solid #ef4444'
              }}>
                <strong>Customer Service</strong>
                <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                  Apologies, support responses, updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '3rem 2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: '#1e293b',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            📚 The Complete Guide to Professional Email Writing
          </h2>

          {/* Introduction */}
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.7', color: '#475569', marginBottom: '1.5rem' }}>
              In today's digital business world, email remains the cornerstone of professional communication. 
              Whether you're sending a quick follow-up or crafting a complex proposal, your email writing skills 
              directly impact your professional reputation and success.
            </p>
          </div>

          {/* Email Structure Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              🏗️ The Anatomy of a Perfect Professional Email
            </h3>
            
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '1.5rem',
              borderRadius: '8px',
              borderLeft: '4px solid #0ea5e9',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#0369a1', marginTop: '0', marginBottom: '1rem' }}>💡 Professional Email Structure</h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#1e293b' }}>1. Subject Line</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#475569' }}>
                    The first thing recipients see. Make it clear, concise, and actionable. 
                    Include keywords that help with searchability and urgency.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#1e293b' }}>2. Professional Greeting</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#475569' }}>
                    Use appropriate salutations based on your relationship with the recipient. 
                    "Dear [Name]" for formal communication, "Hi [Name]" for familiar contacts.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#1e293b' }}>3. Clear Opening</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#475569' }}>
                    State your purpose immediately. Busy professionals appreciate emails that get to the point quickly.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#1e293b' }}>4. Structured Body</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#475569' }}>
                    Use short paragraphs, bullet points, and clear section breaks. Make it easy to scan and understand.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#1e293b' }}>5. Professional Closing</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#475569' }}>
                    End with a clear call to action and appropriate closing phrase. "Best regards," "Sincerely," or "Thank you."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Types Deep Dive */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              📊 Mastering Different Email Types
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{ color: '#166534', marginTop: '0' }}>💼 Professional Business Emails</h4>
                <p style={{ color: '#475569', marginBottom: '1rem' }}>
                  Used for client communication, project updates, and official correspondence.
                </p>
                <div style={{
                  backgroundColor: '#dcfce7',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  <strong>✅ Best Practices:</strong>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
                    <li>Clear subject lines with project names</li>
                    <li>Formal but approachable tone</li>
                    <li>Specific action items and deadlines</li>
                    <li>Professional signature with contact info</li>
                  </ul>
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: '#fef7ed',
                borderRadius: '8px',
                border: '1px solid #fed7aa'
              }}>
                <h4 style={{ color: '#9a3412', marginTop: '0' }}>🎯 Marketing Emails</h4>
                <p style={{ color: '#475569', marginBottom: '1rem' }}>
                  Designed to engage, convert, and build customer relationships.
                </p>
                <div style={{
                  backgroundColor: '#ffedd5',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  <strong>✅ Best Practices:</strong>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
                    <li>Compelling, benefit-driven subject lines</li>
                    <li>Visual hierarchy with clear CTAs</li>
                    <li>Personalization and segmentation</li>
                    <li>Mobile-responsive design</li>
                  </ul>
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <h4 style={{ color: '#991b1b', marginTop: '0' }}>🤝 Follow-up Emails</h4>
                <p style={{ color: '#475569', marginBottom: '1rem' }}>
                  Essential for maintaining relationships and ensuring action items are completed.
                </p>
                <div style={{
                  backgroundColor: '#fee2e2',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  <strong>✅ Best Practices:</strong>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
                    <li>Reference previous communication</li>
                    <li>Be polite but persistent</li>
                    <li>Make it easy to respond</li>
                    <li>Include original context if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Tone and Style Guide */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              🎭 Mastering Email Tone and Style
            </h3>

            <div style={{
              backgroundColor: '#fafafa',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #e5e5e5'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#1e293b' }}>Tone</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#1e293b' }}>When to Use</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#1e293b' }}>Key Phrases</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}><strong>Formal</strong></td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Executive communication, clients, first contact</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>"I am writing to inquire...", "Respectfully,"</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}><strong>Friendly</strong></td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Colleagues, regular contacts, team communication</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>"Hope you're doing well!", "Looking forward to connecting"</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}><strong>Persuasive</strong></td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Sales, proposals, partnership requests</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>"You'll benefit from...", "I strongly recommend..."</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}><strong>Urgent</strong></td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Time-sensitive matters, critical updates</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>"Action required:", "Time-sensitive matter"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Step-by-Step Writing Process */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              🚀 5-Step Professional Email Writing Process
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontWeight: 'bold'
                }}>1</div>
                <h4 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>Define Purpose</h4>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '0' }}>
                  Clearly identify what you want to achieve with this email
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontWeight: 'bold'
                }}>2</div>
                <h4 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>Plan Structure</h4>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '0' }}>
                  Outline key points and organize them logically
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontWeight: 'bold'
                }}>3</div>
                <h4 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>Write Draft</h4>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '0' }}>
                  Compose your email without overthinking perfection
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontWeight: 'bold'
                }}>4</div>
                <h4 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>Review & Edit</h4>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '0' }}>
                  Check for clarity, tone, grammar, and professionalism
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontWeight: 'bold'
                }}>5</div>
                <h4 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>Send & Follow-up</h4>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '0' }}>
                  Send at optimal times and track responses
                </p>
              </div>
            </div>
          </div>

          {/* Common Mistakes Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              ⚠️ Common Email Mistakes to Avoid
            </h3>

            <div style={{
              backgroundColor: '#fef3c7',
              padding: '1.5rem',
              borderRadius: '8px',
              borderLeft: '4px solid #d97706'
            }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#92400e' }}>❌ Vague Subject Lines</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#92400e' }}>
                    "Meeting" or "Update" don't provide context. Be specific: "Q3 Project Review Meeting - Oct 15"
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#92400e' }}>❌ Overly Long Emails</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#92400e' }}>
                    Respect your reader's time. If it's longer than 5 paragraphs, consider a meeting instead.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#92400e' }}>❌ Poor Mobile Optimization</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#92400e' }}>
                    Over 50% of emails are read on mobile. Use short paragraphs and clear formatting.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#92400e' }}>❌ Ignoring Tone Consistency</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#92400e' }}>
                    Mixing formal and casual language confuses readers. Maintain consistent tone throughout.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Tips */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              🎯 Advanced Professional Email Strategies
            </h3>

            <div style={{
              backgroundColor: '#ecfdf5',
              padding: '1.5rem',
              borderRadius: '8px',
              borderLeft: '4px solid '#10b981'
            }}>
              <h4 style={{ color: '#047857', marginTop: '0', marginBottom: '1rem' }}>✅ Pro-Level Email Techniques</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#1e293b' }}>Strategic Timing</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#475569', fontSize: '14px' }}>
                    Send important emails Tuesday-Thursday 9 AM-12 PM for highest open rates. Avoid Monday mornings and Friday afternoons.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#1e293b' }}>Personalization</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#475569', fontSize: '14px' }}>
                    Use recipient's name, reference previous conversations, and tailor content to their specific needs and interests.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#1e293b' }}>Call-to-Action Optimization</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#475569', fontSize: '14px' }}>
                    Make CTAs clear, specific, and easy to complete. Use action-oriented language and provide all necessary information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#1e293b', marginTop: '0', marginBottom: '1rem' }}>
              🚀 Start Writing Better Emails Today
            </h3>
            <p style={{ color: '#475569', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
              Whether you use our AI email generator or apply these professional writing techniques, 
              you're now equipped to create emails that get results. Remember: great email communication 
              is a skill that develops with practice and attention to detail.
            </p>
            <p style={{ color: '#64748b', fontStyle: 'italic', margin: '0' }}>
              Professional email writing combines art and science—master both to advance your career and business relationships.
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
            
            .grid-container {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}
