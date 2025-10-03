import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Mail, Clock, HelpCircle, Search } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs: FAQItem[] = [
    {
      id: 'faq1',
      question: 'How do I track my order?',
      answer: 'You can track your order in the "Orders" section of your profile. You\'ll receive tracking information via email once your order ships.',
      category: 'Orders'
    },
    {
      id: 'faq2',
      question: 'What are your shipping times?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping is available and takes 2-3 business days.',
      category: 'Shipping'
    },
    {
      id: 'faq3',
      question: 'How do I schedule a consultation?',
      answer: 'Navigate to the Health page and click on "Schedule Appointment" or contact our support team directly.',
      category: 'Appointments'
    },
    {
      id: 'faq4',
      question: 'Can I modify my treatment plan?',
      answer: 'Yes, you can discuss treatment modifications with your healthcare provider through our messaging system or during a consultation.',
      category: 'Treatment'
    },
    {
      id: 'faq5',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and HSA/FSA cards for eligible purchases.',
      category: 'Payment'
    },
    {
      id: 'faq6',
      question: 'How do I update my prescription?',
      answer: 'Contact your healthcare provider through our secure messaging system to discuss prescription updates.',
      category: 'Prescriptions'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for contacting us! We\'ll respond within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Custom Header with Back Button */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 pt-8 pb-5 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm border border-white/20"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Support</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
          <p className="text-blue-100 mb-6">
            We're here to assist you with any questions or concerns
          </p>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="tel:+1234567890"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <Phone className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
            <p className="text-sm text-gray-600 mb-2">Mon-Fri, 8am-8pm EST</p>
            <p className="text-blue-600 font-medium">1-800-ZAPPY-RX</p>
          </a>

          <a
            href="mailto:support@zappyhealth.com"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <Mail className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
            <p className="text-sm text-gray-600 mb-2">Response within 24hrs</p>
            <p className="text-green-600 font-medium">support@zappyhealth.com</p>
          </a>

          <button
            onClick={() => navigate('/messages')}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-left"
          >
            <MessageCircle className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Message</h3>
            <p className="text-sm text-gray-600 mb-2">Chat with support</p>
            <p className="text-purple-600 font-medium">Start conversation</p>
          </button>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Monday - Friday:</span> 8:00 AM - 8:00 PM EST</p>
                <p><span className="font-medium">Saturday:</span> 9:00 AM - 5:00 PM EST</p>
                <p><span className="font-medium">Sunday:</span> Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="text-xs text-blue-600 font-medium">{faq.category}</span>
                      <p className="font-medium text-gray-900 mt-1">{faq.question}</p>
                    </div>
                    <ArrowLeft
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        expandedFAQ === faq.id ? '-rotate-90' : 'rotate-180'
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No FAQs found matching your search.
              </p>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Send us a message</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;