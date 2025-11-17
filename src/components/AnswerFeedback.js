import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const AnswerFeedback = ({ feedback, onFeedback }) => {
  return (
    <div className="flex space-x-3 mt-3 justify-end">
      <button
        onClick={() => onFeedback('like')}
        className={`p-2 rounded-full transition duration-150 flex items-center ${
          feedback === 'like' 
            ? 'bg-green-500 text-white' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        aria-label="Like answer"
      >
        <ThumbsUp size={18} />
      </button>
      <button
        onClick={() => onFeedback('dislike')}
        className={`p-2 rounded-full transition duration-150 flex items-center ${
          feedback === 'dislike' 
            ? 'bg-red-500 text-white' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        aria-label="Dislike answer"
      >
        <ThumbsDown size={18} />
      </button>
    </div>
  );
};

export default AnswerFeedback;