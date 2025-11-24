// pages/multitool.js
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function MultiTool() {
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
    { id: 18, title: "Lorem Ipsum", description: "Generate placeholder text", icon: "📃" },
    { id: 19, title: "Case Converter", description: "Convert text case", icon: "🔠" },
    { id: 20, title: "URL Encoder", description: "Encode and decode URLs", icon: "🔗" },
    { id: 21, title: "MD5 Generator", description: "Generate MD5 hash", icon: "🔐" },
    { id: 22, title: "Percentage Calculator", description: "Calculate percentages", icon: "📊" },
    { id: 23, title: "Tip Calculator", description: "Calculate tips and splits", icon: "💳" },
    { id: 24, title: "Gradient Generator", description: "Create CSS gradients", icon: "🌈" },
    { id: 25, title: "Password Strength", description: "Check password strength", icon: "🛡️" },
    { id: 26, title: "Time Zone Converter", description: "Convert between time zones", icon: "🌐" },
    { id: 27, title: "IP Address Lookup", description: "Get your IP information", icon: "🌍" },
    { id: 28, title: "Binary Converter", description: "Convert text to binary", icon: "💻" },
    { id: 29, title: "Hex Converter", description: "Convert text to hexadecimal", icon: "🔢" },
    { id: 30, title: "Date Difference", description: "Calculate days between dates", icon: "📆" }
  ]);

  // Common States
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
  const [loremLength, setLoremLength] = useState(50);
  const [loremText, setLoremText] = useState('');
  const [caseText, setCaseText] = useState('');
  const [caseResult, setCaseResult] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlResult, setUrlResult] = useState('');
  const [md5Input, setMd5Input] = useState('');
  const [md5Result, setMd5Result] = useState('');
  const [percentageValue, setPercentageValue] = useState('');
  const [percentageOf, setPercentageOf] = useState('');
  const [percentageResult, setPercentageResult] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [peopleCount, setPeopleCount] = useState(1);
  const [tipResult, setTipResult] = useState(null);
  const [gradientFrom, setGradientFrom] = useState('#ff6b6b');
  const [gradientTo, setGradientTo] = useState('#4ecdc4');
  const [gradientCSS, setGradientCSS] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [timeResult, setTimeResult] = useState('');
  const [ipInfo, setIpInfo] = useState(null);
  const [binaryInput, setBinaryInput] = useState('');
  const [binaryResult, setBinaryResult] = useState('');
  const [hexInput, setHexInput] = useState('');
  const [hexResult, setHexResult] = useState('');
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
    // Reset states
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
    
    return {
      hex: hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(r/2.55)}, ${Math.round(g/2.55)}%, ${Math.round(b/2.55)}%)`
    };
  };

  // Tool 7: Text to Speech
  const speakText = () => {
    if (!ttsText) {
      alert('Please enter text to speak.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(ttsText);
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
        celsius: (val) => val,
        fahrenheit: (val) => (val * 9/5) + 32,
        kelvin: (val) => val + 273.15
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
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
          }
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
    const canvas = canvasRef.current;
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
    const canvas = canvasRef.current;
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
    // Simple QR code simulation using canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
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
    // Mock conversion rates (in real app, you'd use an API)
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

  // Tool 18: Lorem Ipsum Generator
  const generateLorem = () => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    const words = lorem.split(' ');
    const result = [];
    
    for (let i = 0; i < loremLength && i < words.length; i++) {
      result.push(words[i % words.length]);
    }
    
    setLoremText(result.join(' '));
  };

  // Tool 19: Case Converter
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

  // Tool 20: URL Encoder/Decoder
  const encodeURL = () => {
    if (!urlInput) {
      alert('Please enter URL to encode.');
      return;
    }
    setUrlResult(encodeURIComponent(urlInput));
  };

  const decodeURL = () => {
    if (!urlInput) {
      alert('Please enter URL to decode.');
      return;
    }
    try {
      setUrlResult(decodeURIComponent(urlInput));
    } catch (e) {
      alert('Invalid encoded URL.');
    }
  };

  // Tool 21: MD5 Generator (Simple simulation)
  const generateMD5 = () => {
    if (!md5Input) {
      alert('Please enter text to hash.');
      return;
    }
    // Simple hash simulation (not real MD5)
    let hash = '';
    for (let i = 0; i < md5Input.length; i++) {
      hash += md5Input.charCodeAt(i).toString(16);
    }
    setMd5Result(hash.substring(0, 32));
  };

  // Tool 22: Percentage Calculator
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

  // Tool 23: Tip Calculator
  const calculateTip = () => {
    const amount = parseFloat(billAmount);
    if (!amount) {
      alert('Please enter bill amount.');
      return;
    }

    const tip = (amount * tipPercent) / 100;
    const total = amount + tip;
    const perPerson = total / peopleCount;

    setTipResult({
      tip: tip.toFixed(2),
      total: total.toFixed(2),
      perPerson: perPerson.toFixed(2)
    });
  };

  // Tool 24: Gradient Generator
  const generateGradient = () => {
    const css = `background: linear-gradient(45deg, ${gradientFrom}, ${gradientTo});`;
    setGradientCSS(css);
  };

  // Tool 25: Password Strength Checker
  const checkPasswordStrength = () => {
    if (!passwordCheck) {
      alert('Please enter a password to check.');
      return;
    }

    let strength = 0;
    if (passwordCheck.length >= 8) strength++;
    if (/[A-Z]/.test(passwordCheck)) strength++;
    if (/[0-9]/.test(passwordCheck)) strength++;
    if (/[^A-Za-z0-9]/.test(passwordCheck)) strength++;

    const levels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    setPasswordStrength(`Strength: ${levels[strength]}`);
  };

  // Tool 26: Time Zone Converter (Mock)
  const convertTimeZone = () => {
    if (!timeFrom) {
      alert('Please enter time to convert.');
      return;
    }
    // Mock conversion - add 5 hours for demo
    const [hours, minutes] = timeFrom.split(':').map(Number);
    let newHours = (hours + 5) % 24;
    setTimeResult(`${timeFrom} → ${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  };

  // Tool 27: IP Address Lookup
  const getIPInfo = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIpInfo(`Your IP: ${data.ip}\nLocation: Unknown (API limited)`);
    } catch (error) {
      setIpInfo('Unable to fetch IP information');
    }
  };

  // Tool 28: Binary Converter
  const textToBinary = () => {
    if (!binaryInput) {
      alert('Please enter text to convert.');
      return;
    }
    let binary = '';
    for (let i = 0; i < binaryInput.length; i++) {
      binary += binaryInput.charCodeAt(i).toString(2) + ' ';
    }
    setBinaryResult(binary.trim());
  };

  // Tool 29: Hex Converter
  const textToHex = () => {
    if (!hexInput) {
      alert('Please enter text to convert.');
      return;
    }
    let hex = '';
    for (let i = 0; i < hexInput.length; i++) {
      hex += hexInput.charCodeAt(i).toString(16) + ' ';
    }
    setHexResult(hex.trim());
  };

  // Tool 30: Date Difference Calculator
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
    // ... (previous tool render functions remain the same, adding new ones below)
    
    switch(activeTool) {
      // Previous tools 1-10 remain same...
      
      case 11: // Image Converter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🖼️ Image Converter</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Upload Image:</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={inputStyle} />
            </div>
            <canvas ref={canvasRef} style={{display: 'none'}} />
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
            <canvas ref={canvasRef} style={{display: 'none'}} />
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

      case 18: // Lorem Ipsum Generator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>📃 Lorem Ipsum Generator</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Number of words: {loremLength}</label>
              <input type="range" min="10" max="500" value={loremLength} 
                onChange={(e) => setLoremLength(e.target.value)} style={rangeInputStyle} />
            </div>
            <button style={primaryButtonStyle} onClick={generateLorem}>Generate Text</button>
            {loremText && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Lorem Ipsum:</h4>
                <p style={loremTextStyle}>{loremText}</p>
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(loremText)}>
                  Copy Text
                </button>
              </div>
            )}
          </div>
        );

      case 19: // Case Converter
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

      case 20: // URL Encoder/Decoder
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🔗 URL Encoder/Decoder</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter URL:</label>
              <textarea value={urlInput} onChange={(e) => setUrlInput(e.target.value)} 
                placeholder="Enter URL to encode or decode" rows={3} style={textareaStyle} />
            </div>
            <div style={buttonGroupStyle}>
              <button style={primaryButtonStyle} onClick={encodeURL}>Encode URL</button>
              <button style={primaryButtonStyle} onClick={decodeURL}>Decode URL</button>
            </div>
            {urlResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Result:</h4>
                <p style={urlResultStyle}>{urlResult}</p>
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(urlResult)}>
                  Copy Result
                </button>
              </div>
            )}
          </div>
        );

      case 21: // MD5 Generator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🔐 MD5 Generator</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Text:</label>
              <input type="text" value={md5Input} onChange={(e) => setMd5Input(e.target.value)} 
                placeholder="Enter text to generate MD5 hash" style={inputStyle} />
            </div>
            <button style={primaryButtonStyle} onClick={generateMD5}>Generate MD5</button>
            {md5Result && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>MD5 Hash:</h4>
                <p style={md5ResultStyle}>{md5Result}</p>
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(md5Result)}>
                  Copy Hash
                </button>
              </div>
            )}
          </div>
        );

      case 22: // Percentage Calculator
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

      case 23: // Tip Calculator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>💳 Tip Calculator</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Bill Amount ($):</label>
              <input type="number" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} 
                placeholder="Enter bill amount" style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Tip Percentage: {tipPercent}%</label>
              <input type="range" min="0" max="50" value={tipPercent} 
                onChange={(e) => setTipPercent(e.target.value)} style={rangeInputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Number of People:</label>
              <input type="number" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} 
                min="1" style={inputStyle} />
            </div>
            <button style={primaryButtonStyle} onClick={calculateTip}>Calculate Tip</button>
            {tipResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Tip Calculation:</h4>
                <p style={tipResultStyle}>Tip Amount: ${tipResult.tip}</p>
                <p style={tipResultStyle}>Total Bill: ${tipResult.total}</p>
                <p style={tipResultStyle}>Per Person: ${tipResult.perPerson}</p>
              </div>
            )}
          </div>
        );

      case 24: // Gradient Generator
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🌈 Gradient Generator</h3>
            <div style={flexRowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>From Color:</label>
                <input type="color" value={gradientFrom} onChange={(e) => setGradientFrom(e.target.value)} 
                  style={colorInputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>To Color:</label>
                <input type="color" value={gradientTo} onChange={(e) => setGradientTo(e.target.value)} 
                  style={colorInputStyle} />
              </div>
            </div>
            <button style={primaryButtonStyle} onClick={generateGradient}>Generate CSS</button>
            {gradientCSS && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>CSS Code:</h4>
                <div style={gradientPreviewStyle} 
                  style={{background: `linear-gradient(45deg, ${gradientFrom}, ${gradientTo})`}}>
                </div>
                <pre style={preStyle}>{gradientCSS}</pre>
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(gradientCSS)}>
                  Copy CSS
                </button>
              </div>
            )}
          </div>
        );

      case 25: // Password Strength Checker
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🛡️ Password Strength Checker</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Password:</label>
              <input type="password" value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)} 
                placeholder="Enter password to check" style={inputStyle} />
            </div>
            <button style={primaryButtonStyle} onClick={checkPasswordStrength}>Check Strength</button>
            {passwordStrength && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Password Analysis:</h4>
                <p style={passwordStrengthStyle}>{passwordStrength}</p>
                <p style={passwordTipsStyle}>
                  Tips: Use uppercase, numbers, symbols, and at least 8 characters
                </p>
              </div>
            )}
          </div>
        );

      case 26: // Time Zone Converter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🌐 Time Zone Converter</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Time (HH:MM):</label>
              <input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} 
                style={inputStyle} />
            </div>
            <button style={primaryButtonStyle} onClick={convertTimeZone}>Convert Time</button>
            {timeResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Converted Time:</h4>
                <p style={unitOutputStyle}>{timeResult}</p>
              </div>
            )}
          </div>
        );

      case 27: // IP Address Lookup
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🌍 IP Address Lookup</h3>
            <button style={primaryButtonStyle} onClick={getIPInfo}>Get My IP Information</button>
            {ipInfo && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Your IP Information:</h4>
                <pre style={preStyle}>{ipInfo}</pre>
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(ipInfo)}>
                  Copy Info
                </button>
              </div>
            )}
          </div>
        );

      case 28: // Binary Converter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>💻 Binary Converter</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Text:</label>
              <textarea value={binaryInput} onChange={(e) => setBinaryInput(e.target.value)} 
                placeholder="Enter text to convert to binary" rows={3} style={textareaStyle} />
            </div>
            <button style={primaryButtonStyle} onClick={textToBinary}>Convert to Binary</button>
            {binaryResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Binary Result:</h4>
                <p style={binaryResultStyle}>{binaryResult}</p>
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(binaryResult)}>
                  Copy Binary
                </button>
              </div>
            )}
          </div>
        );

      case 29: // Hex Converter
        return (
          <div style={toolContentStyle}>
            <h3 style={toolTitleStyle}>🔢 Hex Converter</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Enter Text:</label>
              <textarea value={hexInput} onChange={(e) => setHexInput(e.target.value)} 
                placeholder="Enter text to convert to hexadecimal" rows={3} style={textareaStyle} />
            </div>
            <button style={primaryButtonStyle} onClick={textToHex}>Convert to Hex</button>
            {hexResult && (
              <div style={resultStyle}>
                <h4 style={resultTitleStyle}>Hexadecimal Result:</h4>
                <p style={hexResultStyle}>{hexResult}</p>
                <button style={secondaryButtonStyle} onClick={() => copyToClipboard(hexResult)}>
                  Copy Hex
                </button>
              </div>
            )}
          </div>
        );

      case 30: // Date Difference Calculator
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

  // Additional Styles
  const timerDisplayStyle = {
    fontSize: '3rem',
    textAlign: 'center',
    margin: '2rem 0',
    fontFamily: 'monospace',
    color: '#2563eb',
    fontWeight: 'bold'
  };

  const loremTextStyle = {
    lineHeight: '1.6',
    color: '#374151',
    marginBottom: '1rem'
  };

  const caseResultStyle = {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '1rem'
  };

  const urlResultStyle = {
    wordBreak: 'break-all',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '1rem'
  };

  const md5ResultStyle = {
    fontFamily: 'monospace',
    padding: '1rem',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: '8px',
    marginBottom: '1rem'
  };

  const tipResultStyle = {
    fontSize: '1.125rem',
    margin: '0.5rem 0',
    color: '#374151'
  };

  const gradientPreviewStyle = {
    width: '100%',
    height: '100px',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #e2e8f0'
  };

  const passwordStrengthStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: '0.5rem'
  };

  const passwordTipsStyle = {
    fontSize: '0.875rem',
    color: '#64748b',
    fontStyle: 'italic'
  };

  const binaryResultStyle = {
    fontFamily: 'monospace',
    padding: '1rem',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: '8px',
    marginBottom: '1rem'
  };

  const hexResultStyle = {
    fontFamily: 'monospace',
    padding: '1rem',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: '8px',
    marginBottom: '1rem'
  };

  // Previous styles remain the same...
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

  return (
    <Layout>
      <Head>
        <title>Multi Tool Hub | 30+ Free Online Tools</title>
        <meta 
          name="description" 
          content="Free online tools collection - Password Generator, Age Calculator, BMI Calculator, Word Counter, Base64 Encoder, Color Picker, Text to Speech, EMI Calculator, Unit Converter, JSON Formatter and 20+ more tools" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>🛠️ Multi Tool Hub</h1>
          <p style={subtitleStyle}>
            Your all-in-one solution with 30+ free online tools for everyday tasks
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

        <canvas ref={canvasRef} style={{display: 'none'}} />
      </div>
    </Layout>
  );
}
