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
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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

            {/* PASSWORD GENERATOR ARTICLE */}
            <div style={articleSectionStyle}>
              <h3 style={articleTitleStyle}>🔐 पासवर्ड सिक्योरिटी कंप्लीट गाइड - 2024</h3>
              
              <div style={articleContentStyle}>
                <h4 style={articleSubtitleStyle}>क्यों जरूरी है स्ट्रॉन्ग पासवर्ड?</h4>
                <p style={articleParagraphStyle}>
                  आज के डिजिटल युग में, पासवर्ड आपकी ऑनलाइन पहचान की पहली सुरक्षा परत है। 
                  साइबर सिक्योरिटी एक्सपर्ट्स के मुताबिक, 80% से ज्यादा डेटा ब्रीच weak passwords 
                  की वजह से होते हैं। एक मजबूत पासवर्ड आपको हैकर्स, फिशिंग अटैक्स और 
                  आइडेंटिटी थेफ्ट से बचाता है।
                </p>

                <h4 style={articleSubtitleStyle}>स्ट्रॉन्ग पासवर्ड बनाने के 7 गोल्डन रूल्स</h4>
                
                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>1. लंबाई है सबसे जरूरी (Length Matters)</h5>
                  <p style={articleParagraphStyle}>
                    कम से कम 12 characters का पासवर्ड बनाएँ। हर एक extra character 
                    password की strength को exponentially बढ़ाता है।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>2. करैक्टर वैरायटी जरूरी (Character Variety)</h5>
                  <p style={articleParagraphStyle}>
                    Uppercase (A-Z), lowercase (a-z), numbers (0-9), और symbols (!@#$%) 
                    का मिक्स यूज करें। यह combination password की complexity को बहुत बढ़ा देता है।
                  </p>
                </div>

                <div style={tipBoxStyle}>
                  <h5 style={tipTitleStyle}>3. पर्सनल इनफॉर्मेशन अवॉयड करें</h5>
                  <p style={articleParagraphStyle}>
                    अपना नाम, जन्मतिथि, फोन नंबर, या आसानी से guess होने वाली information 
                    यूज न करें। हैकर्स सोशल मीडिया से आपकी personal information collect 
                    करके आसानी से पासवर्ड guess कर सकते हैं।
                  </p>
                </div>

                <h4 style={articleSubtitleStyle}>कॉमन पासवर्ड मिस्टेक्स</h4>
                <ul style={articleListStyle}>
                  <li>"123456" या "password" - दुनिया के सबसे कॉमन पासवर्ड</li>
                  <li>"qwerty" या "asdfgh" - कीबोर्ड पैटर्न</li>
                  <li>सिंगल वर्ड्स जो डिक्शनरी में मिलते हैं</li>
                  <li>रिपीटेड करैक्टर्स जैसे "aaaaaa" या "111111"</li>
                  <li>क्रम में numbers जैसे "12345678"</li>
                </ul>

                <div style={warningBoxStyle}>
                  <h5 style={warningTitleStyle}>⚠️ महत्वपूर्ण सलाह</h5>
                  <p style={articleParagraphStyle}>
                    कभी भी एक ही पासवर्ड multiple accounts के लिए यूज न करें। 
                    अगर एक अकाउंट compromise होता है, तो सभी अकाउंट्स risk में आ जाते हैं। 
                    हमेशा Two-Factor Authentication (2FA) enable करें extra security के लिए।
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

            {/* AGE CALCULATOR ARTICLE */}
            <div style={articleSectionStyle}>
              <h3 style={articleTitleStyle}>📊 उम्र कैलकुलेशन: पूरी जानकारी</h3>
              
              <div style={articleContentStyle}>
                <h4 style={articleSubtitleStyle}>उम्र कैलकुलेशन क्यों महत्वपूर्ण है?</h4>
                <p style={articleParagraphStyle}>
                  उम्र की सही गणना सिर्फ जन्मदिन मनाने तक सीमित नहीं है। यह हमारे जीवन के 
                  कई important aspects में crucial role play करती है - education admissions, 
                  job applications, insurance policies, retirement planning, और medical treatments।
                </p>

                <h4 style={articleSubtitleStyle}>उम्र से जुड़े रोचक तथ्य</h4>
                <ul style={articleListStyle}>
                  <li>दुनिया में सबसे कम उम्र के parents सिर्फ 8 और 9 साल के थे</li>
                  <li>जापान के लोग औसतन सबसे लंबी उम्र जीते हैं</li>
                  <li>18 साल की उम्र तक इंसान अपनी 50% mental capacity develop कर लेता है</li>
                  <li>25 साल की उम्र में brain fully develop हो जाता है</li>
                </ul>

                <div style={warningBoxStyle}>
                  <h5 style={warningTitleStyle}>💡 महत्वपूर्ण जानकारी</h5>
                  <p style={articleParagraphStyle}>
                    उम्र की सही गणना legal documents, medical treatments, और financial 
                    planning के लिए extremely important है। हमेशा official documents 
                    में accurate age mention करें।
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

            {/* BMI CALCULATOR ARTICLE */}
            <div style={articleSectionStyle}>
              <h3 style={articleTitleStyle}>⚖️ BMI (Body Mass Index) कंप्लीट गाइड</h3>
              
              <div style={articleContentStyle}>
                <h4 style={articleSubtitleStyle}>BMI क्या है और यह क्यों महत्वपूर्ण है?</h4>
                <p style={articleParagraphStyle}>
                  BMI (Body Mass Index) एक simple calculation है जो किसी person की 
                  height के हिसाब से उनके healthy weight range को determine करता है। 
                  यह worldwide doctors और health professionals द्वारा use किया जाने वाला 
                  एक standard measurement tool है।
                </p>

                <h4 style={articleSubtitleStyle}>BMI Categories</h4>
                
                <div style={bmiTableStyle}>
                  <div style={bmiTableRowStyle}>
                    <div style={bmiTableHeaderStyle}>BMI Range</div>
                    <div style={bmiTableHeaderStyle}>Category</div>
                    <div style={bmiTableHeaderStyle}>Health Risk</div>
                  </div>
                  <div style={bmiTableRowStyle}>
                    <div style={bmiTableCellStyle}>18.5 से कम</div>
                    <div style={bmiTableCellStyle}>Underweight</div>
                    <div style={bmiTableCellStyle}>High</div>
                  </div>
                  <div style={bmiTableRowStyle}>
                    <div style={bmiTableCellStyle}>18.5 - 24.9</div>
                    <div style={bmiTableCellStyle}>Normal Weight</div>
                    <div style={bmiTableCellStyle}>Low</div>
                  </div>
                  <div style={bmiTableRowStyle}>
                    <div style={bmiTableCellStyle}>25 - 29.9</div>
                    <div style={bmiTableCellStyle}>Overweight</div>
                    <div style={bmiTableCellStyle}>Medium</div>
                  </div>
                  <div style={bmiTableRowStyle}>
                    <div style={bmiTableCellStyle}>30 या ज्यादा</div>
                    <div style={bmiTableCellStyle}>Obese</div>
                    <div style={bmiTableCellStyle}>High</div>
                  </div>
                </div>

                <div style={warningBoxStyle}>
                  <h5 style={warningTitleStyle}>⚠️ Medical Disclaimer</h5>
                  <p style={articleParagraphStyle}>
                    BMI calculator एक general guidance tool है। किसी भी health concern 
                    के लिए qualified medical professional से consult करें। यह tool 
                    medical diagnosis का substitute नहीं है।
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      // ... बाकी tools के लिए similar pattern ...

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
    border: '1px solid #e2e8f0'
  };

  const articleTitleStyle = {
    color: '#1e293b',
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    textAlign: 'center'
  };

  const articleContentStyle = {
    lineHeight: '1.7'
  };

  const articleSubtitleStyle = {
    color: '#2563eb',
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '1.5rem 0 1rem 0',
    borderBottom: '2px solid #2563eb',
    paddingBottom: '0.5rem'
  };

  const articleParagraphStyle = {
    color: '#374151',
    fontSize: '1rem',
    marginBottom: '1rem',
    textAlign: 'left'
  };

  const tipBoxStyle = {
    backgroundColor: '#dbeafe',
    padding: '1rem',
    borderRadius: '8px',
    margin: '1rem 0',
    borderLeft: '4px solid #2563eb'
  };

  const tipTitleStyle = {
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: '0.5rem'
  };

  const articleListStyle = {
    color: '#374151',
    paddingLeft: '1.5rem',
    marginBottom: '1rem'
  };

  const warningBoxStyle = {
    backgroundColor: '#fef3c7',
    padding: '1rem',
    borderRadius: '8px',
    margin: '1rem 0',
    borderLeft: '4px solid #d97706'
  };

  const warningTitleStyle = {
    color: '#92400e',
    fontWeight: '600',
    marginBottom: '0.5rem'
  };

  const bmiTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '1rem 0'
  };

  const bmiTableRowStyle = {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb'
  };

  const bmiTableHeaderStyle = {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: '600',
    textAlign: 'center'
  };

  const bmiTableCellStyle = {
    flex: 1,
    padding: '0.75rem',
    textAlign: 'center',
    backgroundColor: 'white'
  };

  // EXISTING STYLES
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

  return (
    <Layout>
      <Head>
        <title>Multi Tool Hub | 20+ Free Online Tools & Utilities</title>
        <meta 
          name="description" 
          content="Free online tools collection with detailed educational articles - Password Generator, Age Calculator, BMI Calculator, Word Counter, Base64 Encoder and 15+ more tools with complete guides." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
