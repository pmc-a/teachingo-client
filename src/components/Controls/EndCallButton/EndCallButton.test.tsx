import React from 'react';
import { shallow } from 'enzyme';

import EndCallButton from './EndCallButton';

type MockRoom = {
    disconnect: Function;
};

const mockRoom: MockRoom = { disconnect: jest.fn() };
jest.mock('../../../hooks/useVideoContext/useVideoContext', () => (): any => ({
    room: mockRoom,
}));

describe('End Call button', () => {
    it('should disconnect from the room when clicked', () => {
        const wrapper = shallow(<EndCallButton />);
        wrapper.simulate('click');
        expect(mockRoom.disconnect).toHaveBeenCalled();
    });
});
