const ToolCards = ({ darkMode, isMobile, navigateTo }) => {
  const TOOL_CARDS = [
    {
      id: 1,
      title: '🔍 SEO Tool',
      description: 'Optimize your content for search engines with our advanced SEO analysis tool.',
      path: '/seo',
      author: 'AI Prompt Maker',
      date: 'November 13, 2024',
      label: 'FREE TOOLS'
    },
    {
      id: 2,
      title: '💻 Code Assistant',
      description: 'Get help with coding, debugging, and code explanations from AI.',
      path: '/code',
      author: 'AI Prompt Maker',
      date: 'November 13, 2024',
      label: 'FREE TOOLS'
    },
    {
      id: 3,
      title: '✉️ Email Writer',
      description: 'Create professional emails quickly with our AI-powered email writer.',
      path: '/email',
      author: 'AI Prompt Maker',
      date: 'November 13, 2024',
      label: 'FREE TOOLS'
    },
    {
      id: 4,
      title: '🔄 Translator',
      description: 'Translate text between multiple languages with high accuracy.',
      path: '/translate',
      author: 'AI Prompt Maker',
      date: 'November 13, 2024',
      label: 'FREE TOOLS'
    },
    {
      id: 5,
      title: '🎵 Audio Tool',
      description: 'Audio processing and enhancement tools for your media files.',
      path: '/audio',
      author: 'AI Prompt Maker',
      date: 'November 13, 2024',
      label: 'FREE TOOLS'
    },
    {
      id: 6,
      title: '📚 Prompt Library',
      description: 'Explore our collection of pre-made AI prompts for various use cases.',
      path: '/prompts',
      author: 'AI Prompt Maker',
      date: 'November 13, 2024',
      label: 'FREE TOOLS'
    }
  ];

  const toolsGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '40px'
  };

  return (
    <section style={{ marginTop: '40px' }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: darkMode ? '#f8fafc' : '#1e293b',
        fontSize: isMobile ? '1.5rem' : '2rem'
      }}>
        🛠️ Our Free AI Tools
      </h2>
      
      <div style={toolsGridStyle}>
        {TOOL_CARDS.map((tool) => (
          <div
            key={tool.id}
            onClick={() => navigateTo(tool.path)}
            style={{
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'inline-block',
              marginBottom: '12px',
              alignSelf: 'flex-start'
            }}>
              {tool.label}
            </div>

            <h3 style={{
              margin: '0 0 10px 0',
              color: darkMode ? '#f8fafc' : '#1e293b',
              fontSize: '1.2rem',
            }}>
              {tool.title}
            </h3>

            <p style={{
              margin: '0 0 15px 0',
              color: darkMode ? '#cbd5e1' : '#64748b',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              flex: 1
            }}>
              {tool.description}
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: darkMode ? '#94a3b8' : '#94a3b8'
            }}>
              <span>By {tool.author}</span>
              <span>{tool.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolCards;
