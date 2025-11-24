// pages/multitool.js
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function MultiToolHub() {
  const [activeTool, setActiveTool] = useState(null);
  const [tools] = useState([
    { id: 1, title: "Password Generator", description: "Generate secure passwords with options", icon: "🔒" },
    { id: 2, title: "Age Calculator", description: "Calculate age in years, months, and days", icon: "📅" },
    { id: 3, title: "BMI Calculator", description: "Calculate BMI and health category", icon: "⚖️" },
    { id: 4, title: "Word Counter", description: "Count words, characters, and reading time", icon: "📝" },
    { id: 5, title: "Base64 Encoder", description: "Convert text to base64 and vice versa", icon: "🔣" },
    { id: 6, title: "Color Picker", description: "Pick colors and get HEX, RGB, HSL values", icon: "🎨" },
    { id: 7, title: "Text to Speech", description: "Convert text to speech using browser API", icon: "🔊" },
    { id: 8, title: "EMI Calculator", description: "Calculate monthly EMI and total interest", icon: "💰" },
    { id: 9, title: "Unit Converter", description: "Convert between different units", icon: "📏" },
    { id: 10, title: "JSON Formatter", description: "Format and validate JSON", icon: "📄" },
    { id: 11, title: "Image Converter", description: "Convert between JPG, PNG, WEBP formats", icon: "🖼️" },
    { id: 12, title: "Image Compressor", description: "Compress image file size", icon: "📷" },
    { id: 13, title: "QR Code Generator", description: "Generate QR codes from text", icon: "🔲" },
    { id: 14, title: "Currency Converter", description: "Convert between currencies", icon: "💱" },
    { id: 15, title: "Timer", description: "Countdown timer with alerts", icon: "⏱️" },
    { id: 16, title: "Stopwatch", description: "Precision stopwatch", icon: "⏰" },
    { id: 17, title: "Random Number", description: "Generate random numbers", icon: "🎲" },
    { id: 18, title: "Case Converter", description: "Convert text case", icon: "🔠" },
    { id: 19, title: "Percentage Calculator", description: "Calculate percentages", icon: "📊" },
    { id: 20, title: "Date Difference", description: "Calculate days between dates", icon: "📆" }
  ]);

  // Tool States
  const [passwordConfig, setPasswordConfig] = useState({
    length: 12, uppercase: true, lowercase: true, numbers: true, symbols: false
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [ageResult, setAgeResult] = useState(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [wordStats, setWordStats] = useState(null);
  const [base64Input, setBase64Input] = useState('');
  const [base64Result, setBase64Result] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffd700');
  const [ttsText, setTtsText] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [emiResult, setEmiResult] = useState(null);
  const [unitValue, setUnitValue] = useState('1');
  const [unitCategory, setUnitCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [unitOutput, setUnitOutput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonResult, setJsonResult] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [compressorQuality, setCompressorQuality] = useState(80);
  const [qrText, setQrText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [currencyAmount, setCurrencyAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencyResult, setCurrencyResult] = useState('');
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerDisplay, setTimerDisplay] = useState('05:00');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [randomMin, setRandomMin] = useState(1);
  const [randomMax, setRandomMax] = useState(100);
  const [randomResult, setRandomResult] = useState('');
  const [caseText, setCaseText] = useState('');
  const [caseResult, setCaseResult] = useState('');
  const [percentageValue, setPercentageValue] = useState('');
  const [percentageOf, setPercentageOf] = useState('');
  const [percentageResult, setPercentageResult] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dateDiff, setDateDiff] = useState('');

  // Refs
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const stopwatchRef = useRef(null);

  // Effects
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchRef.current = setInterval(updateStopwatch, 1000);
    }
    return () => clearInterval(stopwatchRef.current);
  }, [isStopwatchRunning]);

  // Timer Functions
  const updateTimer = () => {
    setTimerDisplay(prev => {
      const [minutes, seconds] = prev.split(':').map(Number);
      let totalSeconds = minutes * 60 + seconds - 1;
      
      if (totalSeconds <= 0) {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
        alert('Timer finished!');
        return '00:00';
      }
      
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    });
  };

  const startTimer = () => {
    const totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    if (totalSeconds === 0) {
      alert('Please set timer duration');
      return;
    }
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    setTimerDisplay(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    setIsTimerRunning(true);
  };

  const updateStopwatch = () => {
    setStopwatchTime(prev => prev + 1);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openTool = (toolId) => {
    setActiveTool(toolId);
  };

  const closeTool = () => {
    setActiveTool(null);
    setIsTimerRunning(false);
    setIsStopwatchRunning(false);
    clearInterval(timerRef.current);
    clearInterval(stopwatchRef.current);
  };

  // Tool 1: Password Generator
  const generatePassword = () => {
    const { length, uppercase, lowercase, numbers, symbols } = passwordConfig;
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (uppercase) charset += uppercaseChars;
    if (lowercase) charset += lowercaseChars;
    if (numbers) charset += numberChars;
    if (symbols) charset += symbolChars;

    if (!charset) {
      alert('Please select at least one character type.');
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    setGeneratedPassword(password);
  };

  // Tool 2: Age Calculator
  const calculateAge = () => {
    if (!birthDate) {
      alert('Please select your date of birth.');
      return;
    }

    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAgeResult({ years, months, days });
  };

  // Tool 3: BMI Calculator
  const calculateBMI = () => {
    if (!height || !weight) {
      alert('Please enter both height and weight.');
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    setBmiResult({ bmi: bmi.toFixed(1), category });
  };

  // Tool 4: Word Counter
  const countWords = () => {
    if (!textInput.trim()) {
      alert('Please enter some text.');
      return;
    }

    const words = textInput.trim() ? textInput.trim().split(/\s+/) : [];
    const characters = textInput.length;
    const charactersNoSpaces = textInput.replace(/\s/g, '').length;
    const sentences = textInput.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = textInput.split(/\n+/).filter(p => p.trim().length > 0);
    const readingTime = Math.ceil(words.length / 200);

    setWordStats({
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readingTime
    });
  };

  // Tool 5: Base64 Encoder/Decoder
  const encodeBase64 = () => {
    if (!base64Input) {
      alert('Please enter text to encode.');
      return;
    }
    try {
      const encoded = btoa(unescape(encodeURIComponent(base64Input)));
      setBase64Result(encoded);
    } catch (e) {
      alert('Error encoding text: ' + e.message);
    }
  };

  const decodeBase64 = () => {
    if (!base64Input) {
      alert('Please enter base64 to decode.');
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setBase64Result(decoded);
    } catch (e) {
      alert('Error decoding text. Make sure it is valid base64.');
    }
  };

  // Tool 6: Color Picker
  const getColorValues = (hex) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    
    // Convert RGB to HSL
    const rNormal = r / 255;
    const gNormal = g / 255;
    const bNormal = b / 255;
    
    const max = Math.max(rNormal, gNormal, bNormal);
    const min = Math.min(rNormal, gNormal, bNormal);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNormal: h = (gNormal - bNormal) / d + (gNormal < bNormal ? 6 : 0); break;
        case gNormal: h = (bNormal - rNormal) / d + 2; break;
        case bNormal: h = (rNormal - gNormal) / d + 4; break;
      }
      h /= 6;
    }

    return {
      hex: hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
    };
  };

  // Tool 7: Text to Speech
  const speakText = () => {
    if (!ttsText) {
      alert('Please enter text to speak.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Tool 8: EMI Calculator
  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const months = parseInt(loanTerm);
    
    if (!principal || !annualRate || !months) {
      alert('Please fill in all fields.');
      return;
    }
    
    const monthlyRate = annualRate / 100 / 12;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    setEmiResult({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2)
    });
  };

  // Tool 9: Unit Converter
  const convertUnits = () => {
    const value = parseFloat(unitValue);
    if (!value) {
      alert('Please enter a value to convert.');
      return;
    }

    const conversions = {
      length: {
        meter: 1, kilometer: 0.001, centimeter: 100, millimeter: 1000,
        inch: 39.3701, foot: 3.28084, yard: 1.09361, mile: 0.000621371
      },
      weight: {
        kilogram: 1, gram: 1000, milligram: 1000000,
        pound: 2.20462, ounce: 35.274
      },
      temperature: {
        celsius: 1,
        fahrenheit: 1,
        kelvin: 1
      }
    };

    let result;
    if (unitCategory === 'temperature') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        result = (value * 9/5) + 32;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        result = (value - 32) * 5/9;
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        result = value + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        result = value - 273.15;
      } else {
        result = value;
      }
    } else {
      const fromFactor = conversions[unitCategory][fromUnit];
      const toFactor = conversions[unitCategory][toUnit];
      result = value * (toFactor / fromFactor);
    }

    setUnitOutput(`${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`);
  };

  // Tool 10: JSON Formatter
  const formatJSON = () => {
    if (!jsonInput.trim()) {
      alert('Please enter JSON to format.');
      return;
    }
    try {
      const parsedJson = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsedJson, null, 2);
      setJsonResult(formatted);
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  };

  // Tool 11: Image Converter
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setCurrentImage(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = (format) => {
    if (!currentImage) {
      alert('Please upload an image first.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(currentImage, 0, 0);
    const dataURL = canvas.toDataURL(`image/${format}`);
    const link = document.createElement('a');
    link.download = `converted-image.${format}`;
    link.href = dataURL;
    link.click();
  };

  // Tool 12: Image Compressor
  const compressImage = () => {
    if (!currentImage) {
      alert('Please upload an image first.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(currentImage, 0, 0);
    const quality = compressorQuality / 100;
    const dataURL = canvas.toDataURL('image/jpeg', quality);
    const link = document.createElement('a');
    link.download = 'compressed-image.jpg';
    link.href = dataURL;
    link.click();
  };

  // Tool 13: QR Code Generator
  const generateQRCode = () => {
    if (!qrText.trim()) {
      alert('Please enter text to generate QR code.');
      return;
    }
    // Simple QR code simulation
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw QR pattern (simplified)
    ctx.fillStyle = 'black';
    for (let i = 0; i < qrText.length; i++) {
      const x = (i % 14) * 14 + 10;
      const y = Math.floor(i / 14) * 14 + 10;
      if (qrText.charCodeAt(i) % 2 === 0) {
        ctx.fillRect(x, y, 10, 10);
      }
    }
    
    setQrCode(canvas.toDataURL());
  };

  // Tool 14: Currency Converter
  const convertCurrency = () => {
    const rates = {
      USD: { EUR: 0.85, GBP: 0.73, INR: 83.25, JPY: 110.50 },
      EUR: { USD: 1.18, GBP: 0.86, INR: 98.00, JPY: 130.00 },
      GBP: { USD: 1.37, EUR: 1.16, INR: 114.00, JPY: 151.00 },
      INR: { USD: 0.012, EUR: 0.010, GBP: 0.0088, JPY: 1.33 }
    };

    const amount = parseFloat(currencyAmount);
    if (!amount) {
      alert('Please enter amount to convert.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setCurrencyResult(`${amount} ${fromCurrency} = ${amount} ${toCurrency}`);
      return;
    }

    const rate = rates[fromCurrency]?.[toCurrency];
    if (rate) {
      const converted = (amount * rate).toFixed(2);
      setCurrencyResult(`${amount} ${fromCurrency} = ${converted} ${toCurrency}`);
    } else {
      alert('Conversion rate not available for selected currencies.');
    }
  };

  // Tool 17: Random Number Generator
  const generateRandom = () => {
    const min = parseInt(randomMin);
    const max = parseInt(randomMax);
    
    if (min >= max) {
      alert('Maximum must be greater than minimum.');
      return;
    }

    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomResult(`Random number: ${random}`);
  };

  // Tool 18: Case Converter
  const convertCase = (type) => {
    if (!caseText.trim()) {
      alert('Please enter text to convert.');
      return;
    }

    switch(type) {
      case 'upper':
        setCaseResult(caseText.toUpperCase());
        break;
      case 'lower':
        setCaseResult(caseText.toLowerCase());
        break;
      case 'title':
        setCaseResult(caseText.replace(/\w\S*/g, txt => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        ));
        break;
      case 'sentence':
        setCaseResult(caseText.charAt(0).toUpperCase() + caseText.slice(1).toLowerCase());
        break;
    }
  };

  // Tool 19: Percentage Calculator
  const calculatePercentage = () => {
    const value = parseFloat(percentageValue);
    const ofValue = parseFloat(percentageOf);
    
    if (!value || !ofValue) {
      alert('Please enter both values.');
      return;
    }

    const result = (value / ofValue) * 100;
    setPercentageResult(`${value} is ${result.toFixed(2)}% of ${ofValue}`);
  };

  // Tool 20: Date Difference Calculator
  const calculateDateDiff = () => {
    if (!dateFrom || !dateTo) {
      alert('Please select both dates.');
      return;
    }

    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setDateDiff(`${diffDays} days between dates`);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const renderToolContent = () => {
    switch(activeTool) {
      case 1: // Password Generator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🔒 Password Generator</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Password Length: {passwordConfig.length}</label>
              <input
                type="range"
                min="6"
                max="50"
                value={passwordConfig.length}
                onChange={(e) => setPasswordConfig({...passwordConfig, length: parseInt(e.target.value)})}
                style={rangeInputStyle}
              />
            </div>

            <div style={checkboxGroupStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={passwordConfig.uppercase}
                  onChange={(e) => setPasswordConfig({...passwordConfig, uppercase: e.target.checked})}
                  style={checkboxStyle}
                />
                Uppercase Letters
              </label>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={passwordConfig.lowercase}
                  onChange={(e) => setPasswordConfig({...passwordConfig, lowercase: e.target.checked})}
                  style={checkboxStyle}
                />
                Lowercase Letters
              </label>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={passwordConfig.numbers}
                  onChange={(e) => setPasswordConfig({...passwordConfig, numbers: e.target.checked})}
                  style={checkboxStyle}
                />
                Numbers
              </label>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={passwordConfig.symbols}
                  onChange={(e) => setPasswordConfig({...passwordConfig, symbols: e.target.checked})}
                  style={checkboxStyle}
                />
                Symbols
              </label>
            </div>

            <button style={primaryButtonStyle} onClick={generatePassword}>
              Generate Password
            </button>

            {generatedPassword && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Generated Password:</h4>
                <div style={passwordDisplayStyle}>
                  <input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    style={passwordInputStyle}
                  />
                  <button style={secondaryButtonStyle} onClick={() => copyToClipboard(generatedPassword)}>
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Age Calculator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>📅 Age Calculator</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Date of Birth:</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={inputStyle}
              />
            </div>

            <button style={primaryButtonStyle} onClick={calculateAge}>
              Calculate Age
            </button>

            {ageResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Your Age:</h4>
                <p style={ageResultStyle}>
                  {ageResult.years} years, {ageResult.months} months, and {ageResult.days} days
                </p>
              </div>
            )}
          </div>
        );

      case 3: // BMI Calculator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>⚖️ BMI Calculator</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Height (cm):</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g., 170"
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Weight (kg):</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 65"
                style={inputStyle}
              />
            </div>

            <button style={primaryButtonStyle} onClick={calculateBMI}>
              Calculate BMI
            </button>

            {bmiResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Your BMI:</h4>
                <p style={bmiValueStyle}>BMI: {bmiResult.bmi}</p>
                <p style={bmiCategoryStyle}>Category: {bmiResult.category}</p>
              </div>
            )}
          </div>
        );

      case 4: // Word Counter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>📝 Word Counter</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Text:</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={8}
                style={textareaStyle}
              />
            </div>

            <button style={primaryButtonStyle} onClick={countWords}>
              Count Words
            </button>

            {wordStats && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Text Analysis:</h4>
                <div style={statsGridStyle}>
                  <div style={statItemStyle}><span style={statNumberStyle}>{wordStats.words}</span><span style={statLabelStyle}>Words</span></div>
                  <div style={statItemStyle}><span style={statNumberStyle}>{wordStats.characters}</span><span style={statLabelStyle}>Characters</span></div>
                  <div style={statItemStyle}><span style={statNumberStyle}>{wordStats.charactersNoSpaces}</span><span style={statLabelStyle}>No Spaces</span></div>
                  <div style={statItemStyle}><span style={statNumberStyle}>{wordStats.sentences}</span><span style={statLabelStyle}>Sentences</span></div>
                  <div style={statItemStyle}><span style={statNumberStyle}>{wordStats.paragraphs}</span><span style={statLabelStyle}>Paragraphs</span></div>
                  <div style={statItemStyle}><span style={statNumberStyle}>{wordStats.readingTime}</span><span style={statLabelStyle}>Mins Read</span></div>
                </div>
              </div>
            )}
          </div>
        );

      case 5: // Base64 Encoder/Decoder
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🔣 Base64 Encoder/Decoder</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Text:</label>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Enter text to encode or base64 to decode"
                rows={5}
                style={textareaStyle}
              />
            </div>

            <div style={buttonGroupStyle}>
              <button style={primaryButtonStyle} onClick={encodeBase64}>
                Encode to Base64
              </button>
              <button style={primaryButtonStyle} onClick={decodeBase64}>
                Decode from Base64
              </button>
            </div>

            {base64Result && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Result:</h4>
                <textarea
                  value={base64Result}
                  readOnly
                  rows={5}
                  style={textareaStyle}
                />
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(base64Result)}>
                  Copy Result
                </button>
              </div>
            )}
          </div>
        );

      case 6: // Color Picker
        const colorValues = getColorValues(selectedColor);
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🎨 Color Picker</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Select Color:</label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={colorInputStyle}
              />
            </div>

            <div style={{...colorPreviewStyle, backgroundColor: selectedColor}}></div>

            <div style={resultStyle}>
              <h4 style={resultTitleStyle}>Color Values:</h4>
              <p style={colorValueStyle}>HEX: {colorValues.hex}</p>
              <p style={colorValueStyle}>RGB: {colorValues.rgb}</p>
              <p style={colorValueStyle}>HSL: {colorValues.hsl}</p>
              <button style={secondaryButtonStyle} onClick={() => copyToClipboard(colorValues.hex)}>
                Copy HEX Value
              </button>
            </div>
          </div>
        );

      case 7: // Text to Speech
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🔊 Text to Speech</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Text:</label>
              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="Enter text to convert to speech"
                rows={5}
                style={textareaStyle}
              />
            </div>

            <button style={primaryButtonStyle} onClick={speakText}>
              Speak Text
            </button>
          </div>
        );

      case 8: // EMI Calculator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>💰 EMI Calculator</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Loan Amount ($):</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="e.g., 10000"
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Annual Interest Rate (%):</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 5.5"
                step="0.01"
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Loan Term (months):</label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="e.g., 60"
                style={inputStyle}
              />
            </div>

            <button style={primaryButtonStyle} onClick={calculateEMI}>
              Calculate EMI
            </button>

            {emiResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>EMI Calculation:</h4>
                <p style={emiValueStyle}>Monthly EMI: ${emiResult.emi}</p>
                <p style={emiValueStyle}>Total Interest: ${emiResult.totalInterest}</p>
                <p style={emiValueStyle}>Total Payment: ${emiResult.totalPayment}</p>
              </div>
            )}
          </div>
        );

      case 9: // Unit Converter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>📏 Unit Converter</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Value:</label>
              <input
                type="number"
                value={unitValue}
                onChange={(e) => setUnitValue(e.target.value)}
                placeholder="Enter value"
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Category:</label>
              <select value={unitCategory} onChange={(e) => setUnitCategory(e.target.value)} style={selectStyle}>
                <option value="length">Length</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
              </select>
            </div>

            <div style={flexRowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>From Unit:</label>
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} style={selectStyle}>
                  {unitCategory === 'length' && <>
                    <option value="meter">Meter</option>
                    <option value="kilometer">Kilometer</option>
                    <option value="centimeter">Centimeter</option>
                    <option value="millimeter">Millimeter</option>
                    <option value="inch">Inch</option>
                    <option value="foot">Foot</option>
                    <option value="yard">Yard</option>
                    <option value="mile">Mile</option>
                  </>}
                  {unitCategory === 'weight' && <>
                    <option value="kilogram">Kilogram</option>
                    <option value="gram">Gram</option>
                    <option value="milligram">Milligram</option>
                    <option value="pound">Pound</option>
                    <option value="ounce">Ounce</option>
                  </>}
                  {unitCategory === 'temperature' && <>
                    <option value="celsius">Celsius</option>
                    <option value="fahrenheit">Fahrenheit</option>
                    <option value="kelvin">Kelvin</option>
                  </>}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>To Unit:</label>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} style={selectStyle}>
                  {unitCategory === 'length' && <>
                    <option value="meter">Meter</option>
                    <option value="kilometer">Kilometer</option>
                    <option value="centimeter">Centimeter</option>
                    <option value="millimeter">Millimeter</option>
                    <option value="inch">Inch</option>
                    <option value="foot">Foot</option>
                    <option value="yard">Yard</option>
                    <option value="mile">Mile</option>
                  </>}
                  {unitCategory === 'weight' && <>
                    <option value="kilogram">Kilogram</option>
                    <option value="gram">Gram</option>
                    <option value="milligram">Milligram</option>
                    <option value="pound">Pound</option>
                    <option value="ounce">Ounce</option>
                  </>}
                  {unitCategory === 'temperature' && <>
                    <option value="celsius">Celsius</option>
                    <option value="fahrenheit">Fahrenheit</option>
                    <option value="kelvin">Kelvin</option>
                  </>}
                </select>
              </div>
            </div>

            <button style={primaryButtonStyle} onClick={convertUnits}>
              Convert
            </button>

            {unitOutput && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Conversion Result:</h4>
                <p style={unitOutputStyle}>{unitOutput}</p>
              </div>
            )}
          </div>
        );

      case 10: // JSON Formatter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>📄 JSON Formatter</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter JSON:</label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste your JSON here...'
                rows={8}
                style={textareaStyle}
              />
            </div>

            <button style={primaryButtonStyle} onClick={formatJSON}>
              Format JSON
            </button>

            {jsonResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Formatted JSON:</h4>
                <pre style={preStyle}>{jsonResult}</pre>
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(jsonResult)}>
                  Copy Formatted JSON
                </button>
              </div>
            )}
          </div>
        );

      case 11: // Image Converter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🖼️ Image Converter</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Upload Image:</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={inputStyle} />
            </div>
            <div style={buttonGroupStyle}>
              <button style={primaryButtonStyle} onClick={() => downloadImage('png')}>Convert to PNG</button>
              <button style={primaryButtonStyle} onClick={() => downloadImage('jpeg')}>Convert to JPG</button>
              <button style={primaryButtonStyle} onClick={() => downloadImage('webp')}>Convert to WEBP</button>
            </div>
          </div>
        );

      case 12: // Image Compressor
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>📷 Image Compressor</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Upload Image:</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Quality: {compressorQuality}%</label>
              <input type="range" min="1" max="100" value={compressorQuality} 
                onChange={(e) => setCompressorQuality(e.target.value)} style={rangeInputStyle} />
            </div>
            <button style={primaryButtonStyle} onClick={compressImage}>Compress & Download</button>
          </div>
        );

      case 13: // QR Code Generator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🔲 QR Code Generator</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Text or URL:</label>
              <input type="text" value={qrText} onChange={(e) => setQrText(e.target.value)} 
                placeholder="Enter text for QR code" style={inputStyle} />
            </div>
            <button style={primaryButtonStyle} onClick={generateQRCode}>Generate QR Code</button>
            {qrCode && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>QR Code:</h4>
                <img src={qrCode} alt="QR Code" style={{maxWidth: '200px', marginBottom: '1rem'}} />
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(qrText)}>Copy Text</button>
              </div>
            )}
          </div>
        );

      case 14: // Currency Converter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>💱 Currency Converter</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Amount:</label>
              <input type="number" value={currencyAmount} onChange={(e) => setCurrencyAmount(e.target.value)} 
                placeholder="Enter amount" style={inputStyle} />
            </div>
            <div style={flexRowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>From:</label>
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} style={selectStyle}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>To:</label>
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} style={selectStyle}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
            <button style={primaryButtonStyle} onClick={convertCurrency}>Convert</button>
            {currencyResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Conversion Result:</h4>
                <p style={unitOutputStyle}>{currencyResult}</p>
              </div>
            )}
          </div>
        );

      case 15: // Timer
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>⏱️ Timer</h3>
            <div style={flexRowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Hours:</label>
                <input type="number" value={timerHours} onChange={(e) => setTimerHours(e.target.value)} 
                  min="0" style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Minutes:</label>
                <input type="number" value={timerMinutes} onChange={(e) => setTimerMinutes(e.target.value)} 
                  min="0" max="59" style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Seconds:</label>
                <input type="number" value={timerSeconds} onChange={(e) => setTimerSeconds(e.target.value)} 
                  min="0" max="59" style={inputStyle} />
              </div>
            </div>
            <div style={timerDisplayStyle}>{timerDisplay}</div>
            <div style={buttonGroupStyle}>
              <button style={primaryButtonStyle} onClick={startTimer} disabled={isTimerRunning}>
                Start Timer
              </button>
              <button style={secondaryButtonStyle} onClick={() => setIsTimerRunning(false)}>
                Stop
              </button>
              <button style={secondaryButtonStyle} onClick={() => setTimerDisplay('00:00')}>
                Reset
              </button>
            </div>
          </div>
        );

      case 16: // Stopwatch
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>⏰ Stopwatch</h3>
            <div style={timerDisplayStyle}>{formatTime(stopwatchTime)}</div>
            <div style={buttonGroupStyle}>
              <button style={primaryButtonStyle} onClick={() => setIsStopwatchRunning(true)} 
                disabled={isStopwatchRunning}>
                Start
              </button>
              <button style={secondaryButtonStyle} onClick={() => setIsStopwatchRunning(false)}>
                Stop
              </button>
              <button style={secondaryButtonStyle} onClick={() => setStopwatchTime(0)}>
                Reset
              </button>
            </div>
          </div>
        );

      case 17: // Random Number Generator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🎲 Random Number Generator</h3>
            <div style={flexRowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Minimum:</label>
                <input type="number" value={randomMin} onChange={(e) => setRandomMin(e.target.value)} 
                  style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Maximum:</label>
                <input type="number" value={randomMax} onChange={(e) => setRandomMax(e.target.value)} 
                  style={inputStyle} />
              </div>
            </div>
            <button style={primaryButtonStyle} onClick={generateRandom}>Generate Random Number</button>
            {randomResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Result:</h4>
                <p style={unitOutputStyle}>{randomResult}</p>
              </div>
            )}
          </div>
        );

      case 18: // Case Converter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🔠 Case Converter</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Text:</label>
              <textarea value={caseText} onChange={(e) => setCaseText(e.target.value)} 
                placeholder="Enter text to convert case" rows={4} style={textareaStyle} />
            </div>
            <div style={buttonGroupStyle}>
              <button style={primaryButtonStyle} onClick={() => convertCase('upper')}>UPPERCASE</button>
              <button style={primaryButtonStyle} onClick={() => convertCase('lower')}>lowercase</button>
              <button style={primaryButtonStyle} onClick={() => convertCase('title')}>Title Case</button>
              <button style={primaryButtonStyle} onClick={() => convertCase('sentence')}>Sentence case</button>
            </div>
            {caseResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Converted Text:</h4>
                <p style={caseResultStyle}>{caseResult}</p>
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(caseResult)}>
                  Copy Text
                </button>
              </div>
            )}
          </div>
        );

      case 19: // Percentage Calculator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>📊 Percentage Calculator</h3>
            <div style={flexRowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Value:</label>
                <input type="number" value={percentageValue} onChange={(e) => setPercentageValue(e.target.value)} 
                  placeholder="Value" style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Of:</label>
                <input type="number" value={percentageOf} onChange={(e) => setPercentageOf(e.target.value)} 
                  placeholder="Total" style={inputStyle} />
              </div>
            </div>
            <button style={primaryButtonStyle} onClick={calculatePercentage}>Calculate Percentage</button>
            {percentageResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Result:</h4>
                <p style={unitOutputStyle}>{percentageResult}</p>
              </div>
            )}
          </div>
        );

      case 20: // Date Difference Calculator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>📆 Date Difference Calculator</h3>
            <div style={flexRowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>From Date:</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} 
                  style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>To Date:</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} 
                  style={inputStyle} />
              </div>
            </div>
            <button style={primaryButtonStyle} onClick={calculateDateDiff}>Calculate Difference</button>
            {dateDiff && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Date Difference:</h4>
                <p style={unitOutputStyle}>{dateDiff}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    color: '#1e293b',
    marginBottom: '0.5rem',
    fontWeight: '700'
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#64748b',
    marginBottom: '2rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0'
  };

  const cardTitleStyle = {
    fontSize: '1.25rem',
    color: '#1e293b',
    marginBottom: '0.5rem',
    fontWeight: '600'
  };

  const cardDescriptionStyle = {
    color: '#64748b',
    marginBottom: '1rem',
    lineHeight: '1.5'
  };

  const primaryButtonStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const secondaryButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#0d9488',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem'
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1.5rem',
    fontSize: '1.5rem',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    color: '#64748b'
  };

  const toolContentStyle = {
    marginTop: '1rem'
  };

  const toolTitleStyle = {
    color: '#1e293b',
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: '600'
  };

  const inputGroupStyle = {
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const textareaStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  const rangeInputStyle = {
    width: '100%',
    margin: '0.5rem 0'
  };

  const checkboxGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginBottom: '1.5rem'
  };

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  };

  const flexRowStyle = {
    display: 'flex',
    gap: '1rem'
  };

  const resultStyle = {
    marginTop: '1.5rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  };

  const resultTitleStyle = {
    color: '#1e293b',
    marginBottom: '1rem',
    fontSize: '1.125rem',
    fontWeight: '600'
  };

  const passwordDisplayStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  };

  const passwordInputStyle = {
    flex: '1',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: 'white',
    fontSize: '16px'
  };

  const ageResultStyle = {
    fontSize: '1.125rem',
    margin: '0',
    color: '#1e293b'
  };

  const bmiValueStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
    color: '#2563eb'
  };

  const bmiCategoryStyle = {
    fontSize: '1.125rem',
    margin: '0.5rem 0',
    color: '#374151'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem'
  };

  const statItemStyle = {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  };

  const statNumberStyle = {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: '0.5rem'
  };

  const statLabelStyle = {
    fontSize: '0.875rem',
    color: '#64748b'
  };

  const colorInputStyle = {
    width: '100%',
    height: '50px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  };

  const colorPreviewStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    margin: '1rem 0',
    border: '1px solid #d1d5db'
  };

  const colorValueStyle = {
    margin: '0.5rem 0',
    fontFamily: 'monospace',
    fontSize: '14px'
  };

  const emiValueStyle = {
    fontSize: '1.125rem',
    margin: '0.5rem 0',
    color: '#374151'
  };

  const selectStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'white'
  };

  const unitOutputStyle = {
    fontSize: '1.125rem',
    fontFamily: 'monospace',
    margin: '0',
    color: '#1e293b'
  };

  const preStyle = {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: '1rem',
    borderRadius: '8px',
    overflowX: 'auto',
    fontSize: '14px',
    marginBottom: '1rem'
  };

  const timerDisplayStyle = {
    fontSize: '3rem',
    textAlign: 'center',
    margin: '2rem 0',
    fontFamily: 'monospace',
    color: '#2563eb',
    fontWeight: 'bold'
  };

  const caseResultStyle = {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '1rem'
  };

  return (
    <Layout>
      <Head>
        <title>Multi Tool Hub | 20+ Free Online Tools & Utilities</title>
        <meta 
          name="description" 
          content="Free online tools collection - Password Generator, Age Calculator, BMI Calculator, Word Counter, Base64 Encoder, Color Picker, Text to Speech, EMI Calculator, Unit Converter, JSON Formatter and 10+ more tools. All tools work instantly in your browser." 
        />
        <meta 
          name="keywords" 
          content="free online tools, password generator, age calculator, bmi calculator, word counter, base64 encoder, color picker, text to speech, emi calculator, unit converter, json formatter, image converter, qr code generator, currency converter, timer, stopwatch, random number generator, case converter, percentage calculator, date difference calculator" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Multi Tool Hub" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Multi Tool Hub | 20+ Free Online Tools & Utilities" />
        <meta property="og:description" content="Free online tools collection - Password Generator, Age Calculator, BMI Calculator, Word Counter, Base64 Encoder, Color Picker and 15+ more tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yoursite.com/multitool" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Multi Tool Hub | 20+ Free Online Tools" />
        <meta name="twitter:description" content="Collection of 20+ free online tools that work instantly in your browser. No installation required." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://yoursite.com/multitool" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Multi Tool Hub",
              "description": "Collection of 20+ free online tools including password generator, age calculator, BMI calculator, word counter, and more.",
              "url": "https://yoursite.com/multitool",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "permissions": "browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </Head>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>🛠️ Multi Tool Hub</h1>
          <p style={subtitleStyle}>
            Your all-in-one solution with 20+ free online tools for everyday tasks. No installation required - all tools work instantly in your browser!
          </p>
        </div>

        <div style={gridStyle}>
          {tools.map(tool => (
            <div
              key={tool.id}
              style={cardStyle}
              onClick={() => openTool(tool.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div>
                <h2 style={cardTitleStyle}>{tool.icon} {tool.title}</h2>
                <p style={cardDescriptionStyle}>{tool.description}</p>
              </div>
              <button style={primaryButtonStyle}>
                Open Tool
              </button>
            </div>
          ))}
        </div>

        {/* Tool Modal */}
        {activeTool && (
          <div style={modalOverlayStyle} onClick={closeTool}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <button style={closeButtonStyle} onClick={closeTool}>×</button>
              {renderToolContent()}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
