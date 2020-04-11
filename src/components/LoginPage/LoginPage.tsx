import React, { ChangeEvent, useState, FormEvent } from 'react';
import { useAppState } from '../../state';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    container: {
        height: '100vh',
        background: '#0D122B',
    },
    twilioLogo: {
        width: '55%',
        display: 'block',
    },
    videoLogo: {
        width: '25%',
        padding: '2.4em 0 2.1em',
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '2em',
        marginTop: '4em',
        background: 'white',
        color: 'black',
    },
    button: {
        color: 'black',
        background: 'white',
        margin: '0.8em 0 0.7em',
        textTransform: 'none',
    },
    errorMessage: {
        color: 'red',
        display: 'flex',
        alignItems: 'center',
        margin: '1em 0 0.2em',
        '& svg': {
            marginRight: '0.4em',
        },
    },
});

const theme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

export default function LoginPage(): React.ReactElement {
    const classes = useStyles();
    const { login, user } = useAppState();
    const history = useHistory();
    const location = useLocation<{ from: Location }>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [authError, setAuthError] = useState<Error | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setAuthError(null);
        login?.(email, password)
            .then(response => {
                alert(`Success! ${response}`);
                history.replace(location?.state?.from || { pathname: '/' });
            })
            .catch(err => setAuthError(err));
    };

    if (user) {
        history.replace('/');
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid
                container
                justify="center"
                alignItems="flex-start"
                className={classes.container}
            >
                <Paper className={classes.paper} elevation={6}>
                    <h1>Login</h1>

                    <form onSubmit={handleSubmit}>
                        <Grid container alignItems="center" direction="column">
                            <TextField
                                id="input-username"
                                label="Username"
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ): void => setEmail(e.target.value)}
                                type="text"
                            />
                            <TextField
                                id="input-password"
                                label="Password"
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ): void => setPassword(e.target.value)}
                                type="password"
                            />
                            <div>
                                {authError && (
                                    <Typography
                                        variant="caption"
                                        className={classes.errorMessage}
                                    >
                                        <ErrorOutlineIcon />
                                        {authError.message}
                                    </Typography>
                                )}
                            </div>
                            <Button
                                variant="contained"
                                className={classes.button}
                                type="submit"
                                disabled={!email.length || !password.length}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </ThemeProvider>
    );
}
