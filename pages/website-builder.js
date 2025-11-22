// Test AI Connection
const testAIConnection = async () => {
  setIsGenerating(true);
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hello, are you working? Respond with "AI is working"',
        type: 'test'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      alert(`✅ AI Connection Successful!\nResponse: ${JSON.stringify(data)}`);
    } else {
      alert(`❌ AI Connection Failed - Status: ${response.status}`);
    }
  } catch (error) {
    alert(`❌ AI Connection Error: ${error.message}`);
  } finally {
    setIsGenerating(false);
  }
};
