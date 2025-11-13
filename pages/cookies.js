// pages/cookies.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function CookiePolicy() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

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
      paddingBottom: '20px',
      borderBottom: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#3b82f6',
      marginBottom: '10px',
    },
    lastUpdated: {
      color: darkMode ? '#94a3b8' : '#64748b',
      fontSize: '0.9rem',
    },
    section: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: darkMode ? '#f8fafc' : '#1e293b',
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    },
    paragraph: {
      lineHeight: '1.6',
      marginBottom: '15px',
      fontSize: '1rem',
    },
    list: {
      paddingLeft: '20px',
      marginBottom: '15px',
    },
    listItem: {
      marginBottom: '8px',
      lineHeight: '1.5',
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
    }
  };

  return (
    <>
      <Head>
        <title>Cookie Policy - AI Prompt Maker</title>
        <meta name="description" content="Cookie Policy for AI Prompt Maker. Learn about how we use cookies." />
      </Head>

      <div style={styles.container}>
        <button 
          onClick={() => router.back()} 
          style={styles.backButton}
        >
          ← Back
        </button>

        <header style={styles.header}>
          <h1 style={styles.title}>Cookie Policy</h1>
          <p style={styles.lastUpdated}>Last Updated: January 15, 2024</p>
        </header>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. What Are Cookies?</h2>
          <p style={styles.paragraph}>
            Cookies are small text files that are stored on your device when you visit websites. They help websites remember your preferences and improve your browsing experience.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. How We Use Cookies</h2>
          <p style={styles.paragraph}>We use cookies for the following purposes:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Essential Cookies:</strong> Required for basic website functionality
            </li>
            <li style={styles.listItem}>
              <strong>Preference Cookies:</strong> Remember your settings and preferences
            </li>
            <li style={styles.listItem}>
              <strong>Analytics Cookies:</strong> Help us understand how visitors use our platform
            </li>
            <li style={styles.listItem}>
              <strong>Security Cookies:</strong> Protect against malicious activities
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Types of Cookies We Use</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser
            </li>
            <li style={styles.listItem}>
              <strong>Persistent Cookies:</strong> Remain on your device for a set period
            </li>
            <li style={styles.listItem}>
              <strong>First-party Cookies:</strong> Set by our website directly
            </li>
            <li style={styles.listItem}>
              <strong>Third-party Cookies:</strong> Set by our service providers (e.g., analytics)
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Cookie Management</h2>
          <p style={styles.paragraph}>
            You can control and manage cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>View and delete existing cookies</li>
            <li style={styles.listItem}>Block all or specific cookies</li>
            <li style={styles.listItem}>Set preferences for different websites</li>
            <li style={styles.listItem}>Receive notifications when cookies are set</li>
          </ul>
          <p style={styles.paragraph}>
            Note: Disabling essential cookies may affect website functionality.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Third-Party Cookies</h2>
          <p style={styles.paragraph}>
            We may use third-party services that set their own cookies:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Analytics Services:</strong> Google Analytics to understand user behavior
            </li>
            <li style={styles.listItem}>
              <strong>Authentication:</strong> Cookies for login and session management
            </li>
            <li style={styles.listItem}>
              <strong>Performance:</strong> Cookies to monitor website performance
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Updates to Cookie Policy</h2>
          <p style={styles.paragraph}>
            We may update this Cookie Policy as our services evolve. We will notify users of significant changes through our platform or via email.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Contact Us</h2>
          <p style={styles.paragraph}>
            For questions about our Cookie Policy, contact us at:
            <br />
            <strong>Email:</strong> privacy@aipromptmaker.online
          </p>
        </div>
      </div>
    </>
  );
}
