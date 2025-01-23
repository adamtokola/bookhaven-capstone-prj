import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RegisterForm } from '../../../src/components/auth/RegisterForm';
import React from 'react';

// Mock MUI components
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Container: ({ children }) => <div>{children}</div>,
    Box: ({ component, children, ...props }) => 
      component === 'form' ? <form {...props}>{children}</form> : <div {...props}>{children}</div>,
    Avatar: () => <div>Avatar</div>,
    Typography: ({ children }) => <div>{children}</div>,
    TextField: ({ label, type, onChange, error, helperText }) => (
      <input
        type={type || 'text'}
        placeholder={label}
        aria-label={label}
        onChange={onChange}
        aria-invalid={error}
        aria-errormessage={helperText}
      />
    ),
    Button: ({ children, onClick, type }) => (
      <button type={type} onClick={onClick}>{children}</button>
    ),
    Link: ({ children }) => <a>{children}</a>,
    Grid: ({ children }) => <div>{children}</div>
  };
});

// Mock icons
vi.mock('@mui/icons-material/LockOutlined', () => ({
  default: () => 'LockIcon'
}));

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }) => <a>{children}</a>
}));

// Mock hooks
const mockRegister = vi.fn().mockResolvedValue({});
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister,
    user: null
  })
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    mockRegister.mockClear();
  });

  it('renders all form elements', () => {
    render(<RegisterForm />);
    expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('validates matching passwords', async () => {
    render(<RegisterForm />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /username/i }), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByRole('textbox', { name: /email address/i }), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password456' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      const errorInput = screen.getByPlaceholderText('Confirm Password');
      expect(errorInput).toHaveAttribute('aria-errormessage', 'Passwords do not match');
    });
  });

  it('submits form with valid data', async () => {
    render(<RegisterForm />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /username/i }), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByRole('textbox', { name: /email address/i }), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    });
  });
}); 