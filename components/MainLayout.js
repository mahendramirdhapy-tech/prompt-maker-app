// components/MainLayout.js
import Link from 'next/link';

export default function MainLayout({ children }) {
  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <Link href="/" className="logo">
            🛠️ FileOptimizeTools
          </Link>
          
          <nav className="nav">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/audio" className="nav-link">
              Audio Tools
            </Link>
            <Link href="/image" className="nav-link">
              Image Tools
            </Link>
            <Link href="/video" className="nav-link">
              Video Tools
            </Link>
            <Link href="/pdf" className="nav-link">
              PDF Tools
            </Link>
            <Link href="/text" className="nav-link">
              Text Tools
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {children}
      </main>

      {/* Feedback Section */}
      <section className="feedback-section">
        <div className="container">
          <h2 className="feedback-title">💬 Feedback & Support</h2>
          <p className="feedback-description">
            Have questions or suggestions? We'd love to hear from you! 
            Your feedback helps us improve our tools.
          </p>
          <div className="feedback-buttons">
            <a href="mailto:support@fileoptimizetools.com" className="feedback-button">
              📧 Email Support
            </a>
            <a href="https://github.com/yourusername/fileoptimizetools" className="feedback-button">
              ⭐ Rate on GitHub
            </a>
            <a href="https://twitter.com/fileoptimize" className="feedback-button">
              🐦 Follow on Twitter
            </a>
            <a href="/contact" className="feedback-button">
              📞 Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-logo">🛠️ FileOptimizeTools</h3>
              <p className="footer-description">
                Free, fast, and secure file optimization tools that work completely in your browser. 
                No uploads, no data sharing, 100% private.
              </p>
              <div className="social-links">
                <a href="https://github.com/yourusername" className="social-link">GitHub</a>
                <a href="https://twitter.com/fileoptimize" className="social-link">Twitter</a>
                <a href="https://linkedin.com/company/fileoptimize" className="social-link">LinkedIn</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <div className="footer-links">
                <Link href="/" className="footer-link">
                  Home
                </Link>
                <Link href="/about" className="footer-link">
                  About Us
                </Link>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Tools</h4>
              <div className="footer-links">
                <Link href="/audio" className="footer-link">
                  Audio Tools
                </Link>
                <Link href="/image" className="footer-link">
                  Image Tools
                </Link>
                <Link href="/video" className="footer-link">
                  Video Tools
                </Link>
                <Link href="/pdf" className="footer-link">
                  PDF Tools
                </Link>
                <Link href="/text" className="footer-link">
                  Text Tools
                </Link>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Features</h4>
              <div className="footer-features">
                <div>🔒 100% Offline Processing</div>
                <div>⚡ No File Uploads</div>
                <div>🎯 Fast & Efficient</div>
                <div>💾 Privacy First</div>
                <div>🆓 Completely Free</div>
                <div>🌐 No Registration Required</div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2024 FileOptimizeTools. All rights reserved. Made with ❤️ for the open web.</p>
            <div className="footer-bottom-links">
              <Link href="/sitemap" className="footer-bottom-link">Sitemap</Link>
              <Link href="/cookie-policy" className="footer-bottom-link">Cookie Policy</Link>
              <Link href="/dmca" className="footer-bottom-link">DMCA</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .nav {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid transparent;
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        .nav-link.active {
          background: rgba(255,255,255,0.2);
          font-weight: 600;
        }

        .main {
          min-height: 80vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem 0;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Feedback Section */
        .feedback-section {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .feedback-title {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .feedback-description {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .feedback-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .feedback-button {
          padding: 15px 25px;
          background: rgba(255,255,255,0.2);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 2px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }

        .feedback-button:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        /* Footer */
        .footer {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 4rem 0 2rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-logo {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #fbbf24;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-description {
          color: #cbd5e1;
          line-height: 1.6;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .social-link {
          color: #60a5fa;
          text-decoration: none;
          font-size: 0.9rem;
          padding: 6px 12px;
          border: 1px solid #374151;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          color: white;
          background: #374151;
          transform: translateY(-2px);
        }

        .footer-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: white;
          position: relative;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 2px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-link {
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1rem;
          cursor: pointer;
          padding: 4px 0;
        }

        .footer-link:hover {
          color: white;
          transform: translateX(5px);
        }

        .footer-features {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          color: #cbd5e1;
          font-size: 0.95rem;
        }

        .footer-features div {
          transition: all 0.3s ease;
          padding: 4px 0;
        }

        .footer-features div:hover {
          color: white;
          transform: translateX(5px);
        }

        .footer-bottom {
          border-top: 1px solid #475569;
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .footer-bottom-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-bottom-link {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: 0.9rem;
        }

        .footer-bottom-link:hover {
          color: white;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .nav {
            gap: 1rem;
            justify-content: center;
          }

          .nav-link {
            font-size: 0.9rem;
            padding: 6px 12px;
          }

          .feedback-buttons {
            grid-template-columns: 1fr;
          }

          .feedback-button {
            padding: 12px 20px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-bottom-links {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .header-container {
            padding: 0 1rem;
          }

          .nav {
            gap: 0.5rem;
          }

          .nav-link {
            font-size: 0.8rem;
            padding: 4px 8px;
          }

          .feedback-title {
            font-size: 2rem;
          }

          .feedback-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}
