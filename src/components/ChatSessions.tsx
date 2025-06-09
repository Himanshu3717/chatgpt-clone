'use client';

import { useState, useEffect } from 'react';
import { getUserSessions } from '@/lib/createOrGetChatSession';
import { supabase } from '@/lib/supabase';

type ChatSession = {
  id: string;
  title: string;
  created_at: string;
};

interface ChatSessionsProps {
  userId: string;
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  refreshSessionsTrigger: boolean;
}

export default function ChatSessions({ 
  userId, 
  currentSessionId, 
  onSessionSelect,
  onNewChat,
  refreshSessionsTrigger
}: ChatSessionsProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [userId, refreshSessionsTrigger]);

  const loadSessions = async () => {
    try {
      console.log('Loading sessions for user:', userId);
      const data = await getUserSessions(userId);
      console.log('Sessions loaded:', data);
      setSessions(data);
    } catch (error: any) {
      console.error('Error loading sessions:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      setError('Failed to load chat sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      
      setSessions(sessions.filter(session => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        onNewChat();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      setError('Failed to delete chat session');
    }
  };

  if (isLoading) {
    return <div className="p-3">Loading sessions...</div>;
  }

  if (error) {
    return <div className="p-3 text-danger">{error}</div>;
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="p-3 border-bottom">
        <button 
          className="btn btn-primary w-100"
          onClick={onNewChat}
        >
          New Chat
        </button>
      </div>
      
      <div className="flex-grow-1 overflow-auto">
        {sessions.length === 0 ? (
          <div className="p-3 text-center text-muted">
            No chat sessions yet
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                  session.id === currentSessionId ? 'active' : ''
                }`}
              >
                <button
                  className="btn btn-link text-decoration-none text-start flex-grow-1"
                  onClick={() => onSessionSelect(session.id)}
                >
                  <div className="d-flex flex-column">
                    <span className={session.id === currentSessionId ? 'text-white' : ''}>
                      {session.title}
                    </span>
                    <small className={session.id === currentSessionId ? 'text-white-50' : 'text-muted'}>
                      {new Date(session.created_at).toLocaleString()}
                    </small>
                  </div>
                </button>
                <button
                  className="btn btn-link text-danger"
                  onClick={() => deleteSession(session.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 