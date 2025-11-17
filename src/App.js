import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './components/SideBar';
import ChatInput from './components/ChatInput';
import TableResponse from './components/TableResponse';
import ThemeToggle from './components/ThemeToggle';
import AnswerFeedback from './components/AnswerFeedback';

const API_BASE_URL = 'http://localhost:5000/api';

const ChatWindow = ({ theme, toggleTheme }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');

  useEffect(() => {
    if (sessionId) {
      fetchSessionHistory(sessionId);
    } else {
      setHistory([]);
      setSessionTitle('New Chat');
    }
  }, [sessionId]);

  const fetchSessionHistory = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/session/${id}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
        setSessionTitle(data.title);
      } else {
        console.error('Failed to fetch session history');
        setHistory([]);
        setSessionTitle('Session Not Found');
      }
    } catch (error) {
      console.error('Network error:', error);
      setHistory([]);
      setSessionTitle('Network Error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/new-chat`);
      const data = await response.json();
      navigate(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };

  const handleSendMessage = async (question) => {
    if (!sessionId) {
      await handleNewChat();
      return;
    }
    
    const userMessage = { sender: 'user', content: question };
    setHistory(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (response.ok) {
        const modelResponse = await response.json();
        setHistory(prev => [...prev, modelResponse]);
      } else {
        console.error('Failed to get model response');
      }
    } catch (error) {
      console.error('Network error during chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (index, feedback) => {
    setHistory(prev => prev.map((msg, i) => 
      i === index ? { ...msg, feedback: msg.feedback === feedback ? null : feedback } : msg
    ));
  };

  if (!sessionId && history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 transition-colors duration-300">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Lumibyte Chatbot
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Start a new conversation to begin your analysis.
        </p>
        <button
          onClick={handleNewChat}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
        >
          Start New Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 transition-colors duration-300">
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">{sessionTitle}</h2>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {history.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl p-4 rounded-xl shadow-lg ${
              message.sender === 'user' 
                ? 'bg-indigo-500 text-white rounded-br-none' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.structuredData && (
                <div className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-4">
                  <TableResponse data={message.structuredData} />
                  <AnswerFeedback 
                    feedback={message.feedback} 
                    onFeedback={(f) => handleFeedback(index, f)} 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl rounded-tl-none">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
        <ChatInput onSend={handleSendMessage} disabled={loading} />
      </footer>
    </div>
  );
};

const Layout = () => {
  const [theme, setTheme] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen flex text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />
      <div 
        className={`flex-1 flex overflow-hidden w-full transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}` // CORRECTED: Uses padding left to offset fixed sidebar
        }
      >
        <Routes>
          <Route path="/" element={<ChatWindow theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/chat/:sessionId" element={<ChatWindow theme={theme} toggleTheme={toggleTheme} />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;