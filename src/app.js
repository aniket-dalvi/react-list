import React, { useState, useEffect, useRef } from "react";
import SearchTextFieldContaier from "../src/components/search_textfield_container";
import FriendListCard from "./components/friend_list_card";
import Pagination from "./components/pagination";
import "./app.css";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App() {
  const listItems = JSON.parse(localStorage.getItem("list"));
  const prevListItems = usePrevious(listItems);
  const [displayData, setDisplayData] = useState(null);
  const [isSearched, setSearchFlag] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxElement, setMaxElements] = useState(4);
  const [isUpdatedIndex, setUpdatedIndex] = useState(null);
  const [isUpdatedItem, setUpdate] = useState(null);
  const [resetList, setResetList] = useState(false);

  const getIndex = (arr) =>
    arr?.length && arr.findIndex((res) => res?.name === isUpdatedItem?.name);

  useEffect(() => {
    if (listItems?.length !== prevListItems?.length) {
      const searchedList = [];
      const initial = pageNumber === 1 ? 0 : maxElement * (pageNumber - 1);
      for (let i = initial; i < maxElement * pageNumber; i++) {
        if (listItems[i]) {
          searchedList.push(listItems[i]);
        }
      }
      setDisplayData(searchedList);
    } else {
      if (
        getIndex(prevListItems) === isUpdatedIndex &&
        prevListItems[isUpdatedIndex]?.fav !== isUpdatedItem?.fav
      ) {
        const searchedList = [];
        const initial = pageNumber === 1 ? 0 : maxElement * (pageNumber - 1);
        for (let i = initial; i < maxElement * pageNumber; i++) {
          if (listItems[i]) {
            searchedList.push(listItems[i]);
          }
        }
        setDisplayData(searchedList);
      }
    }
  }, [listItems]);

  const setFriendList = (list, isUpdated = false) => {
    setSearchFlag(!isUpdated);
    setDisplayData(list);
  };

  return (
    <>
      <div className="container">
        <SearchTextFieldContaier
          getList={(list, isUpdated) => setFriendList(list, isUpdated)}
          resetList={(val) => setSearchFlag(val)}
          list={listItems}
        />
        {listItems?.length ? (
          <FriendListCard
            list={displayData}
            currentPageNumber={pageNumber}
            updateList={(item) => setUpdate(item)}
            updatedIndex={(index) => setUpdatedIndex(index)}
            isSearched={isSearched}
          />
        ) : (
          <div className="no-data">
            <label>You have not added any friend.</label>
          </div>
        )}
      </div>
      {listItems && !isSearched && (
        <Pagination
          maxElement={maxElement}
          getList={(list) => {
            setDisplayData(list);
            setResetList(false);
          }}
          slot={5}
          activeCounter={pageNumber}
          resetList={resetList}
          currentPageNumber={(pageNo) => setPageNumber(pageNo)}
        />
      )}
    </>
  );
}

export default App;
