import React from 'react';
import { render, screen } from '@testing-library/react';
import Focus from './focus';

describe('Focus', () => {
    test('renders without crashing', () => {
        render(<Focus />);
    });

    test('renders all three habit items', () => {
        render(<Focus />);
        expect(screen.getByText('Git Push')).toBeInTheDocument();
        expect(screen.getByText('Journal')).toBeInTheDocument();
        expect(screen.getByText('Workout')).toBeInTheDocument();
    });

    test('renders a link', () => {
        render(<Focus />);
        expect(screen.getByRole('link')).toBeInTheDocument();
    });
});
