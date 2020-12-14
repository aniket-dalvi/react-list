import React from "react";
import render from "react-test-renderer";
import SearchTextfieldContainer from "../../search_textfield_container";

describe("snapshot test for search textfield container", () => {
    test("snapshot: ", () => {
        const app = render.create(<SearchTextfieldContainer/>).toJSON();
        expect(app).toMatchSnapshot();
    });
})