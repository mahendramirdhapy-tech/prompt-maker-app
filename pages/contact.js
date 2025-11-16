// pages/contact.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(''), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - AI Prompt Maker</title>
        <meta name="description" content="Contact AI Prompt Maker support team. Get help with your account and features." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition duration-200 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with our support team. We're here to help you with any questions or concerns.
            </p>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
              ✅ Thank you! Your message has been received. We will get back to you within 24 hours.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
              ❌ There was an error sending your message. Please try again.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <span className="text-blue-600 text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">aipromptmakerinfo@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <span className="text-green-600 text-xl">🕒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Response Time</h3>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <span className="text-purple-600 text-xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Support Hours</h3>
                    <p className="text-gray-600">24/7 Customer Support</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <span className="text-orange-600 text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">Remote Team - Global Support</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {['📘', '🐦', '📷', '💼'].map((icon, index) => (
                    <button
                      key={index}
                      className="text-2xl hover:scale-110 transition-transform duration-200"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
