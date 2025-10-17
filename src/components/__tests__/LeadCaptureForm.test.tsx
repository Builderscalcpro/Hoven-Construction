import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadCaptureForm } from '../LeadCaptureForm';
import { BrowserRouter } from 'react-router-dom';

const mockSupabase = {
  from: vi.fn(() => ({
    insert: vi.fn(() => Promise.resolve({ data: {}, error: null })),
  })),
};

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('LeadCaptureForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = () => {
    render(
      <BrowserRouter>
        <LeadCaptureForm />
      </BrowserRouter>
    );
  };

  it('renders all form fields', () => {
    renderForm();
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderForm();
    const submitButton = screen.getByRole('button', { name: /get free quote/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderForm();
    const emailInput = screen.getByLabelText(/email/i);
    
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    renderForm();
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '555-1234');
    await userEvent.selectOptions(screen.getByLabelText(/project type/i), 'Kitchen Remodel');
    await userEvent.type(screen.getByLabelText(/message/i), 'Need kitchen renovation');
    
    const submitButton = screen.getByRole('button', { name: /get free quote/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('leads');
    });
  });

  it('shows success message after submission', async () => {
    renderForm();
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    const submitButton = screen.getByRole('button', { name: /get free quote/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });
  });

  it('handles submission errors', async () => {
    mockSupabase.from.mockReturnValueOnce({
      insert: vi.fn(() => Promise.resolve({ 
        data: null, 
        error: { message: 'Network error' } 
      })),
    });
    
    renderForm();
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    const submitButton = screen.getByRole('button', { name: /get free quote/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});