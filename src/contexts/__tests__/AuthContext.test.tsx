import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { ReactNode } from 'react';

const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  },
};

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
  });

  const TestComponent = () => {
    const { user, loading, signIn, signUp, signOut } = useAuth();
    return (
      <div>
        <div data-testid="loading">{loading.toString()}</div>
        <div data-testid="user">{user?.email || 'No user'}</div>
        <button onClick={() => signIn('test@example.com', 'password')}>
          Sign In
        </button>
        <button onClick={() => signUp('test@example.com', 'password')}>
          Sign Up
        </button>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  };

  const renderWithAuth = (children: ReactNode) => {
    return render(<AuthProvider>{children}</AuthProvider>);
  };

  it('provides auth context to children', () => {
    renderWithAuth(<TestComponent />);
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });

  it('initializes with loading state', () => {
    renderWithAuth(<TestComponent />);
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('loads existing session on mount', async () => {
    const mockSession = {
      user: { email: 'existing@example.com' },
    };
    
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    renderWithAuth(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('existing@example.com');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('handles sign in', async () => {
    const mockUser = { email: 'test@example.com' };
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser, session: {} },
      error: null,
    });

    renderWithAuth(<TestComponent />);
    
    const signInButton = screen.getByText('Sign In');
    signInButton.click();
    
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });
  });

  it('handles sign up', async () => {
    const mockUser = { email: 'new@example.com' };
    mockSupabase.auth.signUp.mockResolvedValueOnce({
      data: { user: mockUser, session: {} },
      error: null,
    });

    renderWithAuth(<TestComponent />);
    
    const signUpButton = screen.getByText('Sign Up');
    signUpButton.click();
    
    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });
  });

  it('handles sign out', async () => {
    mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null });

    renderWithAuth(<TestComponent />);
    
    const signOutButton = screen.getByText('Sign Out');
    signOutButton.click();
    
    await waitFor(() => {
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });
  });

  it('subscribes to auth state changes', () => {
    renderWithAuth(<TestComponent />);
    
    expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled();
  });

  it('handles auth errors gracefully', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    renderWithAuth(<TestComponent />);
    
    const signInButton = screen.getByText('Sign In');
    signInButton.click();
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
    });
  });
});