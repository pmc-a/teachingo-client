import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAppState } from '../../state';

export default function PrivateRoute({
    children,
    ...rest
}: RouteProps): React.ReactElement {
    const { accessToken } = useAppState();

    return (
        <Route
            {...rest}
            // eslint-disable-next-line
            render={({ location }) =>
                accessToken ? (
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
