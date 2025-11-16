// pages/contact.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(''), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - AI Prompt Maker</title>
        <meta name="description" content="Contact AI Prompt Maker support team. Get help with your account and features." />
      </Head>

      <div style={styles.container}>
        <div style={styles.contentWrapper}>
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            style={styles.backButton}
          >
            ← Back
          </button>

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Contact Us</h1>
            <p style={styles.subtitle}>
              Get in touch with our support team. We're here to help you with any questions or concerns.
            </p>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div style={styles.successMessage}>
              ✅ Thank you! Your message has been received. We will get back to you within 24 hours.
            </div>
          )}

          {submitStatus === 'error' && (
            <div style={styles.errorMessage}>
              ❌ There was an error sending your message. Please try again.
            </div>
          )}

          <div style={styles.grid}>
            {/* Contact Information */}
            <div style={styles.infoCard}>
              <h2 style={styles.infoTitle}>Get in Touch</h2>
              
              <div style={styles.infoList}>
                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>📧</span>
                  <div>
                    <h3 style={styles.infoLabel}>Email</h3>
                    <p style={styles.infoText}>aipromptmakerinfo@gmail.com</p>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>🕒</span>
                  <div>
                    <h3 style={styles.infoLabel}>Response Time</h3>
                    <p style={styles.infoText}>Within 24 hours</p>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>🌐</span>
                  <div>
                    <h3 style={styles.infoLabel}>Support Hours</h3>
                    <p style={styles.infoText}>24/7 Customer Support</p>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>📍</span>
                  <div>
                    <h3 style={styles.infoLabel}>Location</h3>
                    <p style={styles.infoText}>Remote Team - Global Support</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div style={styles.socialSection}>
                <h3 style={styles.socialTitle}>Follow Us</h3>
                <div style={styles.socialIcons}>
                  {['📘', '🐦', '📷', '💼'].map((icon, index) => (
                    <span key={index} style={styles.socialIcon}>
                      {icon}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={styles.formCard}>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label htmlFor="name" style={styles.label}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Enter your full name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.label}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Enter your email address"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="subject" style={styles.label}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="What is this regarding?"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="message" style={styles.label}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    style={styles.textarea}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={isSubmitting ? styles.submitButtonDisabled : styles.submitButton}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    padding: '20px 0',
  },
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#2563eb',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '30px',
    padding: '10px 0',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '15px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1.2rem',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  successMessage: {
    backgroundColor: '#dcfce7',
    border: '1px solid #22c55e',
    color: '#166534',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: '#fecaca',
    border: '1px solid #ef4444',
    color: '#dc2626',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  infoTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '24px',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  infoIcon: {
    fontSize: '1.4rem',
    marginTop: '2px',
    flexShrink: 0,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
    fontSize: '14px',
  },
  infoText: {
    color: '#6b7280',
    fontSize: '14px',
  },
  socialSection: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
  },
  socialTitle: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
    fontSize: '14px',
  },
  socialIcons: {
    display: 'flex',
    gap: '12px',
  },
  socialIcon: {
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    fontSize: '14px',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  textarea: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '120px',
    transition: 'all 0.2s',
  },
  submitButton: {
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '10px',
  },
  submitButtonDisabled: {
    padding: '16px 24px',
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '10px',
  },
};

// Media queries for responsiveness
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  if (mediaQuery.matches) {
    styles.grid.gridTemplateColumns = '1fr 1fr';
    styles.grid.gap = '48px';
  }
}
