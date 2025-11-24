// pages/feedback.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Layout from '../components/Layout';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: true, // boolean - true = like, false = dislike
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({
      ...prev,
      rating: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // user_feedback table mein insert karenge
      const { data, error } = await supabase
        .from('user_feedback') // Table name changed to user_feedback
        .insert([
          {
            name: formData.name,
            email: formData.email,
            rating: formData.rating, // boolean value
            category: formData.category,
            comment: formData.message, // 'comment' column mein save hoga
            status: 'new',
            created_at: new Date().toISOString()
            // ip_address remove kiya, agar chahiye toh wapas add kar sakte hain
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        rating: true,
        category: 'general',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Feedback - AI Prompt Maker</title>
        <meta name="description" content="Share your feedback with AI Prompt Maker. Help us improve our service." />
      </Head>

      <div className="feedback-container">
        <button 
          onClick={() => router.back()} 
          className="back-button"
        >
          ← Back
        </button>

        <header className="feedback-header">
          <h1 className="feedback-title">Share Your Feedback</h1>
          <p className="feedback-subtitle">
            We value your opinion! Help us improve by sharing your experience.
          </p>
        </header>

        <div className="feedback-content">
          <div className="feedback-info">
            <h2 className="info-title">Why Your Feedback Matters</h2>
            
            <div className="info-item">
              <span className="info-icon">💡</span>
              <div className="info-text">
                <h3>Improve Our Service</h3>
                <p>Your suggestions help us enhance features and fix issues</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🚀</span>
              <div className="info-text">
                <h3>Drive Innovation</h3>
                <p>Great ideas often come from our users' feedback</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">❤️</span>
              <div className="info-text">
                <h3>Better Experience</h3>
                <p>We use feedback to create a more user-friendly platform</p>
              </div>
            </div>

            <div className="response-time">
              <span className="response-icon">⏱️</span>
              <div className="response-text">
                <strong>Response Time:</strong> We review all feedback weekly
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                How was your experience? *
              </label>
              <div className="rating-buttons">
                <button
                  type="button"
                  className={`rating-btn like-btn ${formData.rating ? 'active' : ''}`}
                  onClick={() => handleRatingChange(true)}
                  disabled={isSubmitting}
                >
                  <span className="rating-emoji">👍</span>
                  <span className="rating-text">Satisfied</span>
                </button>
                <button
                  type="button"
                  className={`rating-btn dislike-btn ${!formData.rating ? 'active' : ''}`}
                  onClick={() => handleRatingChange(false)}
                  disabled={isSubmitting}
                >
                  <span className="rating-emoji">👎</span>
                  <span className="rating-text">Needs Improvement</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Feedback Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="uiux">UI/UX Improvement</option>
                <option value="performance">Performance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Your Feedback *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="form-textarea"
                placeholder="Please share your detailed feedback, suggestions, or issues..."
                rows="6"
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting Feedback...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="status-message success">
                <span className="status-icon">✅</span>
                <div>
                  <h3>Thank You!</h3>
                  <p>Your feedback has been submitted successfully. We appreciate your input!</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="status-message error">
                <span className="status-icon">❌</span>
                <div>
                  <h3>Something Went Wrong</h3>
                  <p>Please try again later or contact support if the problem persists.</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx>{`
        .feedback-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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

        .feedback-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .feedback-title {
          font-size: 3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .feedback-subtitle {
          color: #64748b;
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .feedback-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }

        @media (min-width: 768px) {
          .feedback-content {
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
        }

        .feedback-info {
          padding: 40px 30px;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .info-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 30px;
          color: #1e293b;
        }

        .info-item {
          margin-bottom: 25px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .info-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .info-text h3 {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-size: 1.1rem;
        }

        .info-text p {
          margin: 0;
          color: #64748b;
          line-height: 1.5;
        }

        .response-time {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: #dbeafe;
          border-radius: 8px;
          margin-top: 30px;
        }

        .response-icon {
          font-size: 1.2rem;
        }

        .response-text {
          color: #1e40af;
          font-size: 0.9rem;
        }

        .feedback-form {
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

        .form-input,
        .form-select,
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

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input:disabled,
        .form-select:disabled,
        .form-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-textarea {
          min-height: 150px;
          resize: vertical;
        }

        .rating-buttons {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .rating-btn {
          flex: 1;
          padding: 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .rating-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .rating-btn.active {
          border-color: #3b82f6;
          background: #dbeafe;
        }

        .like-btn.active {
          border-color: #10b981;
          background: #d1fae5;
        }

        .dislike-btn.active {
          border-color: #ef4444;
          background: #fee2e2;
        }

        .rating-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .rating-emoji {
          font-size: 2rem;
        }

        .rating-text {
          font-weight: 600;
          color: #374151;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .submit-button:hover:not(.submitting) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .submit-button.submitting {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .status-message {
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-top: 20px;
        }

        .status-message.success {
          background-color: #dcfce7;
          border: 1px solid #22c55e;
        }

        .status-message.error {
          background-color: #fee2e2;
          border: 1px solid #ef4444;
        }

        .status-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .status-message h3 {
          margin: 0 0 5px 0;
          color: #1e293b;
        }

        .status-message p {
          margin: 0;
          color: #64748b;
          line-height: 1.5;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
