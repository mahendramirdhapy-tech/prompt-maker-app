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

  // Tool States (सभी existing states यहाँ रहेंगे)
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

  // Effects (existing effects यहाँ रहेंगे)
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

  // Timer Functions (existing functions यहाँ रहेंगे)
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

            {/* 🔥 PASSWORD GENERATOR ARTICLE */}
            <div style={articleSectionStyle}>
              <h3 style={articleTitleStyle}>🔐 पासवर्ड सिक्योरिटी कंप्लीट गाइड - 2024</h3>
              
              <div style={articleContentStyle}>
                <h4 style={articleSubtitleStyle}>क्यों जरूरी है स्ट्रॉन्ग पासवर्ड?</h4>
                <p style={articleParagraphStyle}>
                  आज के डिजिटल युग में, पासवर्ड आपकी ऑनलाइन पहचान की पहली सुरक्षा परत है। 
                  साइबर सिक्योरिटी एक्सपर्ट्स के मुताबिक, 80% से ज्यादा डेटा ब्रीच weak passwords 
                  की वजह से होते हैं। एक मजबूत पासवर्ड आपको हैकर्स, फिशिंग अटैक्स और 
                  आइडेंटिटी थेफ्ट से बचाता है। हर साल लाखों लोग weak passwords की वजह से 
                  अपने important accounts खो देते हैं।
                </p>

                <h4 style={articleSubtitleStyle}>स्ट्रॉन्ग पासवर्ड बनाने के 7 गोल्डन रूल्स</h4>
                
                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>1. लंबाई है सबसे जरूरी (Length Matters)</h5>
                  <p style={articleParagraphStyle}>
                    कम से कम <strong>12 characters</strong> का पासवर्ड बनाएँ। हर एक extra character 
                    password की strength को exponentially बढ़ाता है। 8-character password 
                    को crack करने में कुछ घंटे लगते हैं, जबकि 12-character password को 
                    crack करने में सैकड़ों साल लग सकते हैं। लंबे passwords automated hacking 
                    tools के against ज्यादा secure होते हैं।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>2. करैक्टर वैरायटी जरूरी (Character Variety)</h5>
                  <p style={articleParagraphStyle}>
                    Uppercase (A-Z), lowercase (a-z), numbers (0-9), और symbols (!@#$%) 
                    का मिक्स यूज करें। यह combination password की complexity को बहुत बढ़ा देता है।
                    जितने ज्यादा character types, उतना मजबूत password। Mixed characters 
                    brute force attacks को रोकने में मदद करते हैं।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>3. पर्सनल इनफॉर्मेशन अवॉयड करें</h5>
                  <p style={articleParagraphStyle}>
                    अपना नाम, जन्मतिथि, फोन नंबर, या आसानी से guess होने वाली information 
                    यूज न करें। हैकर्स सोशल मीडिया से आपकी personal information collect 
                    करके आसानी से पासवर्ड guess कर सकते हैं। Pet names, family members 
                    के names, या favorite sports teams से भी बचें।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>4. Common Words और Patterns अवॉयड करें</h5>
                  <p style={articleParagraphStyle}>
                    "password", "123456", "qwerty" जैसे common passwords बिल्कुल न यूज करें। 
                    ये दुनिया के सबसे कमजोर passwords में से हैं। Sequential numbers, 
                    repeated characters, या keyboard patterns भी extremely vulnerable होते हैं।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>5. Unique Passwords हर अकाउंट के लिए</h5>
                  <p style={articleParagraphStyle}>
                    हर online account के लिए अलग-अलग password यूज करें। अगर एक website 
                    का data breach होता है और आपने वही password दूसरे accounts के लिए 
                    यूज किया है, तो सभी accounts risk में आ जाते हैं। Password managers 
                    इस problem को solve करने में help करते हैं।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>6. Regular Password Changes</h5>
                  <p style={articleParagraphStyle}>
                    हर 3-6 महीने में अपने important accounts के passwords change करें। 
                    यह practice आपको potential security threats से बचाती है। Especially 
                    banking, email, और social media accounts के passwords regularly update करें।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>7. Two-Factor Authentication (2FA) Enable करें</h5>
                  <p style={articleParagraphStyle}>
                    Strong password के साथ-साथ always 2FA enable करें। यह extra security 
                    layer provide करता है। Even if कोई आपका password guess कर ले, 
                    तब भी वो आपके account में access नहीं कर पाएगा without second factor।
                  </p>
                </div>

                <h4 style={articleSubtitleStyle}>कॉमन पासवर्ड मिस्टेक्स जो आपको नहीं करनी चाहिए</h4>
                <ul style={articleListStyle}>
                  <li><strong>"123456" या "password"</strong> - दुनिया के सबसे कॉमन पासवर्ड</li>
                  <li><strong>"qwerty" या "asdfgh"</strong> - कीबोर्ड पैटर्न</li>
                  <li><strong>सिंगल वर्ड्स</strong> जो डिक्शनरी में मिलते हैं</li>
                  <li><strong>रिपीटेड करैक्टर्स</strong> जैसे "aaaaaa" या "111111"</li>
                  <li><strong>क्रम में numbers</strong> जैसे "12345678" या "987654"</li>
                  <li><strong>Personal information</strong> जैसे नाम, जन्मतिथि, फोन नंबर</li>
                  <li><strong>Same password</strong> multiple accounts के लिए</li>
                </ul>

                <h4 style={articleSubtitleStyle}>एडवांस्ड पासवर्ड टिप्स फॉर एक्स्ट्रा सिक्योरिटी</h4>
                
                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>Passphrase Technique (सबसे आसान तरीका)</h5>
                  <p style={articleParagraphStyle}>
                    एक आसान तरीका है - कोई meaningful वाक्य लें और उसे code में बदल दें। 
                    उदाहरण: <code>"Mera@Ghar-Delhi-Mei-Hai-2024!"</code><br/>
                    यह लंबा है, याद रखने में आसान है, और crack करने में extremely difficult। 
                    Passphrases में spaces, symbols, और numbers naturally include हो सकते हैं।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>Password Manager यूज करें (जरूरी)</h5>
                  <p style={articleParagraphStyle}>
                    LastPass, Bitwarden, या 1Password जैसे password managers आपके 
                    सभी पासवर्ड्स securely store करते हैं और strong passwords automatically 
                    generate करते हैं। आपको सिर्फ एक master password याद रखना होता है। 
                    यह tools आपको unique, strong passwords हर site के लिए easily manage 
                    करने में help करते हैं।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>Biometric Authentication Add करें</h5>
                  <p style={articleParagraphStyle}>
                    जहाँ possible हो, fingerprint या face recognition जैसे biometric 
                    methods use करें। यह traditional passwords से ज्यादा secure होते हैं 
                    और use करने में आसान होते हैं। Most modern devices और apps इन features 
                    को support करते हैं।
                  </p>
                </div>

                <h4 style={articleSubtitleStyle}>पासवर्ड सेफ्टी चेकलिस्ट - हर बार फॉलो करें</h4>
                <div style={checklistStyle}>
                  <div style={checklistItemStyle}>✓ कम से कम 12 characters लंबा</div>
                  <div style={checklistItemStyle}>✓ Uppercase और lowercase letters</div>
                  <div style={checklistItemStyle}>✓ Numbers और symbols शामिल</div>
                  <div style={checklistItemStyle}>✓ Personal information नहीं</div>
                  <div style={checklistItemStyle}>✓ Common words/patterns नहीं</div>
                  <div style={checklistItemStyle}>✓ हर अकाउंट के लिए अलग पासवर्ड</div>
                  <div style={checklistItemStyle}>✓ Regular interval पर change करें</div>
                  <div style={checklistItemStyle}>✓ 2FA enabled है</div>
                  <div style={checklistItemStyle}>✓ Password manager use कर रहे हैं</div>
                </div>

                <div style={warningBoxStyle}>
                  <h5 style={warningTitleStyle}>⚠️ महत्वपूर्ण सुरक्षा सलाह</h5>
                  <p style={articleParagraphStyle}>
                    <strong>कभी भी एक ही पासवर्ड multiple accounts के लिए यूज न करें।</strong> 
                    अगर एक अकाउंट compromise होता है, तो सभी अकाउंट्स risk में आ जाते हैं। 
                    <strong>हमेशा Two-Factor Authentication (2FA) enable करें</strong> extra security के लिए।
                    Public Wi-Fi पर sensitive accounts access करते समय extra cautious रहें।
                    Regular basis पर अपने accounts की security settings check करते रहें।
                  </p>
                </div>

                <div style={articleConclusionStyle}>
                  <h5 style={conclusionTitleStyle}>निष्कर्ष</h5>
                  <p style={articleParagraphStyle}>
                    एक strong password आपकी ऑनलाइन सिक्योरिटी की नींव है। ऊपर दिए गए tips 
                    follow करके और हमारे Password Generator टूल का यूज करके, आप अपने 
                    सभी ऑनलाइन अकाउंट्स को secure रख सकते हैं। याद रखें - online security 
                    में overconfident न बनें, always extra precautions लें। आपका password 
                    आपकी digital life का key है, इसे strong बनाएँ और safe रखें।
                  </p>
                </div>
              </div>
            </div>
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

            {/* 🔥 AGE CALCULATOR ARTICLE */}
            <div style={articleSectionStyle}>
              <h3 style={articleTitleStyle}>📊 उम्र कैलकुलेशन: पूरी जानकारी और महत्व</h3>
              
              <div style={articleContentStyle}>
                <h4 style={articleSubtitleStyle}>उम्र कैलकुलेशन क्यों महत्वपूर्ण है?</h4>
                <p style={articleParagraphStyle}>
                  उम्र की सही गणना सिर्फ जन्मदिन मनाने तक सीमित नहीं है। यह हमारे जीवन के 
                  कई important aspects में crucial role play करती है - education admissions, 
                  job applications, insurance policies, retirement planning, medical treatments, 
                  और legal documents। सही उम्र का पता होना हमें better life planning में 
                  help करता है और important deadlines miss होने से बचाता है।
                </p>

                <h4 style={articleSubtitleStyle}>उम्र कैलकुलेट करने के विभिन्न तरीके</h4>
                
                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>1. Chronological Age (कालानुक्रमिक उम्र)</h5>
                  <p style={articleParagraphStyle}>
                    यह सबसे common तरीका है जिसमें birth date से current date तक के 
                    सटीक years, months और days calculate किए जाते हैं। यह legal documents 
                    और official purposes के लिए use होता है। Schools, colleges, government 
                    offices, और companies इसी method को follow करते हैं।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>2. Biological Age (जैविक उम्र)</h5>
                  <p style={articleParagraphStyle}>
                    यह आपके शरीर की actual health condition पर depend करता है। 
                    कुछ लोग 40 साल की उम्र में 30 साल के जैसे healthy हो सकते हैं, 
                    जबकि कुछ 30 साल में ही 40 साल के जैसे feel कर सकते हैं। Biological 
                    age आपकी physical fitness, mental health, और overall wellness 
                    को reflect करती है।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>3. Mental Age (मानसिक उम्र)</h5>
                  <p style={articleParagraphStyle}>
                    यह एक person की mental capabilities और cognitive functions को 
                    measure करती है। कुछ लोग अपनी actual age से mentally more mature 
                    होते हैं, जबकि कुछ less mature हो सकते हैं। Psychologists और 
                    educators इस measurement को important मानते हैं।
                  </p>
                </div>

                <h4 style={articleSubtitleStyle}>उम्र से जुड़े रोचक तथ्य और आंकड़े</h4>
                <ul style={articleListStyle}>
                  <li><strong>दुनिया में सबसे कम उम्र के parents</strong> सिर्फ 8 और 9 साल के थे (1939 में Peru में)</li>
                  <li><strong>जापान के लोग</strong> औसतन सबसे लंबी उम्र जीते हैं - 84.3 years</li>
                  <li><strong>18 साल की उम्र</strong> तक इंसान अपनी 50% mental capacity develop कर लेता है</li>
                  <li><strong>25 साल की उम्र</strong> में human brain fully develop हो जाता है</li>
                  <li><strong>30 साल की उम्र</strong> से bone density slowly decrease होना start होती है</li>
                  <li><strong>40 साल की उम्र</strong> के बाद metabolism rate naturally slow down होता है</li>
                  <li><strong>60 साल की उम्र</strong> में average person अपनी life का 75% time already live कर चुका होता है</li>
                </ul>

                <h4 style={articleSubtitleStyle}>Different Countries और Cultures में Age Calculation</h4>
                
                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>International System (अंतर्राष्ट्रीय प्रणाली)</h5>
                  <p style={articleParagraphStyle}>
                    Birth date से current date तक exact calculation। Most countries 
                    इसी system को follow करते हैं। Official documents, passports, 
                    और legal purposes के लिए यही method use होता है।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>South Korea (दक्षिण कोरिया)</h5>
                  <p style={articleParagraphStyle}>
                    जन्म के समय 1 साल माना जाता है + हर नए साल (1 January) में 1 साल बढ़ता है। 
                    इसलिए कोरियन age हमेशा international age से 1 या 2 साल ज्यादा होती है।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>China (Traditional - चीन)</h5>
                  <p style={articleParagraphStyle}>
                    जन्म के समय 1 साल + Chinese New Year पर 1 साल बढ़ता है। 
                    Modern China में अब international system follow किया जाता है, 
                    लेकिन traditional celebrations में अभी भी पुराना system use होता है।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>India (भारत)</h5>
                  <p style={articleParagraphStyle}>
                    Official purposes के लिए international system use किया जाता है। 
                    लेकिन traditional calculations में sometimes birth के time को 
                    consider किया जाता है। Different regions में slightly different 
                    methods हो सकते हैं।
                  </p>
                </div>

                <h4 style={articleSubtitleStyle}>उम्र के हिसाब से Important Life Milestones</h4>
                
                <div style={milestoneGridStyle}>
                  <div style={milestoneItemStyle}>
                    <div style={milestoneAgeStyle}>0-5 Years</div>
                    <div style={milestoneDescStyle}>Early childhood development, learning to walk and talk</div>
                  </div>
                  <div style={milestoneItemStyle}>
                    <div style={milestoneAgeStyle}>6-12 Years</div>
                    <div style={milestoneDescStyle}>Primary education, basic skills development</div>
                  </div>
                  <div style={milestoneItemStyle}>
                    <div style={milestoneAgeStyle}>13-19 Years</div>
                    <div style={milestoneDescStyle}>Teenage years, secondary education, personality development</div>
                  </div>
                  <div style={milestoneItemStyle}>
                    <div style={milestoneAgeStyle}>18-21 Years</div>
                    <div style={milestoneDescStyle}>Legal adulthood, voting rights, higher education</div>
                  </div>
                  <div style={milestoneItemStyle}>
                    <div style={milestoneAgeStyle}>22-30 Years</div>
                    <div style={milestoneDescStyle}>Career building, relationships, financial independence</div>
                  </div>
                  <div style={milestoneItemStyle}>
                    <div style={milestoneAgeStyle}>31-45 Years</div>
                    <div style={milestoneDescStyle}>Family life, career advancement, financial stability</div>
                  </div>
                  <div style={milestoneItemStyle}>
                    <div style={milestoneAgeStyle}>46-60 Years</div>
                    <div style={milestoneDescStyle}>Mid-life, planning for retirement, health maintenance</div>
                  </div>
                  <div style={milestoneItemStyle}>
                    <div style={milestoneAgeStyle}>61+ Years</div>
                    <div style={milestoneDescStyle}>Retirement, grandchildren, enjoying life experiences</div>
                  </div>
                </div>

                <div style={warningBoxStyle}>
                  <h5 style={warningTitleStyle}>💡 महत्वपूर्ण जानकारी और सावधानियां</h5>
                  <p style={articleParagraphStyle}>
                    उम्र की सही गणना legal documents, medical treatments, insurance policies, 
                    और financial planning के लिए extremely important है। हमेशा official 
                    documents में accurate age mention करें। Age-related frauds से बचने 
                    के लिए important documents securely maintain करें। Regular health 
                    checkups करते रहें, especially after 40 years of age। Retirement 
                    planning early age से start कर दें better financial security के लिए।
                  </p>
                </div>

                <div style={articleConclusionStyle}>
                  <h5 style={conclusionTitleStyle}>निष्कर्ष</h5>
                  <p style={articleParagraphStyle}>
                    उम्र सिर्फ एक number नहीं है - यह हमारे experiences, learnings, और 
                    growth का measurement है। सही उम्र calculation हमें better life planning 
                    में help करती है। हमारे Age Calculator tool का use करके आप easily 
                    और accurately अपनी या किसी और की उम्र calculate कर सकते हैं। 
                    Remember - हर उम्र के अपने advantages और opportunities होते हैं, 
                    important यह है कि हम हर age को enjoy करें और उसका maximum benefit लें।
                  </p>
                </div>
              </div>
            </div>
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

            {/* 🔥 BMI CALCULATOR ARTICLE */}
            <div style={articleSectionStyle}>
              <h3 style={articleTitleStyle}>⚖️ BMI (Body Mass Index) कंप्लीट गाइड - स्वास्थ्य का विज्ञान</h3>
              
              <div style={articleContentStyle}>
                <h4 style={articleSubtitleStyle}>BMI क्या है और यह क्यों महत्वपूर्ण है?</h4>
                <p style={articleParagraphStyle}>
                  BMI (Body Mass Index) एक simple calculation है जो किसी person की 
                  height के हिसाब से उनके healthy weight range को determine करता है। 
                  यह worldwide doctors और health professionals द्वारा use किया जाने वाला 
                  एक standard measurement tool है। BMI calculation 1830s में Belgian 
                  mathematician Adolphe Quetelet द्वारा develop किया गया था और since then 
                  यह global health assessment का important part बन गया है।
                </p>

                <h4 style={articleSubtitleStyle}>BMI Calculation का फॉर्मूला</h4>
                <div style={formulaBoxStyle}>
                  <h5 style={formulaTitleStyle}>BMI Formula (मीट्रिक सिस्टम)</h5>
                  <p style={formulaStyle}>BMI = weight (kg) / [height (m)]²</p>
                  <p style={formulaExampleStyle}>Example: 65 kg weight, 1.70 m height → BMI = 65 / (1.70 × 1.70) = 22.5</p>
                </div>

                <div style={formulaBoxStyle}>
                  <h5 style={formulaTitleStyle}>BMI Formula (इम्पीरियल सिस्टम)</h5>
                  <p style={formulaStyle}>BMI = [weight (lbs) / [height (inches)]²] × 703</p>
                  <p style={formulaExampleStyle}>Example: 150 lbs weight, 68 inches height → BMI = [150 / (68 × 68)] × 703 = 22.8</p>
                </div>

                <h4 style={articleSubtitleStyle}>BMI Categories की पूरी जानकारी (WHO Standards)</h4>
                
                <div style={bmiTableStyle}>
                  <div style={bmiTableRowStyle}>
                    <div style={bmiTableHeaderStyle}>BMI Range</div>
                    <div style={bmiTableHeaderStyle}>Category</div>
                    <div style={bmiTableHeaderStyle}>Health Risk</div>
                    <div style={bmiTableHeaderStyle}>Recommended Action</div>
                  </div>
                  <div style={bmiTableRowStyle}>
                    <div style={{...bmiTableCellStyle, backgroundColor: '#4ade80'}}>18.5 से कम</div>
                    <div style={bmiTableCellStyle}>Underweight</div>
                    <div style={bmiTableCellStyle}>High</div>
                    <div style={bmiTableCellStyle}>Consult doctor, balanced diet</div>
                  </div>
                  <div style={bmiTableRowStyle}>
                    <div style={{...bmiTableCellStyle, backgroundColor: '#22c55e'}}>18.5 - 24.9</div>
                    <div style={bmiTableCellStyle}>Normal Weight</div>
                    <div style={bmiTableCellStyle}>Low</div>
                    <div style={bmiTableCellStyle}>Maintain healthy lifestyle</div>
                  </div>
                  <div style={bmiTableRowStyle}>
                    <div style={{...bmiTableCellStyle, backgroundColor: '#f59e0b'}}>25 - 29.9</div>
                    <div style={bmiTableCellStyle}>Overweight</div>
                    <div style={bmiTableCellStyle}>Medium</div>
                    <div style={bmiTableCellStyle}>Exercise, diet control</div>
                  </div>
                  <div style={bmiTableRowStyle}>
                    <div style={{...bmiTableCellStyle, backgroundColor: '#ef4444'}}>30 या ज्यादा</div>
                    <div style={bmiTableCellStyle}>Obese</div>
                    <div style={bmiTableCellStyle}>High</div>
                    <div style={bmiTableCellStyle}>Medical consultation needed</div>
                  </div>
                </div>

                <h4 style={articleSubtitleStyle}>BMI के Limitations और Important Considerations</h4>
                <p style={articleParagraphStyle}>
                  BMI एक useful screening tool है लेकिन perfect नहीं है। कुछ important 
                  limitations जो आपको जाननी चाहिए:
                </p>
                
                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>1. Muscle Mass vs Fat Mass</h5>
                  <p style={articleParagraphStyle}>
                    BMI नहीं differentiate करता between muscle mass और fat mass। 
                    Athletes और muscular लोगों का BMI high आ सकता है जबकि वो perfectly 
                    healthy होते हैं। Muscle fat से denser और heavier होता है।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>2. Age और Gender Factors</h5>
                  <p style={articleParagraphStyle}>
                    Same BMI different ages और genders में different meanings हो सकती है। 
                    Elderly people का naturally higher body fat percentage होता है। 
                    Women का men की compared to naturally higher body fat percentage होता है।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>3. Body Frame Size</h5>
                  <p style={articleParagraphStyle}>
                    Body frame size (small, medium, large) BMI interpretation को affect 
                    करती है। Same height और weight के दो persons different body frames 
                    के साथ different health conditions में हो सकते हैं।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>4. Ethnicity और Genetic Factors</h5>
                  <p style={articleParagraphStyle}>
                    Different ethnic groups के लिए ideal BMI range slightly different 
                    हो सकती है। Asian populations के लिए lower BMI thresholds sometimes 
                    recommended होते हैं।
                  </p>
                </div>

                <h4 style={articleSubtitleStyle}>Healthy BMI Maintain करने के Practical Tips</h4>
                
                <div style={tipsGridStyle}>
                  <div style={healthTipStyle}>
                    <div style={healthTipIconStyle}>🥗</div>
                    <div style={healthTipContentStyle}>
                      <h5 style={healthTipTitleStyle}>Balanced Diet</h5>
                      <p style={healthTipDescStyle}>Fruits, vegetables, whole grains, lean proteins का balanced mix</p>
                    </div>
                  </div>
                  <div style={healthTipStyle}>
                    <div style={healthTipIconStyle}>🏃‍♂️</div>
                    <div style={healthTipContentStyle}>
                      <h5 style={healthTipTitleStyle}>Regular Exercise</h5>
                      <p style={healthTipDescStyle}>कम से कम 150 minutes moderate exercise per week</p>
                    </div>
                  </div>
                  <div style={healthTipStyle}>
                    <div style={healthTipIconStyle}>💧</div>
                    <div style={healthTipContentStyle}>
                      <h5 style={healthTipTitleStyle}>Adequate Hydration</h5>
                      <p style={healthTipDescStyle}>दिन में 8-10 glasses water, avoid sugary drinks</p>
                    </div>
                  </div>
                  <div style={healthTipStyle}>
                    <div style={healthTipIconStyle}>😴</div>
                    <div style={healthTipContentStyle}>
                      <h5 style={healthTipTitleStyle}>Quality Sleep</h5>
                      <p style={healthTipDescStyle}>7-8 hours restful sleep per night</p>
                    </div>
                  </div>
                  <div style={healthTipStyle}>
                    <div style={healthTipIconStyle}>🧘‍♀️</div>
                    <div style={healthTipContentStyle}>
                      <h5 style={healthTipTitleStyle}>Stress Management</h5>
                      <p style={healthTipDescStyle}>Meditation, yoga, hobbies for mental health</p>
                    </div>
                  </div>
                  <div style={healthTipStyle}>
                    <div style={healthTipIconStyle}>📊</div>
                    <div style={healthTipContentStyle}>
                      <h5 style={healthTipTitleStyle}>Regular Checkups</h5>
                      <p style={healthTipDescStyle}>Annual health checkups और monitoring</p>
                    </div>
                  </div>
                </div>

                <h4 style={articleSubtitleStyle}>BMI और Overall Health - The Big Picture</h4>
                <p style={articleParagraphStyle}>
                  BMI एक useful starting point है, लेकिन complete health assessment के लिए 
                  other factors भी consider करने चाहिए:
                </p>
                
                <ul style={articleListStyle}>
                  <li><strong>Waist Circumference:</strong> Abdominal fat का better indicator</li>
                  <li><strong>Body Fat Percentage:</strong> Actual fat content measurement</li>
                  <li><strong>Blood Pressure:</strong> Cardiovascular health indicator</li>
                  <li><strong>Cholesterol Levels:</strong> Heart disease risk assessment</li>
                  <li><strong>Blood Sugar Levels:</strong> Diabetes risk evaluation</li>
                  <li><strong>Physical Fitness:</strong> Strength, endurance, flexibility</li>
                  <li><strong>Mental Well-being:</strong> Stress levels, sleep quality, happiness</li>
                </ul>

                <div style={warningBoxStyle}>
                  <h5 style={warningTitleStyle}>⚠️ Medical Disclaimer - Important Notice</h5>
                  <p style={articleParagraphStyle}>
                    यह BMI calculator एक general guidance और educational tool है। 
                    किसी भी health concern, medical condition, या weight management 
                    program के लिए qualified medical professional या registered dietitian 
                    से consult करें। यह tool medical diagnosis, treatment, या professional 
                    medical advice का substitute नहीं है। Individual health conditions 
                    के लिए personalized medical consultation essential है।
                  </p>
                </div>

                <div style={articleConclusionStyle}>
                  <h5 style={conclusionTitleStyle}>निष्कर्ष</h5>
                  <p style={articleParagraphStyle}>
                    BMI एक valuable screening tool है जो healthy weight range understand 
                    करने में help करता है। लेकिन यह complete health picture नहीं दिखाता। 
                    Balanced diet, regular exercise, adequate sleep, और stress management 
                    - ये सभी factors मिलकर overall health determine करते हैं। हमारे 
                    BMI Calculator का use करके आप अपना current status check कर सकते हैं, 
                    लेकिन any concerns के लिए always healthcare professional से consult करें। 
                    Remember - health एक journey है, destination नहीं। Small, consistent 
                    steps लेते रहें better health की ओर।
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      // ... बाकी tools के लिए similar pattern में articles add करें ...

      default:
        return null;
    }
  };

  // 🔥 NEW STYLES FOR ARTICLES
  const articleSectionStyle = {
    marginTop: '3rem',
    padding: '2rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const articleTitleStyle = {
    color: '#1e293b',
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    textAlign: 'center',
    lineHeight: '1.4'
  };

  const articleContentStyle = {
    lineHeight: '1.7',
    fontSize: '16px'
  };

  const articleSubtitleStyle = {
    color: '#2563eb',
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '2rem 0 1rem 0',
    borderBottom: '2px solid #2563eb',
    paddingBottom: '0.5rem'
  };

  const articleParagraphStyle = {
    color: '#374151',
    fontSize: '1rem',
    marginBottom: '1rem',
    textAlign: 'left',
    lineHeight: '1.6'
  };

  const tipBoxStyle = {
    backgroundColor: '#dbeafe',
    padding: '1.5rem',
    borderRadius: '8px',
    margin: '1.5rem 0',
    borderLeft: '4px solid #2563eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const tipTitleStyle = {
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontSize: '1.1rem'
  };

  const articleListStyle = {
    color: '#374151',
    paddingLeft: '1.5rem',
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  };

  const checklistStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '0.75rem',
    margin: '1.5rem 0'
  };

  const checklistItemStyle = {
    backgroundColor: '#dcfce7',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    color: '#166534',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const warningBoxStyle = {
    backgroundColor: '#fef3c7',
    padding: '1.5rem',
    borderRadius: '8px',
    margin: '1.5rem 0',
    borderLeft: '4px solid '#d97706',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const warningTitleStyle = {
    color: '#92400e',
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontSize: '1.1rem'
  };

  const articleConclusionStyle = {
    backgroundColor: '#f0f9ff',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '2px solid #bae6fd',
    marginTop: '2rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const conclusionTitleStyle = {
    color: '#0369a1',
    fontWeight: '600',
    marginBottom: '1rem',
    fontSize: '1.2rem'
  };

  const bmiTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '1.5rem 0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const bmiTableRowStyle = {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb'
  };

  const bmiTableHeaderStyle = {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: '0.9rem'
  };

  const bmiTableCellStyle = {
    flex: 1,
    padding: '0.75rem',
    textAlign: 'center',
    backgroundColor: 'white',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const formulaBoxStyle = {
    backgroundColor: '#f1f5f9',
    padding: '1.5rem',
    borderRadius: '8px',
    margin: '1rem 0',
    border: '1px solid #cbd5e1'
  };

  const formulaTitleStyle = {
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: '0.5rem'
  };

  const formulaStyle = {
    fontFamily: 'monospace',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: '1rem',
    borderRadius: '4px',
    margin: '0.5rem 0',
    fontSize: '1.1rem',
    textAlign: 'center'
  };

  const formulaExampleStyle = {
    color: '#64748b',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    marginTop: '0.5rem'
  };

  const milestoneGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    margin: '1.5rem 0'
  };

  const milestoneItemStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const milestoneAgeStyle = {
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: '0.5rem',
    fontSize: '1rem'
  };

  const milestoneDescStyle = {
    color: '#64748b',
    fontSize: '0.9rem',
    lineHeight: '1.4'
  };

  const tipsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    margin: '1.5rem 0'
  };

  const healthTipStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const healthTipIconStyle = {
    fontSize: '1.5rem',
    flexShrink: 0
  };

  const healthTipContentStyle = {
    flex: 1
  };

  const healthTipTitleStyle = {
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem'
  };

  const healthTipDescStyle = {
    color: '#64748b',
    fontSize: '0.9rem',
    lineHeight: '1.4'
  };

  // ... बाकी existing styles वही रहेंगे ...

  return (
    <Layout>
      <Head>
        <title>Multi Tool Hub | 20+ Free Online Tools & Utilities</title>
        <meta 
          name="description" 
          content="Free online tools collection with detailed educational articles - Password Generator, Age Calculator, BMI Calculator, Word Counter, Base64 Encoder and 15+ more tools with complete guides." 
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

// ... बाकी existing styles वही रहेंगे ...
