import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI Shopping Assistant. Tell me what you're looking for, e.g., 'A laptop under $1000 for coding'." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsLoading(true);
    
    try {
      const res = await axios.post('/api/ai/recommend', { query: userQuery });
      const { recommendations } = res.data;
      
      if (!recommendations || recommendations.length === 0) {
        setMessages(prev => [...prev, { role: 'assistant', text: "I couldn't find any products matching your requirements right now." }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', recommendations, text: "Here are the best matches for you:" }]);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Sorry, I'm having trouble right now.";
      setMessages(prev => [...prev, { role: 'assistant', text: msg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 md:bottom-28 md:right-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all z-40 transform hover:scale-105 flex items-center justify-center group ${isOpen ? 'hidden' : ''}`}
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-28 md:right-8 w-full md:w-[380px] h-[85vh] md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex justify-between items-center shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <Bot size={22} />
              <h3 className="font-semibold text-sm">AI Shopping Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4 text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.recommendations && (
                    <div className="mt-3 space-y-3">
                      {msg.recommendations.map((rec, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col hover:border-indigo-300 transition-colors shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 flex items-center justify-center p-1 overflow-hidden border border-gray-100">
                              <img src={rec.product.images[0]} alt={rec.product.title} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {rec.badge && (
                                <span className="inline-block text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full mb-1">
                                  {rec.badge}
                                </span>
                              )}
                              <h4 className="font-medium text-xs line-clamp-2 text-gray-900 mb-1 leading-snug">{rec.product.title}</h4>
                              <div className="font-bold text-sm text-indigo-700">${rec.product.price.toFixed(2)}</div>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-2 bg-white p-2 rounded border border-gray-100 italic leading-relaxed">
                            "{rec.reason}"
                          </p>
                          <Link 
                            to={`/product/${rec.product._id}`} 
                            onClick={() => setIsOpen(false)}
                            className="mt-2 text-xs font-medium text-center text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 py-2 rounded-lg flex justify-center items-center gap-1 border border-indigo-100 transition-colors"
                          >
                            View Details <ChevronRight size={14} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-100 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for recommendations..." 
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="bg-indigo-500 text-white p-2.5 rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
