import React from 'react';
import { SessionChatMessage } from 'teleparty-websocket-lib';

interface ChatMessageProps {
  message: SessionChatMessage;
  isOwnMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  return (
    <div className={`p-4 ${isOwnMessage ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'} rounded-lg shadow-md max-w-xs`}>
      <div className="font-semibold mb-1 text-black">{message.userNickname}</div>
      <div className='text-black'>{message.body}</div>
      <div className="text-xs text-gray-500 mt-2">{new Date(message.timestamp).toLocaleTimeString()}</div>
    </div>
  );
};
