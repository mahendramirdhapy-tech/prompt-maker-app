// pages/contact.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout'; // सिर्फ Layout import करें

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

// ... styles object वही रहेगा (निचे का सारा code वही रखें)
