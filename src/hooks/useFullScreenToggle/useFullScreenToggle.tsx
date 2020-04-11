import { useCallback, useState, useEffect } from 'react';
import fscreen from 'fscreen';

export default function useFullScreenToggle(): [boolean, () => void] {
    const [isFullScreen, setIsFullScreen] = useState<boolean>(
        !!fscreen.fullscreenElement
    );

    useEffect(() => {
        const onFullScreenChange = (): void =>
            setIsFullScreen(!!fscreen.fullscreenElement);
        fscreen.addEventListener('fullscreenchange', onFullScreenChange);
        return (): void => {
            fscreen.removeEventListener('fullscreenchange', onFullScreenChange);
        };
    }, []);

    const toggleFullScreen = useCallback(() => {
        isFullScreen
            ? fscreen.exitFullscreen()
            : fscreen.requestFullscreen(document.documentElement);
    }, [isFullScreen]);

    return [isFullScreen, toggleFullScreen];
}
