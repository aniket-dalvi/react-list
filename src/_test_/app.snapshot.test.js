import React from "react";
import render from "react-test-renderer";
import App from "../app";

describe("app snapshot test", () => {
  test("snapshot: ", () => {
    const app = render.create(<App />).toJSON();
    expect(app).toMatchSnapshot();
  });
});
