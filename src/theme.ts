import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        sidebarWidth: number;
    }

    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        sidebarWidth?: number;
    }
}

export default createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#5533ff',
        },
        secondary: {
            main: '#09ccff',
        },
    },
    sidebarWidth: 260,
});
