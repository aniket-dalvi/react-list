import React from 'react';
import render from 'react-test-renderer';
import App from '../src/app';

test('app', () => {
    const app = render.create(<App/>).toJSON();
    expect(app).toMatchSnapshot();
});