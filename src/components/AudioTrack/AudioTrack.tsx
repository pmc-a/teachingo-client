import { useEffect } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';

interface Track {
    track: IAudioTrack;
}

export default function AudioTrack({ track }: Track): null {
    useEffect(() => {
        document.body.appendChild(track.attach());
        return (): void =>
            track.detach().forEach((el: HTMLMediaElement) => el.remove());
    }, [track]);
    return null;
}
