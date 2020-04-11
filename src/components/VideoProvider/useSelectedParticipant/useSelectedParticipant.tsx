import React, { createContext, useContext, useState, useEffect } from 'react';
import { Participant, Room } from 'twilio-video';

type selectedParticipantContextType = [
    Participant | null,
    (participant: Participant) => void
];

export const selectedParticipantContext = createContext<
    selectedParticipantContextType
>(null!); // eslint-disable-line

export default function useSelectedParticipant(): [
    Participant | null,
    (participant: Participant) => void
] {
    const [selectedParticipant, setSelectedParticipant] = useContext(
        selectedParticipantContext
    );
    return [selectedParticipant, setSelectedParticipant];
}

type SelectedParticipantProviderProps = {
    room: Room;
    children: React.ReactNode;
};

export function SelectedParticipantProvider({
    room,
    children,
}: SelectedParticipantProviderProps): React.ReactElement {
    const [
        selectedParticipant,
        _setSelectedParticipant,
    ] = useState<Participant | null>(null);
    const setSelectedParticipant = (participant: Participant): void =>
        _setSelectedParticipant(prevParticipant =>
            prevParticipant === participant ? null : participant
        );

    useEffect(() => {
        const onDisconnect = (): void => _setSelectedParticipant(null);
        room.on('disconnected', onDisconnect);
        return (): void => {
            room.off('disconnected', onDisconnect);
        };
    }, [room]);

    return (
        <selectedParticipantContext.Provider
            value={[selectedParticipant, setSelectedParticipant]}
        >
            {children}
        </selectedParticipantContext.Provider>
    );
}
