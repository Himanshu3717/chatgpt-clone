import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';
import { useUser } from '@auth0/nextjs-auth0/client';

// Mock Auth0
jest.mock('@auth0/nextjs-auth0/client', () => ({
  useUser: jest.fn(),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Chat Interface', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: { name: 'Test User' },
      error: null,
      isLoading: false,
    });
  });

  it('renders chat interface', () => {
    render(<Home />);
    expect(screen.getByText('ChatGPT Clone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('sends message and displays in chat', () => {
    render(<Home />);
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello, AI!' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Hello, AI!')).toBeInTheDocument();
    expect(screen.getByText('Echo: Hello, AI!')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      error: null,
      isLoading: false,
    });

    render(<Home />);
    // The component should return null and trigger a redirect
    expect(screen.queryByText('ChatGPT Clone')).not.toBeInTheDocument();
  });
}); 