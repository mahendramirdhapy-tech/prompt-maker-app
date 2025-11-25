// components/FeedbackSection.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const FeedbackSection = ({ darkMode, isMobile, navigateTo }) => {
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  useEffect(() => {
    fetchRecentFeedbacks();
  }, []);

  const fetchRecentFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecentFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const NativeBannerAd = () => {
    return (
      <div style={{
        margin: '30px 0',
        padding: '15px',
        backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        borderRadius: '8px',
        textAlign: 'center',
        minHeight: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Native Banner Ad Container */}
        <div id="feedback-native-ad"></div>
      </div>
    );
  };

  return (
    <section style={{
      marginTop: '60px',
      padding: isMobile ? '20px 0' : '40px 0',
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
      borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{
            color: darkMode ? '#f8fafc' : '#1e293b',
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            margin: '0 0 12px 0',
            fontWeight: '700'
          }}>
            💬 User Feedback
          </h2>
          <p style={{
            color: darkMode ? '#cbd5e1' : '#64748b',
            fontSize: isMobile ? '1rem' : '1.2rem',
            margin: '0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            See what our users are saying about their experience
          </p>
        </div>

        {feedbackLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: darkMode ? '#cbd5e1' : '#64748b'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: `3px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              borderTop: `3px solid #3b82f6`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading feedback...</p>
          </div>
        ) : recentFeedbacks.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {recentFeedbacks.map((feedback) => (
              <div key={feedback.id} style={{
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.3s ease',
                position: 'relative',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Rating */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  fontSize: '1.5rem'
                }}>
                  {feedback.rating ? '👍' : '👎'}
                </div>

                {/* User Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: feedback.rating ? '#10b981' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}>
                    {feedback.name ? feedback.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      color: darkMode ? '#f8fafc' : '#1e293b',
                      fontSize: '1rem'
                    }}>
                      {feedback.name || 'Anonymous User'}
                    </h4>
                    <p style={{
                      margin: '0',
                      color: darkMode ? '#94a3b8' : '#64748b',
                      fontSize: '0.8rem'
                    }}>
                      {new Date(feedback.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>

                {/* Feedback Message */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0',
                    color: darkMode ? '#cbd5e1' : '#64748b',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {feedback.comment || 'No comment provided'}
                  </p>
                </div>

                {/* Category */}
                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  <span style={{
                    backgroundColor: feedback.rating ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: feedback.rating ? '#10b981' : '#ef4444',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600'
                  }}>
                    {feedback.category || 'General'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: darkMode ? '#94a3b8' : '#64748b'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
            <h3 style={{ margin: '0 0 12px 0' }}>No Feedback Yet</h3>
            <p style={{ margin: '0 0 20px 0' }}>
              Be the first to share your experience with us!
            </p>
            <button 
              onClick={() => navigateTo('/feedback')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Share Your Feedback
            </button>
          </div>
        )}

        {/* Feedback section ke beech mein ad */}
        <NativeBannerAd />

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          padding: '30px',
          backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
          borderRadius: '12px',
          border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            color: darkMode ? '#f8fafc' : '#1e293b',
            fontSize: isMobile ? '1.3rem' : '1.5rem'
          }}>
            Share Your Experience
          </h3>
          <p style={{
            margin: '0 0 20px 0',
            color: darkMode ? '#cbd5e1' : '#64748b',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            Help us improve by sharing your feedback and suggestions
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => navigateTo('/feedback')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              💬 Give Feedback
            </button>
            <button 
              onClick={() => navigateTo('/contact')}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: darkMode ? '#cbd5e1' : '#64748b',
                border: `1px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default FeedbackSection;
