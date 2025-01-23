import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../../../src/components/auth/LoginForm';
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
    Grid: ({ children }) => <div>{children}</div>,
    FormControlLabel: ({ control, label }) => (
      <label>
        {control}
        {label}
      </label>
    ),
    Checkbox: (props) => <input type="checkbox" {...props} />
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
const mockLogin = vi.fn().mockResolvedValue({});
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null
  })
}));

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('renders all form elements', () => {
    render(<LoginForm />);
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<LoginForm />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /email address/i }), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
}); 