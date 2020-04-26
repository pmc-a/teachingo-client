import React, { ChangeEvent, useState, FormEvent } from 'react';
import { useAppState, UserTypes } from '../../state';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {
    createMuiTheme,
    ThemeProvider,
    createStyles,
    Theme,
} from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: '100vh',
            backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
        paper: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '2em',
            marginTop: '15em',
            background: 'white',
            color: 'black',
        },
        button: {
            color: 'black',
            background: 'white',
            margin: '0.8em 0 0.7em',
            textTransform: 'none',
            height: '50px',
            width: '100px',
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
        form: {
            width: '60%',
        },
        textInput: {
            width: '100%',
        },
    })
);

const theme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

export default function LoginPage(): React.ReactElement {
    const classes = useStyles();
    const { login } = useAppState();
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [authError, setAuthError] = useState<Error | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setAuthError(null);
        login?.(email, password)
            .then(res => {
                if (res.parsedResponse?.type === UserTypes.teacher) {
                    history.replace({ pathname: '/teacher' });
                } else if (res.parsedResponse?.type === UserTypes.student) {
                    history.replace({ pathname: '/student' });
                } else {
                    history.replace({ pathname: '/' });
                }
            })
            .catch(err => setAuthError(err));
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid
                container
                justify="center"
                alignItems="flex-start"
                className={classes.container}
            >
                <Paper className={classes.paper} elevation={6}>
                    <img
                        width="60%"
                        src="https://i.imgur.com/EfvHtsz.png"
                        alt="Teachingo Logo"
                    />
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container alignItems="center" direction="column">
                            <TextField
                                id="input-username"
                                label="Username"
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ): void => setEmail(e.target.value)}
                                type="text"
                                className={classes.textInput}
                            />
                            <TextField
                                id="input-password"
                                label="Password"
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ): void => setPassword(e.target.value)}
                                type="password"
                                className={classes.textInput}
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
                                Log In
                            </Button>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </ThemeProvider>
    );
}
