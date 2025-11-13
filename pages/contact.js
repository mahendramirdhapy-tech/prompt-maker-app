// pages/contact.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ContactUs() {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Contact Us - AI Prompt Maker</title>
        <meta name="description" content="Contact AI Prompt Maker support team. Get help with your account and features." />
      </Head>

      <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
        <button 
          onClick={() => router.back()} 
          className="back-button"
        >
          ← Back
        </button>

        <header className="header">
          <h1 className="title">Contact Us</h1>
          <p className="subtitle">Get in touch with our support team</p>
        </header>

        <div className="content">
          <div className="contact-info">
            <h2 className="info-title">Get in Touch</h2>
            
            <div className="info-item">
              <span className="info-icon">📧</span>
              <div className="info-text">
                <div className="info-label">Email</div>
                <div>support@aipromptmaker.online</div>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🕒</span>
              <div className="info-text">
                <div className="info-label">Response Time</div>
                <div>Within 24 hours</div>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🌐</span>
              <div className="info-text">
                <div className="info-label">Support Hours</div>
                <div>24/7 Customer Support</div>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📍</span>
              <div className="info-text">
                <div className="info-label">Location</div>
                <div>Remote Team - Global Support</div>
              </div>
            </div>

            <div className="social-links">
              <h3 className="social-title">Follow Us</h3>
              <div className="social-icons">
                <span className="social-icon">📘</span>
                <span className="social-icon">🐦</span>
                <span className="social-icon">📷</span>
                <span className="social-icon">💼</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="What is this regarding?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="form-textarea"
                placeholder="Tell us how we can help you..."
                rows="6"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? 'disabled' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="theme-toggle">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="theme-button"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #ffffff;
          color: #1e293b;
          min-height: 100vh;
          transition: all 0.3s ease;
        }

        .container.dark-mode {
          background-color: #0f172a;
          color: #f8fafc;
        }

        .back-button {
          padding: 12px 24px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          margin-bottom: 30px;
          transition: background-color 0.3s ease;
        }

        .back-button:hover {
          background-color: #2563eb;
        }

        .dark-mode .back-button {
          background-color: #1e40af;
        }

        .header {
          text-align: center;
          margin-bottom: 50px;
        }

        .title {
          font-size: 3rem;
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: #64748b;
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .dark-mode .subtitle {
          color: #94a3b8;
        }

        .content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        @media (min-width: 768px) {
          .content {
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
        }

        .contact-info {
          padding: 40px 30px;
          background-color: #f8fafc;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .dark-mode .contact-info {
          background-color: #1e293b;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .info-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 30px;
          color: #1e293b;
        }

        .dark-mode .info-title {
          color: #f8fafc;
        }

        .info-item {
          margin-bottom: 25px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 15px;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }

        .info-item:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }

        .dark-mode .info-item:hover {
          background-color: rgba(59, 130, 246, 0.1);
        }

        .info-icon {
          font-size: 1.4rem;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .info-text {
          line-height: 1.6;
        }

        .info-label {
          font-weight: 600;
          margin-bottom: 5px;
          color: #374151;
        }

        .dark-mode .info-label {
          color: #e2e8f0;
        }

        .social-links {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #e2e8f0;
        }

        .dark-mode .social-links {
          border-top-color: #334155;
        }

        .social-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #374151;
        }

        .dark-mode .social-title {
          color: #e2e8f0;
        }

        .social-icons {
          display: flex;
          gap: 15px;
        }

        .social-icon {
          font-size: 1.5rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .social-icon:hover {
          transform: scale(1.2);
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #374151;
          font-size: 1rem;
        }

        .dark-mode .form-label {
          color: #e2e8f0;
        }

        .form-input,
        .form-textarea {
          padding: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          background-color: #ffffff;
          color: #1e293b;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .dark-mode .form-input,
        .dark-mode .form-textarea {
          background-color: #1e293b;
          color: #f8fafc;
          border-color: #334155;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          min-height: 150px;
          resize: vertical;
        }

        .submit-button {
          padding: 18px 30px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .submit-button:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .submit-button.disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .theme-toggle {
          text-align: center;
          margin-top: 40px;
        }

        .theme-button {
          padding: 12px 24px;
          background-color: #e2e8f0;
          color: #1e293b;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .dark-mode .theme-button {
          background-color: #334155;
          color: #f8fafc;
        }

        .theme-button:hover {
          background-color: #cbd5e1;
        }

        .dark-mode .theme-button:hover {
          background-color: #475569;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #f1f5f9;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .dark-mode body {
          background-color: #0f172a;
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
