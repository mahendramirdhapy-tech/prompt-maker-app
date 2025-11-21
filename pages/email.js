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
        <title>AI Email Generator | Professional Email Writing Tool</title>
        <meta 
          name="description" 
          content="Generate professional emails instantly. Free AI-powered email writer for business, marketing, sales, and personal communication." 
        />
        <meta 
          name="keywords" 
          content="email generator, ai email writer, professional email template, business email, marketing email, sales email, email writing tool" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="AI Prompt Maker" />
      </Head>

      <div style={{ 
        maxWidth: '900px', 
        margin: '2rem auto', 
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
