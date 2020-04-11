import React from 'react';
import { shallow } from 'enzyme';

import Component from './TeacherPage';

describe('TeacherPage', () => {
    it('should successfully render', () => {
        expect(shallow(<Component />)).toMatchSnapshot();
    });
});
