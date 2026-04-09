import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { backgrounds } from './iterates.js';

jest.mock('./components/toDoList/toDo.js', () => () => <div data-testid="todo-mock" />);

describe('App', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test('renders without crashing', () => {
        render(<App />);
        expect(document.querySelector('.App')).toBeInTheDocument();
    });

    test('displays a quote from the backgrounds list', () => {
        render(<App />);
        const quoteText = document.querySelector('.quote').textContent;
        const match = backgrounds.some(
            (bg) => quoteText.includes(bg.quote) && quoteText.includes(bg.author)
        );
        expect(match).toBe(true);
    });

    test('caches background selection in sessionStorage', () => {
        render(<App />);
        const cached = sessionStorage.getItem('dash-background');
        expect(cached).not.toBeNull();
        const parsed = JSON.parse(cached);
        expect(parsed).toHaveProperty('url');
        expect(parsed).toHaveProperty('quote');
    });

    test('uses cached background on re-render without re-randomizing', () => {
        const cachedData = {
            url: 'background_photos/back3.jpeg',
            quote: '"Cached quote" - Cached Author',
        };
        sessionStorage.setItem('dash-background', JSON.stringify(cachedData));
        render(<App />);
        expect(document.querySelector('.quote').textContent).toBe(cachedData.quote);
    });

    test('cached url is one of the known backgrounds', () => {
        render(<App />);
        const { url } = JSON.parse(sessionStorage.getItem('dash-background'));
        const knownUrls = backgrounds.map((bg) => bg.url);
        expect(knownUrls).toContain(url);
    });
});
