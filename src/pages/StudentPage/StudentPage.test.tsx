import React from 'react';
import { shallow } from 'enzyme';

import Component from './StudentPage';

jest.mock('../../state', () => ({
    useAppState: () => ({
        isVideoConnected: false,
    }),
}));

describe('StudentPage', () => {
    it('should successfully render', () => {
        expect(shallow(<Component />)).toMatchSnapshot();
    });
});
