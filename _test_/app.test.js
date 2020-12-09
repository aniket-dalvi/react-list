import React from 'react';
import render from 'react-test-renderer';
import { shallow } from 'enzyme';
import App from '../src/app';

test('app', () => {
    const app = render.create(<App/>).toJSON();
    expect(app).toMatchSnapshot();
});

describe('app suite', () => {
    it('should render without throwing an error', () => {
        expect(shallow(<App/>).contains(<label>You have not added any friend.</label>)).toBe(true);
    });

    // it('should mount in a full DOM', function() {
    //     expect(mount(<App />).find('.container').length).toBe(true);
    // });
});