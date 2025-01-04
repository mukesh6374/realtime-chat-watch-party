import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onTyping(e.target.value.length > 0);
  };

  return (
    <div className="flex items-center p-4 bg-gray-100 border-t border-gray-300">
      <input
        type="text"
        value={message}
        onChange={handleTyping}
        placeholder="Type your message..."
        className="flex-1 p-2 border text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSendMessage}
        className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};
