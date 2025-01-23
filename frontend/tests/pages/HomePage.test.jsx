import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HomePage } from '../../src/pages/HomePage';
import React from 'react';

// Mock hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Mock auth hook
const mockUseAuth = vi.fn();
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock MUI components
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Container: ({ children }) => <div>{children}</div>,
    Box: ({ children }) => <div>{children}</div>,
    Typography: ({ children, variant }) => <div data-variant={variant}>{children}</div>,
    Button: ({ children, onClick }) => (
      <button onClick={onClick}>{children}</button>
    ),
    Grid: ({ children }) => <div>{children}</div>,
    Paper: ({ children }) => <div>{children}</div>
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseAuth.mockReturnValue({ user: null });
  });

  it('renders welcome message', () => {
    render(<HomePage />);
    expect(screen.getByText(/Welcome to BookHaven/i)).toBeInTheDocument();
  });

  it('renders feature sections', () => {
    render(<HomePage />);
    expect(screen.getByText(/^Discover$/)).toBeInTheDocument();
    expect(screen.getByText(/^Collect$/)).toBeInTheDocument();
    expect(screen.getByText(/^Connect$/)).toBeInTheDocument();
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: null });
    });

    it('shows login and register buttons', () => {
      render(<HomePage />);
      expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });

    it('navigates to register page when clicking Get Started', () => {
      render(<HomePage />);
      fireEvent.click(screen.getByText(/Get Started/i));
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('navigates to login page when clicking Sign In', () => {
      render(<HomePage />);
      fireEvent.click(screen.getByText(/Sign In/i));
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: { id: 1, name: 'Test User' } });
    });

    it('shows browse books button', () => {
      render(<HomePage />);
      expect(screen.getByText(/Browse Books/i)).toBeInTheDocument();
    });

    it('navigates to books page when clicking Browse Books', () => {
      render(<HomePage />);
      fireEvent.click(screen.getByText(/Browse Books/i));
      expect(mockNavigate).toHaveBeenCalledWith('/books');
    });
  });
}); 