import React from 'react';
import { Room } from 'twilio-video';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            margin: theme.spacing(1),
        },
    })
);

export default function EndCallButton(): React.ReactElement {
    const classes = useStyles();
    const { room } = useVideoContext();

    return (
        <Tooltip
            title={'End Call'}
            onClick={(): Room => room.disconnect()}
            placement="top"
            PopperProps={{ disablePortal: true }}
        >
            <Fab className={classes.fab} color="primary">
                <CallEnd />
            </Fab>
        </Tooltip>
    );
}
