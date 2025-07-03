'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Menu, Building2, LogOut } from 'lucide-react';
import { Conversation, Message, Theme } from '@/lib/types';
import { SafeImage } from '@/components/ui/SafeImage';
import { getThemeClasses } from '@/lib/theme';
import { Sidebar } from './Sidebar';
import { SettingsModal } from './SettingsModal';
import { QuestionSuggestions } from './QuestionSuggestions';
import { ChatMessage } from './ChatMessage2';
import { TypingIndicator } from './TypingIndicator';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('light');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const themeClasses = getThemeClasses(theme);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth-check');
        if (res.status === 401) {
          localStorage.setItem('auth', 'false');
          router.push('/');
          return;
        }
        setIsAuthChecking(false);
      } catch {
        localStorage.setItem('auth', 'false');
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/check-admin');
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    const loadConversations = async () => {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    };
    loadConversations();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const generateConversationTitle = (text: string) => {
    const words = text.split(' ').slice(0, 4).join(' ');
    return words.length > 30 ? words.substring(0, 30) + '...' : words;
  };

  const createNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([{
      role: 'assistant',
      content: 'Hello! I\'m your VB Capital AI Assistant. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setSidebarOpen(false);
  };

  const selectConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setCurrentConversationId(id);
      setMessages(conv.messages);
      setSidebarOpen(false);
    }
  };

  const updateConversationMessages = (id: string, newMessages: Message[]) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id ? { ...conv, messages: newMessages, time: 'Just now' } : conv
      )
    );
  };

  const sendFeedback = (msg: Message, fb: 'helpful' | 'not-helpful') => {
    console.log(`Feedback: ${fb} for message:`, msg);
  };

  const sendMessage = async (messageText?: string, file?: File) => {
    const text = messageText || input;
    if (!text.trim() && !file) return;

    const userMessage: Message = {
      role: 'user',
      content: file ? `📎 Uploaded file: ${file.name}${text ? `\n\n${text}` : ''}` : text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      userMessage.content = `[file:${file.name}](${uploadData.url})${text ? `\n\n${text}` : ''}`;
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('messages', JSON.stringify(newMessages.map(m => ({ role: m.role, content: m.content }))));
      if (file) formData.append('file', file);

      const res = await fetch('/api/chat', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Failed to get AI response');
      const data = await res.json();

      const aiMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);

      const title = generateConversationTitle(text);

      if (currentConversationId) {
        await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentConversationId, title, messages: finalMessages })
        });
        updateConversationMessages(currentConversationId, finalMessages);
      } else {
        const newId = crypto.randomUUID();
        await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newId, title, messages: finalMessages })
        });
        setConversations(prev => [
          { id: newId, title, time: 'Just now', messages: finalMessages },
          ...prev.slice(0, 9)
        ]);
        setCurrentConversationId(newId);
      }
    } catch (err) {
      console.error(err);
      const errMsg: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your file. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newMessages, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      localStorage.setItem('auth', 'false');
      window.dispatchEvent(new Event('storage'));
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (isAuthChecking) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className={`h-screen flex ${themeClasses.bg}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        onNewConversation={createNewConversation}
        onSelectConversation={selectConversation}
        currentConversationId={currentConversationId}
        onShowSettings={() => setShowSettings(true)}
        theme={theme}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        onThemeChange={setTheme}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`border-b px-6 py-4 flex items-center justify-between shadow-sm ${themeClasses.bgSecondary} ${themeClasses.border}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className={`p-2 rounded-lg ${themeClasses.hoverSecondary}`} type="button">
              <Menu className={`w-5 h-5 ${themeClasses.textMuted}`} />
            </button>
            <div className="flex items-center gap-3">
              <SafeImage src="vb.png" alt="VB" className="w-9 h-7 rounded-full" fallback={<Building2 className="w-5 h-5 text-white" />} />
              <div>
                <h1 className={`font-semibold ${themeClasses.text}`}>VB Capital Assistant</h1>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Online
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={() => router.push('/admin')} className="text-sm px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
                Admin
              </button>
            )}
            <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-0">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} theme={theme} onFeedback={msg.role === 'assistant' ? sendFeedback : undefined} />
            ))}
            {isLoading && <TypingIndicator theme={theme} />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className={`border-t px-6 py-4 ${themeClasses.bgSecondary} ${themeClasses.border}`}>
          <div className="max-w-4xl mx-auto">
            {messages.length <= 1 && (
              <QuestionSuggestions onSelectQuestion={sendMessage} conversations={conversations} theme={theme} />
            )}
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  className={`w-full p-4 pr-12 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 ${themeClasses.bgTertiary} ${themeClasses.border} ${themeClasses.text} placeholder-gray-500`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message... (Press Enter to send)"
                  rows={1}
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                  disabled={isLoading}
                />
                <input
                  type="file"
                  id="fileUpload"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      sendMessage(undefined, file);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="fileUpload" className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-emerald-500 hover:text-emerald-600" title="Upload file">
                  📎
                </label>
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-4 rounded-2xl shadow-lg flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-xs mt-2 text-center ${themeClasses.textMuted}`}>
              You can upload PDF, Word, or image files. The AI will read and respond.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
