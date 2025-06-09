'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getMessages } from '@/lib/saveMessage';
import ChatSessions from '@/components/ChatSessions';

export default function Home() {
  const { user, error: authError, isLoading } = useUser();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [refreshSessionsTrigger, setRefreshSessionsTrigger] = useState(false);

  // Effect to manage body overflow when sidebar is open on mobile
  useEffect(() => {
    if (showSidebar && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    // Cleanup function to reset overflow when component unmounts or dependencies change
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showSidebar]);

  // Load chat history when session ID changes
  useEffect(() => {
    if (sessionId) {
      loadChatHistory(sessionId);
    } else {
      setChatHistory([]);
    }
  }, [sessionId]);

  const loadChatHistory = async (sid: string) => {
    try {
      const messages = await getMessages(sid);
      setChatHistory(messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })));
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history');
    }
  };

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
        body: JSON.stringify({ message, sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        setRefreshSessionsTrigger(prev => !prev);
      }
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

  const handleNewChat = () => {
    setSessionId(null);
    setChatHistory([]);
  };

  if (isLoading) return <div className="d-flex justify-content-center align-items-center min-vh-100">Loading...</div>;
  if (authError) return <div className="d-flex justify-content-center align-items-center min-vh-100">Error: {authError.message}</div>;
  if (!user) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100" style={{
        background: '#f8f9fa', /* Very light, almost white background */
        fontFamily: 'Montserrat, sans-serif', /* Modern, clean font (assuming it will be imported or web-safe) */
        color: '#343a40', /* Dark text for high contrast */
        textAlign: 'center',
      }}>
        <div className="card shadow-lg p-5" style={{
          maxWidth: '480px',
          width: '90%',
          borderRadius: '8px',
          backgroundColor: '#ffffff', /* Pure white card */
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)', /* Very subtle shadow */
          border: '1px solid #e9ecef', /* Light border */
        }}>
          <h1 className="card-title mb-3" style={{
            fontSize: '2.8rem',
            fontWeight: '700',
            color: '#212529',
            letterSpacing: '-0.04em',
          }}>Pulsar AI</h1>
          <p className="card-text text-muted mb-4" style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#6c757d',
            maxWidth: '380px',
            margin: '0 auto 2rem auto'
          }}>Your advanced AI assistant for seamless productivity and endless creativity.</p>
          <a href="/api/auth/login" className="btn btn-primary btn-lg w-100" style={{
            backgroundColor: '#007bff', /* Standard Bootstrap primary blue */
            borderColor: '#007bff',
            padding: '16px 0',
            fontSize: '1.2rem',
            borderRadius: '6px',
            transition: 'background-color 0.3s ease, transform 0.2s ease'
          }} onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#0056b3';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }} onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            Join Pulsar AI
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 d-flex" style={{ height: '100vh' }}>
      <style jsx>{`
        .sidebar-wrapper {
          transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
          display: flex;
          background: #f8f9fa;
          border-right: 1px solid #dee2e6;
          height: 100vh;
          overflow-y: auto;
          flex-direction: column;
        }

        /* Desktop styles (min-width: 768px) */
        @media (min-width: 768px) {
          .sidebar-wrapper {
            width: 300px;
            min-width: 300px;
            transform: translateX(0); /* Always visible on desktop */
            visibility: visible;
            position: relative; /* Position relative on desktop */
          }
          .sidebar-wrapper.collapsed {
            width: 0;
            min-width: 0;
            transform: translateX(-100%);
            visibility: hidden;
          }
        }

        /* Mobile styles (max-width: 767px) - Full-screen overlay */
        @media (max-width: 767px) {
          .sidebar-wrapper {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%; /* Full width on mobile */
            height: 100vh; /* Full height on mobile */
            z-index: 1050;
            box-shadow: 2px 0 8px rgba(0,0,0,0.15);
            transform: translateX(-100%); /* Start off-screen */
            visibility: hidden;
            /* display: flex is applied globally to .sidebar-wrapper */
            transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
          }
          .sidebar-wrapper.open {
            transform: translateX(0);
            visibility: visible;
          }
          .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.6); /* Darker backdrop */
            z-index: 1040; /* Lower z-index than sidebar */
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }
          .backdrop.show {
            opacity: 1;
          }
          .mobile-toggle {
            display: block !important;
          }
          .desktop-toggle {
            display: none !important;
          }
        }

        @media (min-width: 768px) {
          .sidebar-wrapper {
            width: 300px;
            min-width: 300px;
            transform: translateX(0);
            visibility: visible;
            position: relative; /* Ensure relative on desktop */
            transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
          }
          .sidebar-wrapper.collapsed {
            transform: translateX(-100%);
            visibility: hidden;
            width: 0; /* Collapse width on desktop as well */
            min-width: 0;
          }
          .mobile-toggle {
            display: none !important;
          }
          .desktop-toggle {
            display: block !important;
          }
        }

        /* Ensure main content is not shifted on mobile */
        .main-content-wrapper {
          flex-grow: 1;
          transition: none; /* No shifting transition */
          transform: none; /* No shifting */
        }
      `}</style>

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${showSidebar ? 'open' : 'collapsed'}`}>
        {/* Close button for mobile sidebar */}
        <button
          className="btn btn-outline-dark btn-sm position-absolute top-0 end-0 m-2 d-md-none"
          onClick={() => setShowSidebar(false)}
          aria-label="Close sidebar"
          style={{ zIndex: 1060 }}
        >
          <i className="bi bi-x-lg"></i>
        </button>
        <ChatSessions
          userId={user.sub || ''}
          currentSessionId={sessionId}
          onSessionSelect={(id) => {
            setSessionId(id);
            // Close sidebar on mobile after selecting a chat
            if (window.innerWidth < 768) {
              setShowSidebar(false);
            }
          }}
          onNewChat={() => {
            handleNewChat();
            // Close sidebar on mobile after starting new chat
            if (window.innerWidth < 768) {
              setShowSidebar(false);
            }
          }}
          refreshSessionsTrigger={refreshSessionsTrigger}
        />
      </div>

      {/* Backdrop for mobile */}
      {showSidebar && (
        <div 
          className={`backdrop ${showSidebar ? 'show' : ''}`}
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column main-content-wrapper">
        {/* Header */}
        <header className="bg-primary text-white p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {/* Mobile Toggle Button (Hamburger) */}
              <button
                className="btn btn-outline-light btn-sm me-2 mobile-toggle"
                onClick={() => setShowSidebar(!showSidebar)}
                aria-label="Toggle sidebar"
              >
                <i className="bi bi-list"></i>
              </button>
              {/* Desktop Toggle Button (Chevron) */}
              <button
                className="btn btn-outline-light btn-sm me-2 desktop-toggle"
                onClick={() => setShowSidebar(!showSidebar)}
                aria-label="Toggle sidebar"
              >
                <i className={`bi ${showSidebar ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
              </button>
              <h1 className="h4 mb-0">ChatGPT Clone</h1>
            </div>
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
          {chatHistory.length === 0 && !isLoadingResponse ? (
            <div className="text-center text-muted mt-5">
              Hi there! How can I help you today?
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-end' : ''}`}>
                <div className={`d-inline-block p-2 rounded ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
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
    </div>
  );
}
