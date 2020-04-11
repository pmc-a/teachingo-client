import React from 'react';
import { shallow } from 'enzyme';

import Component from './StudentPage';

describe('StudentPage', () => {
    it('should successfully render', () => {
        expect(shallow(<Component />)).toMatchSnapshot();
    });
});
