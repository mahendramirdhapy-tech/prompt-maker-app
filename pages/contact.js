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

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      minHeight: '100vh',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#3b82f6',
      marginBottom: '10px',
    },
    subtitle: {
      color: darkMode ? '#94a3b8' : '#64748b',
      fontSize: '1.1rem',
    },
    backButton: {
      padding: '10px 20px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '30px',
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      marginBottom: '40px',
    },
    contactInfo: {
      padding: '30px',
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
      borderRadius: '12px',
    },
    infoTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '20px',
      color: darkMode ? '#f8fafc' : '#1e293b',
    },
    infoItem: {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
    },
    infoIcon: {
      fontSize: '1.2rem',
      marginTop: '2px',
    },
    infoText: {
      lineHeight: '1.5',
    },
    infoLabel: {
      fontWeight: '600',
      marginBottom: '5px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    input: {
      padding: '12px',
      border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
    },
    textarea: {
      padding: '12px',
      border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    submitButton: {
      padding: '15px 30px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '600',
    },
    disabledButton: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - AI Prompt Maker</title>
        <meta name="description" content="Contact AI Prompt Maker support team. Get help with your account and features." />
      </Head>

      <div style={styles.container}>
        <button 
          onClick={() => router.back()} 
          style={styles.backButton}
        >
          ← Back
        </button>

        <header style={styles.header}>
          <h1 style={styles.title}>Contact Us</h1>
          <p style={styles.subtitle}>Get in touch with our support team</p>
        </header>

        <div style={styles.content}>
          <div style={styles.contactInfo}>
            <h2 style={styles.infoTitle}>Get in Touch</h2>
            
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>📧</span>
              <div style={styles.infoText}>
                <div style={styles.infoLabel}>Email</div>
                <div>support@aipromptmaker.online</div>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>🕒</span>
              <div style={styles.infoText}>
                <div style={styles.infoLabel}>Response Time</div>
                <div>Within 24 hours</div>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>🌐</span>
              <div style={styles.infoText}>
                <div style={styles.infoLabel}>Support Hours</div>
                <
