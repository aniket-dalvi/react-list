import React from "react";
import render from "react-test-renderer";
import Pagination from "../../pagination";

describe("snapshot test for pagination", () => {
  test("snapshot: ", () => {
    const app = render
      .create(
        <Pagination
          maxElement={2}
          getList={(list) => console.log(list)}
          slot={5}
          activeCounter={1}
          currentPageNumber={(pageno) => console.log(pageno)}
        />
      )
      .toJSON();
    expect(app).toMatchSnapshot();
  });
});
