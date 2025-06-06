'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const { user, error: authError, isLoading } = useUser();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoadingResponse) return;

    setError(null);
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    setIsLoadingResponse(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setError(error.message || 'An error occurred while processing your request');
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoadingResponse(false);
      setMessage('');
    }
  };

  if (isLoading) return <div className="d-flex justify-content-center align-items-center min-vh-100">Loading...</div>;
  if (authError) return <div className="d-flex justify-content-center align-items-center min-vh-100">Error: {authError.message}</div>;
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <a href="/api/auth/login" className="btn btn-primary">Login</a>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 d-flex flex-column" style={{ height: '100vh' }}>
      {/* Header */}
      <header className="bg-primary text-white p-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">ChatGPT Clone</h1>
          <a href="/api/auth/logout" className="btn btn-outline-light btn-sm">Logout</a>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger m-3" role="alert">
          {error}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-grow-1 overflow-auto p-3">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-end' : ''}`}>
            <div className={`d-inline-block p-2 rounded ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoadingResponse && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-3 border-top">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoadingResponse}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoadingResponse || !message.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
