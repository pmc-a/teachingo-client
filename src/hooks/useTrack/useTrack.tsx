import { useEffect, useState } from 'react';
import { LocalTrackPublication, RemoteTrackPublication } from 'twilio-video';

// eslint-disable-next-line
export default function useTrack(
    publication: LocalTrackPublication | RemoteTrackPublication | undefined
) {
    const [track, setTrack] = useState(publication && publication.track);

    useEffect(() => {
        // Reset the track when the 'publication' variable changes.
        setTrack(publication && publication.track);

        if (publication) {
            const removeTrack = (): void => setTrack(null);

            publication.on('subscribed', setTrack);
            publication.on('unsubscribed', removeTrack);
            return (): void => {
                publication.off('subscribed', setTrack);
                publication.off('unsubscribed', removeTrack);
            };
        }
    }, [publication]);

    return track;
}
