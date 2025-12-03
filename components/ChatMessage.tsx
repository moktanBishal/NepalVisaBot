import React from 'react';
import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Basic formatter for bold text and links
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2 min-h-[1em]">
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
           // Check for URLs and make them clickable
           const urlRegex = /(https?:\/\/[^\s]+)/g;
           const parts = part.split(urlRegex);
           if (parts.length > 1) {
             return parts.map((subPart, k) => {
               if (subPart.match(urlRegex)) {
                 return <a key={k} href={subPart} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 break-all">{subPart}</a>;
               }
               return subPart;
             });
           }
          return part;
        })}
      </p>
    ));
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-nepalBlue' : 'bg-nepalRed'} text-white shadow-sm`}>
          {isUser ? <User size={18} /> : <Bot size={20} />}
        </div>

        {/* Bubble */}
        <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
          isUser 
            ? 'bg-nepalBlue text-white rounded-tr-none' 
            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
        } ${message.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}>
          {formatText(message.text)}
        </div>
      </div>
    </div>
  );
};
