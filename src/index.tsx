import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import AppStateProvider from './state';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom';
import VideoApp from './VideoApp';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import TeacherPage from './pages/TeacherPage/TeacherPage';
import StudentPage from './pages/StudentPage/StudentPage';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
            <AppStateProvider>
                <Switch>
                    <PrivateRoute exact path="/teacher">
                        <TeacherPage />
                    </PrivateRoute>
                    <PrivateRoute exact path="/student">
                        <StudentPage />
                    </PrivateRoute>
                    <PrivateRoute exact path="/">
                        <VideoApp />
                    </PrivateRoute>
                    <PrivateRoute path="/room/:URLRoomName">
                        <VideoApp />
                    </PrivateRoute>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </AppStateProvider>
        </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
);
