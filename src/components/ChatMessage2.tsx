'use client';
import { Message } from '@/lib/types';
import { getThemeClasses,Theme } from '@/lib/theme';
import { SafeImage } from '@/components/ui/SafeImage';
import { User, ThumbsUp, ThumbsDown } from 'lucide-react';


interface ChatMessageProps {
  message: Message;
  theme: Theme;
  onFeedback?: (message: Message, feedback: 'helpful' | 'not-helpful') => void;
}


export function ChatMessage({ message, theme, onFeedback }: ChatMessageProps) {
  const themeClasses = getThemeClasses(theme);
  const isAssistant = message.role === 'assistant';


  return (
    <div className={`flex gap-4 mb-6 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="">
          <SafeImage
            src="/vb.png"
            alt="VB Logo"
            className="w-9 h-7 rounded-full"
          />
        </div>
      )}
     
      <div className={`max-w-[80%] ${
        isAssistant
          ? `${themeClasses.bgSecondary} ${themeClasses.border}`
          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500'
      } rounded-2xl px-4 py-3 shadow-sm border`}>
        <div className={`text-sm ${
          isAssistant ? themeClasses.textSecondary : 'text-white'
        }`}>
          {message.content}
        </div>
        {message.timestamp && (
          <div className={`text-xs mt-2 ${
            isAssistant ? themeClasses.textMuted : 'text-emerald-100'
          }`}>
            {message.timestamp}
          </div>
        )}
        {isAssistant && onFeedback && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onFeedback(message, 'helpful')}
              className={`p-1 rounded ${themeClasses.hoverSecondary}`}
              aria-label="Helpful"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onFeedback(message, 'not-helpful')}
              className={`p-1 rounded ${themeClasses.hoverSecondary}`}
              aria-label="Not helpful"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
     
      {!isAssistant && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}

