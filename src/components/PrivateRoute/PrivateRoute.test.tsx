import React from 'react';
import PrivateRoute from './PrivateRoute';
import { useAppState } from '../../state';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

const mockUseAppState = useAppState as jest.Mock<any>;

jest.mock('../../state');

const MockComponent = () => <h1>test</h1>;

describe('the PrivateRoute component', () => {
    it('should redirect to /login when there is no access token', () => {
        mockUseAppState.mockImplementation(() => ({
            accessToken: false,
            isAuthReady: true,
        }));
        const wrapper = mount(
            <MemoryRouter initialEntries={['/']}>
                <PrivateRoute exact path="/">
                    <MockComponent />
                </PrivateRoute>
            </MemoryRouter>
        );
        const history = wrapper.find('Router').prop('history') as any;
        expect(history.location.pathname).toEqual('/login');
        expect(wrapper.exists(MockComponent)).toBe(false);
    });

    it('should render children when there is a user', () => {
        mockUseAppState.mockImplementation(() => ({
            accessToken: 'mock-access-token',
            isAuthReady: true,
        }));
        const wrapper = mount(
            <MemoryRouter initialEntries={['/']}>
                <PrivateRoute exact path="/">
                    <MockComponent />
                </PrivateRoute>
            </MemoryRouter>
        );
        const history = wrapper.find('Router').prop('history') as any;
        expect(history.location.pathname).toEqual('/');
        expect(wrapper.exists(MockComponent)).toBe(true);
    });
});
