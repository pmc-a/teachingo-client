import React from 'react';
import { shallow } from 'enzyme';

import Component from './TeacherPage';

jest.mock('../../state', () => ({
    useAppState: jest.fn().mockReturnValue({
        fetchLessons: jest.fn(),
    }),
}));

describe('TeacherPage', () => {
    it('should successfully render', () => {
        expect(shallow(<Component />)).toMatchSnapshot();
    });
});
