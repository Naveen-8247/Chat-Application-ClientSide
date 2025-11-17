import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question..."
        disabled={disabled}
        className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400 dark:disabled:bg-indigo-700 disabled:cursor-not-allowed"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;