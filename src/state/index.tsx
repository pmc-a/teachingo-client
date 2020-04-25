import React, { createContext, useContext, useState } from 'react';
import { TwilioError } from 'twilio-video';

export interface StateContextType {
    accessToken: string | null;
    error: TwilioError | null;
    setError(error: TwilioError | null): void;
    getToken(lessonId?: number): Promise<string>;
    login(username: string, password: string): Promise<LoginResponse>;
    fetchLessons(): Promise<LessonsResponse>;
    user?: null | {
        displayName: undefined;
        photoURL: undefined;
        passcode?: string;
    };
    signIn?(username: string, password: string): Promise<void>;
    signOut?(): Promise<void>;
    isAuthReady?: boolean;
    isFetching: boolean;
    isVideoConnected: boolean;
    setIsVideoConnected: React.Dispatch<React.SetStateAction<boolean>>;
    shouldDisplaySummary: boolean;
    setShouldDisplaySummary: React.Dispatch<React.SetStateAction<boolean>>;
    userType: UserTypes;
    updateAttendance(lessonId?: number): Promise<Response>;
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

export interface Lesson extends Response {
    id: number;
    name: string;
    date_time: string;
}

interface LessonsResponse extends Response {
    lessons?: Lesson[];
}

const apiDomain =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : 'https://protected-lowlands-54104.herokuapp.com';

export default function AppStateProvider(
    props: React.PropsWithChildren<{}>
): React.ReactElement {
    const [error, setError] = useState<TwilioError | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isVideoConnected, setIsVideoConnected] = useState(false);
    const [shouldDisplaySummary, setShouldDisplaySummary] = useState(false);
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem('accessToken') || ''
    );
    const [userType, setUserType] = useState('');

    let contextValue = {
        accessToken,
        error,
        setError,
        isFetching,
        isVideoConnected,
        setIsVideoConnected,
        shouldDisplaySummary,
        setShouldDisplaySummary,
        userType,
    } as StateContextType;

    contextValue = {
        ...contextValue,
        getToken: async (lessonId): Promise<string> => {
            const endpoint = `${apiDomain}/api/token?lessonId=${lessonId}`;

            return fetch(endpoint, {
                method: 'GET',
                headers: {
                    authorization: accessToken,
                    'Content-Type': 'application/json',
                },
            }).then(res => res.text());
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
        fetchLessons: async (): Promise<LessonsResponse> => {
            const endpoint = `${apiDomain}/api/lessons`;

            return fetch(endpoint, {
                method: 'GET',
                headers: {
                    authorization: accessToken,
                    'Content-Type': 'application/json',
                },
            });
        },
        updateAttendance: async (lessonId): Promise<Response> => {
            const endpoint = `${apiDomain}/api/lessons/${lessonId}/attendance`;
            return fetch(endpoint, {
                method: 'PUT',
                headers: {
                    authorization: accessToken,
                    'Content-Type': 'application/json',
                },
            });
        },
    };

    const getToken: StateContextType['getToken'] = lessonId => {
        setIsFetching(true);
        return contextValue
            .getToken(lessonId)
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
                    localStorage.setItem(
                        'accessToken',
                        res.parsedResponse.token
                    );
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

    const fetchLessons: StateContextType['fetchLessons'] = () => {
        setIsFetching(true);
        return contextValue
            .fetchLessons()
            .then(async res => {
                if (res.status === 400 || res.status === 404) {
                    throw new Error('Incorrect username or password!');
                } else if (res.status >= 500) {
                    throw new Error('Something went wrong');
                }

                setIsFetching(false);
                return res;
            })
            .catch(err => {
                setError(err);
                setIsFetching(false);
                return Promise.reject(err);
            });
    };

    const updateAttendance: StateContextType['updateAttendance'] = (
        lessonId?: number
    ) => {
        return contextValue
            .updateAttendance(lessonId)
            .then(async res => {
                if (res.status >= 500) {
                    throw new Error('Something went wrong');
                }
                return res;
            })
            .catch(err => {
                setError(err);
                return Promise.reject(err);
            });
    };

    return (
        <StateContext.Provider
            value={{
                ...contextValue,
                getToken,
                login,
                fetchLessons,
                updateAttendance,
            }}
        >
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
