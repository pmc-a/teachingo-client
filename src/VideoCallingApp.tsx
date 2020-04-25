import React, { useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';

import useRoomState from './hooks/useRoomState/useRoomState';
import useVideoContext from './hooks/useVideoContext/useVideoContext';

import './VideoCallingApp.css';

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '70vh',
    height: '100%',
});

const Main = styled('main')({
    height: '100%',
    position: 'relative',
});

export default function App({
    twilioToken,
}: {
    twilioToken?: string;
}): React.ReactElement {
    const { isConnecting, connect } = useVideoContext();

    const roomState = useRoomState();

    const connectToTwilio = (): void => {
        if (twilioToken) {
            connect(twilioToken);
        }
    };

    return (
        <Container>
            <Main>
                {roomState === 'disconnected' ? (
                    <>
                        <div className="connection-wrapper">
                            <Button
                                color="primary"
                                className="connect-button"
                                variant="contained"
                                onClick={connectToTwilio}
                            >
                                Connect to meeting
                            </Button>
                            {isConnecting && <CircularProgress />}
                        </div>
                        <LocalVideoPreview />
                    </>
                ) : (
                    <Room />
                )}
                <Controls />
            </Main>
            <ReconnectingNotification />
        </Container>
    );
}
