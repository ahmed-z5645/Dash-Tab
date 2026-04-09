import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ToDoList from './toDo';
import { onAuthStateChanged, signOut } from 'firebase/auth/web-extension';
import { onSnapshot, setDoc, deleteDoc, doc } from 'firebase/firestore';

jest.mock('../../firebase.js', () => ({ auth: {}, db: {} }));

jest.mock('firebase/auth/web-extension', () => ({
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    onSnapshot: jest.fn(),
    setDoc: jest.fn(),
    deleteDoc: jest.fn(),
    collection: jest.fn(() => 'mock-coll-ref'),
    doc: jest.fn(() => 'mock-doc-ref'),
}));

const mockUser = { uid: 'test-uid-123' };

describe('ToDoList', () => {
    let authCallback;
    let snapCallback;

    beforeEach(() => {
        jest.clearAllMocks();
        authCallback = null;
        snapCallback = null;

        onAuthStateChanged.mockImplementation((_auth, cb) => {
            authCallback = cb;
            return jest.fn();
        });

        onSnapshot.mockImplementation((_ref, cb) => {
            snapCallback = cb;
            return jest.fn();
        });

        signOut.mockResolvedValue(undefined);
        setDoc.mockResolvedValue(undefined);
        deleteDoc.mockResolvedValue(undefined);
        doc.mockReturnValue('mock-doc-ref');
    });

    const fireAuth = (user) =>
        act(async () => { authCallback(user); });

    const fireSnapshot = (tasks = []) =>
        act(async () => {
            snapCallback({ docs: tasks.map((t) => ({ data: () => t })) });
        });

    test('shows login interface when not authenticated', async () => {
        render(<ToDoList />);
        await fireAuth(null);
        expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });

    test('shows sign-out button when authenticated', async () => {
        render(<ToDoList />);
        await fireAuth(mockUser);
        await fireSnapshot();
        expect(screen.getByText(/Sign-Out/i)).toBeInTheDocument();
    });

    test('renders tasks from snapshot', async () => {
        const task = { Title: 'Buy groceries', tOfCreate: 1000000000, completed: false };
        render(<ToDoList />);
        await fireAuth(mockUser);
        await fireSnapshot([task]);
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });

    test('renders multiple tasks from snapshot', async () => {
        const tasks = [
            { Title: 'Task A', tOfCreate: 1000000001, completed: false },
            { Title: 'Task B', tOfCreate: 1000000002, completed: false },
        ];
        render(<ToDoList />);
        await fireAuth(mockUser);
        await fireSnapshot(tasks);
        expect(screen.getByText('Task A')).toBeInTheDocument();
        expect(screen.getByText('Task B')).toBeInTheDocument();
    });

    test('calls setDoc with correct data when adding a task', async () => {
        render(<ToDoList />);
        await fireAuth(mockUser);
        await fireSnapshot();

        fireEvent.change(screen.getByPlaceholderText('New Note'), {
            target: { value: 'New task title' },
        });
        await act(async () => {
            fireEvent.submit(screen.getByPlaceholderText('New Note').closest('form'));
        });

        expect(setDoc).toHaveBeenCalledTimes(1);
        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ Title: 'New task title', completed: false })
        );
    });

    test('clears the input after adding a task', async () => {
        render(<ToDoList />);
        await fireAuth(mockUser);
        await fireSnapshot();

        const input = screen.getByPlaceholderText('New Note');
        fireEvent.change(input, { target: { value: 'Temp task' } });
        await act(async () => {
            fireEvent.submit(input.closest('form'));
        });

        expect(input.value).toBe('');
    });

    test('calls deleteDoc when delete button is clicked', async () => {
        const task = { Title: 'Delete me', tOfCreate: 999999, completed: false };
        render(<ToDoList />);
        await fireAuth(mockUser);
        await fireSnapshot([task]);

        await act(async () => {
            fireEvent.click(document.querySelector('.task-button'));
        });

        expect(deleteDoc).toHaveBeenCalledTimes(1);
    });

    test('calls signOut when sign-out button is clicked', async () => {
        render(<ToDoList />);
        await fireAuth(mockUser);
        await fireSnapshot();

        fireEvent.click(screen.getByText(/Sign-Out/i));
        expect(signOut).toHaveBeenCalledTimes(1);
    });
});
