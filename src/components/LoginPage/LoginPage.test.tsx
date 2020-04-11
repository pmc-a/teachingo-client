import React from 'react';
import LoginPage from './LoginPage';
import { act, fireEvent, render, waitForElement } from '@testing-library/react';
import { useAppState, UserTypes } from '../../state';
import { useHistory } from 'react-router-dom';

jest.mock('react-router-dom', () => {
    return {
        useLocation: jest.fn(),
        useHistory: jest.fn(),
    };
});
jest.mock('../../state');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseHistory = useHistory as jest.Mock<any>;

const mockReplace = jest.fn();
mockUseHistory.mockImplementation(() => ({ replace: mockReplace }));

xdescribe('the LoginPage component', () => {
    beforeEach(jest.clearAllMocks);

    it('should display error message when user authentication fails', async () => {
        const mockSignin = jest.fn(() =>
            Promise.reject(new Error('Test Error'))
        );
        mockUseAppState.mockImplementation(() => ({
            accessToken: null,
            signIn: mockSignin,
        }));
        const { getByLabelText, getByText } = render(<LoginPage />);

        act(() => {
            fireEvent.change(getByLabelText('Username'), {
                target: { value: 'mock-username' },
            });
        });

        act(() => {
            fireEvent.change(getByLabelText('Password'), {
                target: { value: 'mock-password' },
            });
        });

        act(() => {
            fireEvent.submit(getByText('Submit'));
        });

        const element = await waitForElement(() => getByText('Test Error'));
        expect(element).toBeTruthy();
    });

    describe('when user successfully logs in', () => {
        it('should redirect to "/teacher" when userType is teacher', () => {
            mockUseAppState.mockImplementation(() => ({
                accessToken: 'mock-access-token',
                signIn: () => Promise.resolve(),
                isAuthReady: true,
                userType: UserTypes.teacher,
            }));

            render(<LoginPage />);
            expect(mockReplace).toHaveBeenCalledWith('/teacher');
        });

        it('should redirect to "/student" when userType is student', () => {
            mockUseAppState.mockImplementation(() => ({
                accessToken: 'mock-access-token',
                signIn: () => Promise.resolve(),
                isAuthReady: true,
                userType: UserTypes.student,
            }));

            render(<LoginPage />);
            expect(mockReplace).toHaveBeenCalledWith('/student');
        });

        it('should redirect to "/" when userType is null', () => {
            mockUseAppState.mockImplementation(() => ({
                accessToken: 'mock-access-token',
                signIn: () => Promise.resolve(),
                isAuthReady: true,
                userType: null,
            }));

            render(<LoginPage />);
            expect(mockReplace).toHaveBeenCalledWith('/');
        });
    });
});
