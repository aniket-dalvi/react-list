import React from "react";
import render from "react-test-renderer";
import FriendListCard from "../../friend_list_card";

describe("friend list snapshot", () => {
  test("snapshot: ", () => {
    const mockData = [
      {
        name: "Demo",
        fav: false,
      },
      {
        name: "Demo1",
        fav: true,
      },
    ];

    const app = render
      .create(
        <FriendListCard
          list={mockData}
          currentPageNumber={0}
          updateList={(item) => console.log(item)}
          updatedIndex={(index) => console.log(index)}
        />
      ).toJSON();
    expect(app).toMatchSnapshot();
  });
});
