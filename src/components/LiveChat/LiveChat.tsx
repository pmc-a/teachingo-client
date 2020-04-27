import React, { useState } from 'react';
import io from 'socket.io-client';

import './LiveChat.css';

const apiDomain =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : 'https://protected-lowlands-54104.herokuapp.com';

const LiveChat: React.FC = () => {
    const [chatMessages, setChatMessages] = useState<string[]>([]);
    const [message, setMessage] = useState('');

    const socket = io(apiDomain);

    socket.on('new chat message', (newMsg: string) => {
        setChatMessages([...chatMessages, newMsg]);
    });

    const handleOnEnter = (event: any): void => {
        if (event.keyCode === 13 && message.length > 0) {
            socket.emit('chat message', message);
            setMessage('');
        }
    };

    const handleOnClick = (): void => {
        if (message.length > 0) {
            socket.emit('chat message', message);
            setMessage('');
        }
    };

    return (
        <div className="live-chat-wrapper">
            <h1>Live Chat</h1>
            <div>
                {chatMessages.map((chatMessage: string) => (
                    <div key={chatMessage}>{chatMessage}</div>
                ))}
            </div>
            <div className="input-wrapper">
                <input
                    className="chat-input"
                    type="text"
                    value={message}
                    onChange={(event): void => setMessage(event.target.value)}
                    onKeyDown={handleOnEnter}
                />

                <button
                    className="chat-input-button"
                    disabled={!message.length}
                    onClick={handleOnClick}
                >
                    <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
};

export default LiveChat;
