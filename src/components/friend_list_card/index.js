import React from "react";
import { MdStar, MdStarBorder, MdDelete } from "react-icons/md";
import "./styles.css";

function sortData(arr) {
  const favFriendArr = [];
  const normalFriendArr = [];
  arr.forEach((result) => {
    if (result?.fav) {
      favFriendArr.push(result);
    } else {
      normalFriendArr.push(result);
    }
  });
  return [...favFriendArr, ...normalFriendArr];
}

function FriendListCard({
  list,
  currentPageNumber,
  updateList,
  updatedIndex,
  isSearched,
}) {
  const listData = list ? [...list] : [];

  const onFavClick = (data, index) => {
    const listItems = JSON.parse(localStorage.getItem("list"));
    const currentIndex =
      currentPageNumber > 1
        ? (currentPageNumber - 1) * 4 + index
        : currentPageNumber * index;
    listItems[currentIndex].fav = !data?.fav;
    const sortedList = sortData(listItems);
    localStorage.setItem("list", JSON.stringify(sortedList));
    updatedIndex(currentIndex);
    updateList(listItems[currentIndex]);
  };

  const onDeleteClick = (index) => {
    const listItems = JSON.parse(localStorage.getItem("list"));
    const currentIndex =
      currentPageNumber > 1
        ? (currentPageNumber - 1) * 4 + index
        : currentPageNumber * index;
    delete listItems.splice(currentIndex, 1);

    const sortedList = sortData(listItems);
    localStorage.setItem("list", JSON.stringify(sortedList));
    updatedIndex(currentIndex);
    updateList(listItems[currentIndex]);
  };

  return listData.map((result, index) => (
    <div className="card" key={index}>
      <div className="card-data">
        <label className="card-label">{result?.name}</label>
        <label className="card-desc">is yours friend</label>
      </div>
      {!isSearched && (
        <div className="card-actions">
          <button
            className={`card-actions-btn${result?.fav ? "-fav" : ""} `}
            onClick={() => onFavClick(result, index)}
          >
            {result.fav ? (
              <MdStar color={"#fff76a"} size={18} />
            ) : (
              <MdStarBorder color={"#cccaca"} size={18} />
            )}
          </button>
          <button
            className="card-actions-btn"
            onClick={() => onDeleteClick(index)}
          >
            <MdDelete color={"#cccaca"} size={18} />
          </button>
        </div>
      )}
    </div>
  ));
}

export default FriendListCard;
