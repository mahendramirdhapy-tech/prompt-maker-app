// pages/terms.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function TermsOfService() {
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
        <title>Terms of Service - AI Prompt Maker</title>
        <meta name="description" content="Terms of Service for AI Prompt Maker. Learn about our rules and guidelines." />
      </Head>

      <div style={styles.container}>
        <button 
          onClick={() => router.back()} 
          style={styles.backButton}
        >
          ← Back
        </button>

        <header style={styles.header}>
          <h1 style={styles.title}>Terms of Service</h1>
          <p style={styles.lastUpdated}>Last Updated: January 15, 2024</p>
        </header>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <p style={styles.paragraph}>
            By accessing and using AI Prompt Maker, you accept and agree to be bound by these Terms of Service. If you disagree with any part, you may not access our service.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Description of Service</h2>
          <p style={styles.paragraph}>
            AI Prompt Maker provides an online platform for generating AI prompts using various AI models. We offer both free and premium features.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. User Accounts</h2>
          <p style={styles.paragraph}>When you create an account with us, you must:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Provide accurate and complete information</li>
            <li style={styles.listItem}>Maintain the security of your password</li>
            <li style={styles.listItem}>Accept responsibility for all activities under your account</li>
            <li style={styles.listItem}>Be at least 13 years of age</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Acceptable Use</h2>
          <p style={styles.paragraph}>You agree not to use our service for:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Illegal activities or promoting illegal content</li>
            <li style={styles.listItem}>Generating harmful, abusive, or offensive content</li>
            <li style={styles.listItem}>Spamming or automated bulk requests</li>
            <li style={styles.listItem}>Attempting to disrupt or overload our services</li>
            <li style={styles.listItem}>Violating intellectual property rights</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Intellectual Property</h2>
          <p style={styles.paragraph}>
            The prompts you generate belong to you. However, you grant us a license to use generated content to improve our services. Our platform and technology remain our intellectual property.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Service Limitations</h2>
          <p style={styles.paragraph}>
            Free users are limited to 5 prompts per session. We reserve the right to modify or discontinue services at any time. We don't guarantee uninterrupted or error-free service.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Termination</h2>
          <p style={styles.paragraph}>
            We may terminate or suspend your account for violations of these terms. You may delete your account at any time through your account settings.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Limitation of Liability</h2>
          <p style={styles.paragraph}>
            AI Prompt Maker is provided "as is" without warranties. We are not liable for any damages resulting from your use of our service.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Changes to Terms</h2>
          <p style={styles.paragraph}>
            We may update these terms periodically. Continued use of our service after changes constitutes acceptance of the new terms.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Contact Information</h2>
          <p style={styles.paragraph}>
            For questions about these Terms of Service, contact us at:
            <br />
            <strong>Email:</strong> legal@aipromptmaker.online
          </p>
        </div>
      </div>
    </>
  );
}
