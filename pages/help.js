// pages/help.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function HelpCenter() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const router = useRouter();

  const faqCategories = {
    'getting-started': [
      {
        question: "How do I create my first AI prompt?",
        answer: "Simply type your idea in the input box, select your preferred tone and template, then click 'Generate AI Prompt'. The system will create a optimized prompt for you."
      },
      {
        question: "Do I need to create an account?",
        answer: "No, you can generate up to 5 prompts without an account. For unlimited access and additional features, we recommend creating a free account."
      },
      {
        question: "What AI models do you support?",
        answer: "We support multiple AI models including Google Gemini Pro, Claude Instant, Meta Llama 3, and Mistral 7B. The system automatically selects the best available model."
      }
    ],
    'account': [
      {
        question: "How do I reset my password?",
        answer: "Click on 'Login' then 'Forgot Password'. Enter your email address and we'll send you password reset instructions."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, you can delete your account from the account settings page. This will permanently remove all your data from our systems."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we use industry-standard security measures to protect your data. All prompts are encrypted and we never share your personal information with third parties."
      }
    ],
    'features': [
      {
        question: "What are prompt templates?",
        answer: "Templates are pre-built prompt structures for common use cases like blog writing, social media posts, code debugging, etc. They help you get better results faster."
      },
      {
        question: "Can I save my generated prompts?",
        answer: "Yes, all your generated prompts are automatically saved in your history. You can access them anytime through the History button."
      },
      {
        question: "How do I export my prompts?",
        answer: "Click the download button (💾) next to any generated prompt to export it as a text file."
      }
    ],
    'troubleshooting': [
      {
        question: "Why is my prompt not generating?",
        answer: "This could be due to high server load, internet connectivity issues, or reaching your usage limit. Try refreshing the page or checking your internet connection."
      },
      {
        question: "The generated prompt doesn't match my requirements",
        answer: "Try being more specific in your input, adjust the tone settings, or use a different template. You can also use the regenerate button to get a new version."
      },
      {
        question: "I'm experiencing slow performance",
        answer: "This is usually temporary due to high demand. Try refreshing the page or using the platform during off-peak hours."
      }
    ]
  };

  const styles = {
    container: {
      maxWidth: '1000px',
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
    categories: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      flexWrap: 'wrap',
    },
    categoryButton: {
      padding: '12px 20px',
      backgroundColor: darkMode ? '#334155' : '#e2e8f0',
      color: darkMode ? '#f8fafc' : '#1e293b',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    activeCategory: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    faqList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    faqItem: {
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
    },
    question: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '10px',
      color: darkMode ? '#f8fafc' : '#1e293b',
    },
    answer: {
      lineHeight: '1.6',
      color: darkMode ? '#cbd5e1' : '#64748b',
    },
    contactSection: {
      marginTop: '50px',
      padding: '30px',
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
      borderRadius: '12px',
      textAlign: 'center',
    },
    contactTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '15px',
    }
  };

  return (
    <>
      <Head>
        <title>Help Center - AI Prompt Maker</title>
        <meta name="description" content="Get help with AI Prompt Maker. FAQs, troubleshooting, and support resources." />
      </Head>

      <div style={styles.container}>
        <button 
          onClick={() => router.back()} 
          style={styles.backButton}
        >
          ← Back
        </button>

        <header style={styles.header}>
          <h1 style={styles.title}>Help Center</h1>
          <p style={styles.subtitle}>Find answers to common questions and get support</p>
        </header>

        <div style={styles.categories}>
          <button 
            style={{
              ...styles.categoryButton,
              ...(activeCategory === 'getting-started' ? styles.activeCategory : {})
            }}
            onClick={() => setActiveCategory('getting-started')}
          >
            Getting Started
          </button>
          <button 
            style={{
              ...styles.categoryButton,
              ...(activeCategory === 'account' ? styles.activeCategory : {})
            }}
            onClick={() => setActiveCategory('account')}
          >
            Account & Security
          </button>
          <button 
            style={{
              ...styles.categoryButton,
              ...(activeCategory === 'features' ? styles.activeCategory : {})
            }}
            onClick={() => setActiveCategory('features')}
          >
            Features
          </button>
          <button 
            style={{
              ...styles.categoryButton,
              ...(activeCategory === 'troubleshooting' ? styles.activeCategory : {})
            }}
            onClick={() => setActiveCategory('troubleshooting')}
          >
            Troubleshooting
          </button>
        </div>

        <div style={styles.faqList}>
          {faqCategories[activeCategory].map((faq, index) => (
            <div key={index} style={styles.faqItem}>
              <h3 style={styles.question}>{faq.question}</h3>
              <p style={styles.answer}>{faq.answer}</p>
            </div>
          ))}
        </div>

        <div style={styles.contactSection}>
          <h2 style={styles.contactTitle}>Still Need Help?</h2>
          <p style={styles.answer}>
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <button 
              style={styles.categoryButton}
              onClick={() => router.push('/contact')}
            >
              📧 Contact Support
            </button>
            <button 
              style={styles.categoryButton}
              onClick={() => router.push('/feedback')}
            >
              💬 Send Feedback
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
