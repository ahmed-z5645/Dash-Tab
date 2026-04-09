import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from './search';

describe('Search', () => {
    test('renders a search input', () => {
        render(<Search />);
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    test('renders a submit button', () => {
        render(<Search />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('opens Google search URL on submit', () => {
        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
        render(<Search />);
        fireEvent.change(screen.getByPlaceholderText('Search...'), {
            target: { value: 'test query' },
        });
        fireEvent.submit(screen.getByRole('button').closest('form'));
        expect(openSpy).toHaveBeenCalledWith(
            'https://www.google.com/search?q=test query',
            '_self'
        );
        openSpy.mockRestore();
    });

    test('search input updates as user types', () => {
        render(<Search />);
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: 'hello' } });
        expect(input.value).toBe('hello');
    });
});
