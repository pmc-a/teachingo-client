import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core';

interface Props {
    pageName: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.primary.main,
            backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            height: '4.5rem',
        },
        logoWrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        pageName: {
            color: 'white',
            fontWeight: 'bold',
            marginLeft: '10px',
            fontSize: '25px',
        },
        logout: {
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '17px',
            color: 'white',
        },
    })
);

const Navbar: React.FC<Props> = ({ pageName }: Props) => {
    const classes = useStyles();

    const handleLogout = (): void => {
        localStorage.clear();
        // eslint-disable-next-line
        location.reload();
    };

    return (
        <div className={classes.container}>
            <div className={classes.logoWrapper}>
                <img
                    src="https://i.imgur.com/eGkNfjE.png"
                    height="60px"
                    alt="Teachingo Logo"
                />
                <span className={classes.pageName}>{pageName}</span>
            </div>
            <button onClick={handleLogout} className={classes.logout}>
                Log out
            </button>
        </div>
    );
};

export default Navbar;
