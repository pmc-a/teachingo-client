import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../../state';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            margin: theme.spacing(1),
        },
    })
);

export default function EndCallButton(): React.ReactElement {
    const appState = useAppState();

    const classes = useStyles();
    const { room } = useVideoContext();

    const handleDisconnectCall = (): void => {
        room.disconnect();
        appState.setIsVideoConnected(false);

        if (appState.userType === 'teacher') {
            appState.setShouldDisplaySummary(true);
        }
    };

    return (
        <Tooltip
            title={'End Call'}
            onClick={handleDisconnectCall}
            placement="top"
            PopperProps={{ disablePortal: true }}
        >
            <Fab className={classes.fab} color="primary">
                <CallEnd />
            </Fab>
        </Tooltip>
    );
}
