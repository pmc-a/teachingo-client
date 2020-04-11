import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export function getPasscode(): string | null {
    const match = window.location.search.match(/passcode=(.*)&?/);
    const passcode = match
        ? match[1]
        : window.sessionStorage.getItem('passcode');
    return passcode;
}

export function fetchToken(
    name: string,
    room: string,
    passcode: string
): Promise<Response> {
    return fetch(`/token`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            user_identity: name, // eslint-disable-line
            room_name: room, // eslint-disable-line
            passcode,
        }),
    });
}

// eslint-disable-next-line
export function verifyPasscode(passcode: string) {
    return fetchToken('temp-name', 'temp-room', passcode).then(async res => {
        const jsonResponse = await res.json();
        if (res.status === 401) {
            return { isValid: false, error: jsonResponse.error?.message };
        }

        if (res.ok && jsonResponse.token) {
            return { isValid: true };
        }
    });
}

export function getErrorMessage(message: string): string {
    switch (message) {
        case 'passcode incorrect':
            return 'Passcode is incorrect';
        case 'passcode expired':
            return 'Passcode has expired';
        default:
            return message;
    }
}

// eslint-disable-next-line
export default function usePasscodeAuth() {
    const history = useHistory();

    const [user, setUser] = useState<{
        displayName: undefined;
        photoURL: undefined;
        passcode: string;
    } | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const getToken = useCallback(
        (name: string, room: string) => {
            // eslint-disable-next-line
            return fetchToken(name, room, user!.passcode)
                .then(async res => {
                    if (res.ok) {
                        return res;
                    }
                    const json = await res.json();
                    const errorMessage = getErrorMessage(
                        json.error?.message || res.statusText
                    );
                    throw Error(errorMessage);
                })
                .then(res => res.json())
                .then(res => res.token as string);
        },
        [user]
    );

    useEffect(() => {
        const passcode = getPasscode();

        if (passcode) {
            verifyPasscode(passcode)
                .then(verification => {
                    if (verification?.isValid) {
                        // eslint-disable-next-line
                        setUser({ passcode } as any);
                        window.sessionStorage.setItem('passcode', passcode);
                        history.replace(window.location.pathname);
                    }
                })
                .then(() => setIsAuthReady(true));
        } else {
            setIsAuthReady(true);
        }
    }, [history]);

    const signIn = useCallback((passcode: string) => {
        return verifyPasscode(passcode).then(verification => {
            if (verification?.isValid) {
                // eslint-disable-next-line
                setUser({ passcode } as any);
                window.sessionStorage.setItem('passcode', passcode);
            } else {
                throw new Error(getErrorMessage(verification?.error));
            }
        });
    }, []);

    const signOut = useCallback(() => {
        setUser(null);
        window.sessionStorage.removeItem('passcode');
        return Promise.resolve();
    }, []);

    return { user, isAuthReady, getToken, signIn, signOut };
}
