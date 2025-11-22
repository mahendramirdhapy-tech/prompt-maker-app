// pages/privacy.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function PrivacyPolicy() {
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
        <title>Privacy Policy - AI Prompt Maker</title>
        <meta name="description" content="Privacy Policy for AI Prompt Maker. Learn how we collect, use, and protect your data." />
        <meta name="keywords" content="privacy policy, data protection, AI tools privacy" />
      </Head>

      <div style={styles.container}>
        <button 
          onClick={() => router.back()} 
          style={styles.backButton}
        >
          ← Back
        </button>

        <header style={styles.header}>
          <h1 style={styles.title}>Privacy Policy</h1>
          <p style={styles.lastUpdated}>Last Updated: January 15, 2024</p>
        </header>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
          <p style={styles.paragraph}>
            At AI Prompt Maker, we are committed to protecting your privacy. We collect minimal information necessary to provide our services:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Account Information:</strong> When you create an account, we collect your email address and basic profile information.
            </li>
            <li style={styles.listItem}>
              <strong>Prompt Data:</strong> The prompts you generate and input text are stored to provide history functionality.
            </li>
            <li style={styles.listItem}>
              <strong>Usage Data:</strong> We collect information about how you use our platform to improve our services.
            </li>
            <li style={styles.listItem}>
              <strong>Technical Information:</strong> IP address, browser type, and device information for security and analytics.
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
          <p style={styles.paragraph}>We use the collected information for:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Providing and maintaining our AI prompt generation services</li>
            <li style={styles.listItem}>Improving and personalizing your experience</li>
            <li style={styles.listItem}>Understanding how users interact with our platform</li>
            <li style={styles.listItem}>Ensuring platform security and preventing abuse</li>
            <li style={styles.listItem}>Communicating important updates and changes</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Data Sharing and Disclosure</h2>
          <p style={styles.paragraph}>
            We do not sell your personal data to third parties. We may share information only in the following circumstances:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Service Providers:</strong> With trusted third-party vendors who help us operate our platform
            </li>
            <li style={styles.listItem}>
              <strong>Legal Requirements:</strong> When required by law or to protect our rights
            </li>
            <li style={styles.listItem}>
              <strong>Business Transfers:</strong> In connection with a merger or acquisition
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Data Security</h2>
          <p style={styles.paragraph}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Your Rights</h2>
          <p style={styles.paragraph}>You have the right to:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Access and download your personal data</li>
            <li style={styles.listItem}>Correct inaccurate information</li>
            <li style={styles.listItem}>Delete your account and associated data</li>
            <li style={styles.listItem}>Opt-out of marketing communications</li>
            <li style={styles.listItem}>Export your prompt history</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Contact Us</h2>
          <p style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <strong>Email:</strong> aipromptmakerinfo@gmail.com
          </p>
        </div>
      </div>
    </>
  );
}
