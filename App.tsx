import React, { useState, useEffect, useRef } from 'react';
import { Message, UserProfile } from './types';
import { INITIAL_GREETING, REALISTIC_COUNTRIES } from './constants';
import { startChat, sendMessage } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ProfileForm } from './components/ProfileForm';
import { CountryCard } from './components/CountryCard';
import { AlertTriangle, Send, Menu, X, Info } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false); // Initially false, triggered after first greeting
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat
  useEffect(() => {
    startChat();
    // Add initial bot greeting
    setMessages([{ role: 'model', text: INITIAL_GREETING }]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string, isFromForm = false) => {
    if ((!text.trim() && !isFromForm) || isLoading) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(text);
      const botMsg: Message = { role: 'model', text: responseText };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'सर्भरमा समस्या आयो। कृपया एकछिन पछि प्रयास गर्नुहोला।', isError: true }]);
    } finally {
      setIsLoading(false);
      setShowProfileForm(false); // Hide form if it was visible
    }
  };

  const handleProfileSubmit = (profile: UserProfile) => {
    // Construct a natural language prompt from the form data
    const prompt = `मेरो विवरण:\nउमेर: ${profile.age}\nपढाइ: ${profile.education}\nअनुभव: ${profile.experience}\nचाहिएको काम: ${profile.preferredSector}\nबजेट: ${profile.budget} लाख।\n\nअब भन्नुस्, मेरो लागि कुन देश र भिसा ठिक हुन्छ?`;
    handleSendMessage(prompt, true);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Info Panel) */}
      <aside className={`fixed md:relative z-30 w-72 h-full bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-4 bg-nepalBlue text-white shadow-md flex justify-between items-center">
          <div>
            <h1 className="font-bold text-xl">Europe Kamdar Guru</h1>
            <p className="text-xs text-blue-200">Dec 2025 Updated</p>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Warning Card */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="text-red-800 font-bold flex items-center gap-2 mb-2">
              <AlertTriangle size={18} /> सावधान!
            </h3>
            <p className="text-sm text-red-700 leading-relaxed">
              ९०% एजेन्ट ठग्छन्। १५ लाख भन्दा माथि नतिर्नुस्। आफ्नो डकुमेन्ट आफैं चेक गर्नुस्।
            </p>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="text-gray-700 font-bold mb-3 flex items-center gap-2">
              <Info size={16} /> Realistic Countries
            </h3>
            <div className="space-y-3">
              {REALISTIC_COUNTRIES.map(country => (
                <CountryCard key={country.name} country={country} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t text-xs text-gray-400 text-center">
          Powered by Gemini AI <br/> &copy; 2025 Europe Kamdar Guru
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col w-full relative">
        {/* Header (Mobile) */}
        <header className="md:hidden bg-white border-b p-4 flex justify-between items-center shadow-sm z-10">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-nepalRed rounded-full text-white flex items-center justify-center font-bold">गुरू</div>
             <h1 className="font-bold text-gray-800">Europe Kamdar Guru</h1>
           </div>
           <button onClick={toggleSidebar} className="text-gray-600">
             <Menu size={24} />
           </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-gray-50 scroll-smooth">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          
          {/* Profile Form Embed */}
          {messages.length === 1 && !isLoading && (
            <div className="mt-4 animate-fade-in-up">
              <div className="flex justify-center mb-4">
                 <button 
                  onClick={() => setShowProfileForm(!showProfileForm)}
                  className="bg-nepalRed text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-red-700 transition"
                 >
                   {showProfileForm ? 'फारम बन्द गर्नुहोस्' : 'मेरो विवरण भर्नुहोस् (Click Here)'}
                 </button>
              </div>
              
              {showProfileForm && (
                <ProfileForm onSubmit={handleProfileSubmit} isLoading={isLoading} />
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex gap-2 items-center text-gray-400 text-sm ml-12 animate-pulse">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               <span className="ml-2">सोच्दै छु...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="max-w-3xl mx-auto relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              placeholder="यहाँ प्रश्न सोध्नुहोस्... (जस्तै: माल्टा जान कति खर्च लाग्छ?)"
              className="flex-1 bg-gray-100 border-0 rounded-full px-6 py-3.5 focus:ring-2 focus:ring-nepalBlue outline-none text-gray-700 placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-nepalBlue text-white rounded-full flex items-center justify-center hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-2">
            AI ले गल्ती गर्न सक्छ। सधैं आधिकारिक जानकारी जाँच गर्नुहोस्।
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
