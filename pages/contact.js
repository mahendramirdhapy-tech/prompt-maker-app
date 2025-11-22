// pages/contact.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
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
    setStatusMessage('');

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
        setStatusMessage(result.message || 'Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setSubmitStatus('');
          setStatusMessage('');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setStatusMessage(result.message || 'There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setStatusMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout 
      title="Contact Us - AI Prompt Maker" 
      description="Contact AI Prompt Maker support team. Get help with your account and features."
    >
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
              ✅ {statusMessage}
            </div>
          )}

          {submitStatus === 'error' && (
            <div style={styles.errorMessage}>
              ❌ {statusMessage}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={isSubmitting ? styles.submitButtonDisabled : styles.submitButton}
                >
                  {isSubmitting ? (
                    <span style={styles.buttonContent}>
                      <span style={styles.spinner}></span>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f8fafc;
        }
        * {
          box-sizing: border-box;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}

// Styles object - यह जरूरी है
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
    fontSize: '2.5rem',
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
    fontSize: '1.1rem',
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
    fontSize: '14px',
  },
  errorMessage: {
    backgroundColor: '#fecaca',
    border: '1px solid #ef4444',
    color: '#dc2626',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    marginBottom: '40px',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  infoTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '8px',
  },
  infoIcon: {
    fontSize: '1.2rem',
    marginTop: '2px',
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
    marginTop: '24px',
    paddingTop: '20px',
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
    fontSize: '1.3rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
    fontSize: '14px',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.2s',
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s',
  },
  submitButtonDisabled: {
    padding: '12px 20px',
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '8px',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Responsive design के लिए useEffect हटा दें क्योंकि यह build time error दे रहा है
// इसकी जगह CSS media queries use करें
