import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAppState } from '../../state';

export default function PrivateRoute({
    children,
    ...rest
}: RouteProps): React.ReactElement {
    const { user } = useAppState();

    return (
        <Route
            {...rest}
            // eslint-disable-next-line
            render={({ location }) =>
                user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
}
