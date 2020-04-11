import { Room } from 'twilio-video';
import { useEffect } from 'react';

import { Callback } from '../../../types';

export default function useHandleTrackPublicationFailed(
    room: Room,
    onError: Callback
): void {
    const { localParticipant } = room;
    useEffect(() => {
        if (localParticipant) {
            localParticipant.on('trackPublicationFailed', onError);
            return (): void => {
                localParticipant.off('trackPublicationFailed', onError);
            };
        }
    }, [localParticipant, onError]);
}
