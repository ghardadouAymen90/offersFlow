import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/link', () => {
  return function MockedLink({
    children,
    href,
    passHref,
    legacyBehavior,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    passHref?: boolean;
    legacyBehavior?: boolean;
    [key: string]: any;
  }) {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => {
        if (['prefetch', 'replace', 'scroll', 'shallow'].includes(key)) {
          return false;
        }
        return true;
      })
    );
    return React.createElement('a', { href, ...filteredProps }, children);
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return React.createElement('img', props);
  },
}));

const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string') {
      if (
        args[0].includes('validateDOMNesting') ||
        args[0].includes('passHref') ||
        args[0].includes('legacyBehavior')
      ) {
        return;
      }
      if (
        args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit')
      ) {
        return;
      }
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
