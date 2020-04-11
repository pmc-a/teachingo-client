import { Room, TwilioError } from 'twilio-video';
import { useEffect } from 'react';

import { Callback } from '../../../types';

export default function useHandleRoomDisconnectionErrors(
    room: Room,
    onError: Callback
): void {
    useEffect(() => {
        const onDisconnected = (room: Room, error: TwilioError): void => {
            if (error) {
                onError(error);
            }
        };

        room.on('disconnected', onDisconnected);
        return (): void => {
            room.off('disconnected', onDisconnected);
        };
    }, [room, onError]);
}
