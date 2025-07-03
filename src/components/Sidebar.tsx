'use client';
import { useState, useEffect } from 'react';
import { X, MessageSquare, Settings } from 'lucide-react';
import { getThemeClasses } from '@/lib/theme';
import { SafeImage } from '@/components/ui/SafeImage';
import type { Conversation, Theme } from  '@/lib/types';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  currentConversationId: string | null;
  onShowSettings: () => void;
  theme: Theme;
}


export function Sidebar({
  isOpen,
  onClose,
  conversations,
  onNewConversation,
  onSelectConversation,
  currentConversationId,
  onShowSettings,
  theme
}: SidebarProps) {
  const themeClasses = getThemeClasses(theme);
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);


  if (!isMounted) return null;


  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 shadow-xl transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } border-r ${themeClasses.bgSecondary} ${themeClasses.border}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`p-4 border-b ${themeClasses.border} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <SafeImage
              src="/vb.png"
              alt="VB Logo"
              className="w-9 h-7 rounded-full"
            />
            <div>
              <h2 className={`font-semibold ${themeClasses.text}`}>
                VB Capital AI
              </h2>
              <p className={`text-xs ${themeClasses.textMuted}`}>
                Virtual Assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${themeClasses.hoverSecondary}`}
            aria-label="Close sidebar"
          >
            <X className={`w-5 h-5 ${themeClasses.textMuted}`} />
          </button>
        </div>


        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewConversation();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <MessageSquare className="w-4 h-4" />
            New Conversation
          </button>
        </div>


        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-4">
          {conversations.length > 0 ? (
            <>
              <h3 className={`text-sm font-medium mb-3 ${themeClasses.textMuted}`}>
                Recent Conversations
              </h3>
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      onClose();
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentConversationId === conv.id
                        ? 'bg-emerald-900 border border-emerald-600'
                        : themeClasses.hover
                    }`}
                  >
                    <div className={`font-medium text-sm truncate ${themeClasses.textSecondary}`}>
                      {conv.title}
                    </div>
                    <div className={`text-xs mt-1 ${themeClasses.textMuted}`}>
                      {conv.time}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={`text-center py-8 ${themeClasses.textMuted}`}>
              No conversations yet
            </div>
          )}
        </div>


        {/* Settings */}
        <div className={`p-4 border-t ${themeClasses.border}`}>
          <button
            onClick={() => {
              onShowSettings();
              onClose();
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${themeClasses.textMuted} ${themeClasses.hoverSecondary}`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

