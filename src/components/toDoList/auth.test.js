import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginInterface from './auth';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    setPersistence,
} from 'firebase/auth/web-extension';
import { setDoc, doc } from 'firebase/firestore';

jest.mock('../../firebase.js', () => ({ auth: {}, db: {} }));

jest.mock('firebase/auth/web-extension', () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    setPersistence: jest.fn(),
    indexedDBLocalPersistence: {},
    signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    setDoc: jest.fn(),
    doc: jest.fn(() => 'mock-doc'),
}));

const defaultProps = {
    needCreate: false,
    setNeedCreate: jest.fn(),
    isLoggedIn: null,
    setIsLoggedIn: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    setPersistence.mockResolvedValue(undefined);
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } });
    createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u2' } });
    setDoc.mockResolvedValue(undefined);
    doc.mockReturnValue('mock-doc');
});

// jsdom doesn't support HTMLFormElement named-element access (e.target.email).
// Simulate it by defining the properties on the form element directly.
const fillForm = (form, email, password) => {
    const emailInput = form.querySelector('[name="email"]');
    const pwInput = form.querySelector('[name="password"]');
    emailInput.value = email;
    pwInput.value = password;
    Object.defineProperty(form, 'email', { get: () => emailInput, configurable: true });
    Object.defineProperty(form, 'password', { get: () => pwInput, configurable: true });
};

describe('LoginInterface', () => {
    test('shows sign-in form by default', () => {
        render(<LoginInterface {...defaultProps} />);
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    test('shows sign-up form when needCreate is true', () => {
        render(<LoginInterface {...defaultProps} needCreate={true} />);
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });

    test('clicking "Don\'t have an account" calls setNeedCreate(true)', () => {
        const setNeedCreate = jest.fn();
        render(<LoginInterface {...defaultProps} setNeedCreate={setNeedCreate} />);
        fireEvent.click(screen.getByText(/Don't have an account/i));
        expect(setNeedCreate).toHaveBeenCalledWith(true);
    });

    test('clicking "Already have an account" calls setNeedCreate(false)', () => {
        const setNeedCreate = jest.fn();
        render(<LoginInterface {...defaultProps} needCreate={true} setNeedCreate={setNeedCreate} />);
        fireEvent.click(screen.getByText(/Already have an account/i));
        expect(setNeedCreate).toHaveBeenCalledWith(false);
    });

    test('sign-in calls setPersistence then signInWithEmailAndPassword', async () => {
        render(<LoginInterface {...defaultProps} />);
        const form = screen.getByRole('button', { name: /Sign In/i }).closest('form');
        fillForm(form, 'user@test.com', 'pass123');

        await act(async () => {
            fireEvent.submit(form);
        });

        expect(setPersistence).toHaveBeenCalledTimes(1);
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            expect.anything(),
            'user@test.com',
            'pass123'
        );
    });

    test('sign-up calls createUserWithEmailAndPassword', async () => {
        render(<LoginInterface {...defaultProps} needCreate={true} />);
        const form = screen.getByRole('button', { name: /Sign Up/i }).closest('form');
        fillForm(form, 'new@test.com', 'newpass');

        await act(async () => {
            fireEvent.submit(form);
        });

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            expect.anything(),
            'new@test.com',
            'newpass'
        );
    });

    test('sign-up creates a user document in Firestore', async () => {
        render(<LoginInterface {...defaultProps} needCreate={true} />);
        const form = screen.getByRole('button', { name: /Sign Up/i }).closest('form');
        fillForm(form, 'new@test.com', 'newpass');

        await act(async () => {
            fireEvent.submit(form);
        });

        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ tasks: {}, timeSaved: 0 })
        );
    });
});
