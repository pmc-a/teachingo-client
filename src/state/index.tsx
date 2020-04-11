import React, { createContext, useContext, useState } from 'react';
import { TwilioError } from 'twilio-video';

export interface StateContextType {
    accessToken: string | null;
    error: TwilioError | null;
    setError(error: TwilioError | null): void;
    getToken(name: string, room: string, passcode?: string): Promise<string>;
    login(username: string, password: string): Promise<LoginResponse>;
    user?: null | {
        displayName: undefined;
        photoURL: undefined;
        passcode?: string;
    };
    signIn?(username: string, password: string): Promise<void>;
    signOut?(): Promise<void>;
    isAuthReady?: boolean;
    isFetching: boolean;
    userType: UserTypes;
}

export const StateContext = createContext<StateContextType | null>(null);

export enum UserTypes {
    student = 'student',
    teacher = 'teacher',
}

interface LoginResponse extends Response {
    parsedResponse?: {
        token: string;
        type: UserTypes;
    };
}

const apiDomain =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : 'HEROKU_DOMAIN';

export default function AppStateProvider(
    props: React.PropsWithChildren<{}>
): React.ReactElement {
    const [error, setError] = useState<TwilioError | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [userType, setUserType] = useState('');

    let contextValue = {
        accessToken,
        error,
        setError,
        isFetching,
        userType,
    } as StateContextType;

    contextValue = {
        ...contextValue,
        getToken: async (identity, roomName): Promise<string> => {
            const headers = new window.Headers();
            const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
            const params = new window.URLSearchParams({ identity, roomName });

            return fetch(`${endpoint}?${params}`, { headers }).then(res =>
                res.text()
            );
        },
        login: async (email, password): Promise<LoginResponse> => {
            const endpoint = `${apiDomain}/api/login`;

            return fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
        },
    };

    const getToken: StateContextType['getToken'] = (name, room) => {
        setIsFetching(true);
        return contextValue
            .getToken(name, room)
            .then(res => {
                setIsFetching(false);
                return res;
            })
            .catch(err => {
                setError(err);
                setIsFetching(false);
                return Promise.reject(err);
            });
    };

    const login: StateContextType['login'] = (email, password) => {
        setIsFetching(true);
        return contextValue
            .login(email, password)
            .then(async res => {
                if (res.status === 400 || res.status === 404) {
                    throw new Error('Incorrect username or password!');
                } else if (res.status >= 500) {
                    throw new Error('Something went wrong');
                }

                setIsFetching(false);
                res.parsedResponse = await res.json();

                if (res && res.parsedResponse && res.parsedResponse) {
                    // Do we maybe need to parse this into local storage?
                    // A browser refresh will clear this down because it's simply stored in React Context
                    setAccessToken(res.parsedResponse.token);
                    setUserType(res.parsedResponse.type);
                }

                return res;
            })
            .catch(err => {
                setError(err);
                setIsFetching(false);
                return Promise.reject(err);
            });
    };

    return (
        <StateContext.Provider value={{ ...contextValue, getToken, login }}>
            {props.children}
        </StateContext.Provider>
    );
}

export function useAppState(): StateContextType {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error('useAppState must be used within the AppStateProvider');
    }
    return context;
}
