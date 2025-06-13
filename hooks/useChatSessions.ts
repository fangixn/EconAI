import { useState, useEffect } from 'react';

const CHAT_SESSIONS_KEY = 'econai_chat_sessions';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  model: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export function useChatSessions() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load chat sessions from localStorage
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(CHAT_SESSIONS_KEY);
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        // Convert date strings back to Date objects
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(sessionsWithDates);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      // If data is corrupted, clear it and start fresh
      localStorage.removeItem(CHAT_SESSIONS_KEY);
      setChatSessions([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Auto-save chat sessions whenever they change
  useEffect(() => {
    if (isLoaded && chatSessions.length >= 0) {
      saveSessions(chatSessions);
    }
  }, [chatSessions, isLoaded]);

  // Save sessions to localStorage with error handling
  const saveSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
      // Attempt to clear space and try again
      try {
        // Remove old sessions (keep only the latest 50)
        const trimmedSessions = sessions.slice(0, 50);
        localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(trimmedSessions));
        console.warn('Trimmed chat sessions to save space');
      } catch (retryError) {
        console.error('Failed to save even trimmed sessions:', retryError);
      }
    }
  };

  // Add a new session
  const addSession = (session: ChatSession) => {
    setChatSessions(prev => [session, ...prev]);
  };

  // Update an existing session
  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, ...updates, updatedAt: new Date() }
          : session
      )
    );
  };

  // Delete a session
  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Clear all sessions
  const clearAllSessions = () => {
    setChatSessions([]);
    localStorage.removeItem(CHAT_SESSIONS_KEY);
  };

  // Get session by ID
  const getSession = (sessionId: string) => {
    return chatSessions.find(s => s.id === sessionId);
  };

  return {
    chatSessions,
    isLoaded,
    addSession,
    updateSession,
    deleteSession,
    clearAllSessions,
    getSession
  };
} 