import React from 'react';
import { render, screen } from '@testing-library/react';
import Clock from './clock';

describe('Clock', () => {
    test('renders without crashing', () => {
        render(<Clock />);
    });

    test('displays a time element', () => {
        render(<Clock />);
        expect(document.querySelector('.clocktimer')).toBeInTheDocument();
    });

    test('time element contains a colon-separated value', () => {
        render(<Clock />);
        expect(document.querySelector('.clocktimer').textContent).toMatch(/^\d{1,2}:\d{2}$/);
    });

    test('displays the current day of the week', () => {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = weekdays[new Date().getDay()];
        render(<Clock />);
        expect(screen.getByText(new RegExp(today))).toBeInTheDocument();
    });

    test('displays the current year', () => {
        const year = new Date().getFullYear().toString();
        render(<Clock />);
        expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    });
});
