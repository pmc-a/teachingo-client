import { useCallback, useEffect, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack } from 'twilio-video';

export function useLocalAudioTrack(): LocalAudioTrack | undefined {
    const [track, setTrack] = useState<LocalAudioTrack>();

    useEffect(() => {
        Video.createLocalAudioTrack().then(newTrack => {
            setTrack(newTrack);
        });
    }, []);

    useEffect(() => {
        const handleStopped = (): void => setTrack(undefined);
        if (track) {
            track.on('stopped', handleStopped);
            return (): void => {
                track.off('stopped', handleStopped);
            };
        }
    }, [track]);

    return track;
}

export function useLocalVideoTrack(): [
    LocalVideoTrack | undefined,
    () => Promise<LocalVideoTrack>
] {
    const [track, setTrack] = useState<LocalVideoTrack>();

    const getLocalVideoTrack = useCallback(
        () =>
            Video.createLocalVideoTrack({
                frameRate: 24,
                height: 720,
                width: 1280,
                name: 'camera',
            }).then(newTrack => {
                setTrack(newTrack);
                return newTrack;
            }),
        []
    );

    useEffect(() => {
        // We get a new local video track when the app loads.
        getLocalVideoTrack();
    }, [getLocalVideoTrack]);

    useEffect(() => {
        const handleStopped = (): void => setTrack(undefined);
        if (track) {
            track.on('stopped', handleStopped);
            return (): void => {
                track.off('stopped', handleStopped);
            };
        }
    }, [track]);

    return [track, getLocalVideoTrack];
}

// eslint-disable-next-line
export default function useLocalTracks() {
    const audioTrack = useLocalAudioTrack();
    const [videoTrack, getLocalVideoTrack] = useLocalVideoTrack();

    const localTracks = [audioTrack, videoTrack].filter(
        track => track !== undefined
    ) as (LocalAudioTrack | LocalVideoTrack)[];

    return { localTracks, getLocalVideoTrack };
}
