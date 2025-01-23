import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

beforeAll(() => {
  // Mock react-router-dom
  vi.mock('react-router-dom', () => {
    const mockNavigate = vi.fn();
    return {
      useNavigate: () => mockNavigate,
      Link: (props) => React.createElement('a', { href: props.to }, props.children),
      BrowserRouter: (props) => React.createElement(React.Fragment, null, props.children)
    };
  });

  // Mock useAuth hook
  vi.mock('../src/hooks/useAuth', () => ({
    useAuth: () => ({
      login: vi.fn().mockResolvedValue({}),
      register: vi.fn().mockResolvedValue({}),
      user: null
    })
  }));
}); 