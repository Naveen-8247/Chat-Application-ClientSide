import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, PlusCircle, User, MessageSquare } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const Sidebar = ({ isOpen, onToggle }) => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/new-chat`);
      const data = await response.json();
      fetchSessions();
      navigate(`/chat/${data.sessionId}`);
      if (window.innerWidth < 768) {
        onToggle();
      }
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
          transition-transform duration-300 ease-in-out z-30 flex flex-col md:fixed md:translate-x-0`} // CORRECTED: md:fixed applied here
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Lumibyte Chat</h1>
          <button onClick={onToggle} className="md:hidden text-gray-500 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center p-3 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-150 shadow-md"
          >
            <PlusCircle size={20} className="mr-2" />
            New Chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <h2 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">History</h2>
          {sessions.map((session) => (
            <NavLink
              key={session.id}
              to={`/chat/${session.id}`}
              className={({ isActive }) =>
                `flex items-center p-2 text-sm rounded-lg transition duration-150 truncate ${
                  isActive
                    ? 'bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`
              }
              onClick={window.innerWidth < 768 ? onToggle : undefined}
            >
              <MessageSquare size={16} className="mr-3 flex-shrink-0" />
              {session.title}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-300">
            <User size={20} className="mr-3 flex-shrink-0" />
            <span className="font-medium">User Account</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Overlay and Toggle Button */}
      {!isOpen && (
        <button 
          onClick={onToggle} 
          className="fixed top-4 left-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg z-40 md:hidden"
        >
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      )}
      {isOpen && (
        <div onClick={onToggle} className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"></div>
      )}
    </>
  );
};

export default Sidebar;