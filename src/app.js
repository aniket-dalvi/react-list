import React, { useState, useEffect, useRef } from "react";
import {
  MdStar,
  MdStarBorder,
  MdDelete,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import "./app.css";

function addNewFriend(name, friendList) {
  return friendList
    ? [...friendList, { name, fav: false }]
    : [{ name, fav: false }];
}

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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function TextFieldContainer(props) {
  const [friendName, setFriendName] = useState("");

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      if (friendName) {
        const existingUser = props?.list?.findIndex(
          (result) => (result.name).toLowerCase() == friendName.toLowerCase()
        );
        if (existingUser === -1 || !props) {
          const list = addNewFriend(friendName, props.list);
          localStorage.setItem("list", JSON.stringify(list));
          props.getList(list, true);
          setFriendName("");
        } else {
          alert("This friend already exist in your list.");
        }
      } else {
        alert("Please enter friend name.");
      }
    }
  };

  const onChangeText = (name) => {
    setFriendName(name);
    if (name) {
      const searchedArr = props.list?.filter((result) =>
        result.name.toLowerCase().includes(name.toLowerCase())
      );
      props.getList(searchedArr);
    } else {
      props.resetList(false);
    }
  };

  return (
    <div className="textfield-wrapper">
      <label className="header">Friends List</label>
      <input
        placeholder="Enter your friend's name"
        value={friendName}
        onKeyPress={(e) => onKeyPress(e)}
        onChange={(e) => onChangeText(e.target.value)}
      />
    </div>
  );
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
        <label className="card-desc">is your friend</label>
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

function PaginationComponent(props) {
  const listItems = JSON.parse(localStorage.getItem("list"));
  const count = (listItems?.length / props.maxElement).toFixed();
  const totalPageCount =
    count >= listItems?.length / props.maxElement ? count : parseInt(count) + 1;
  const prevPageCount = usePrevious(totalPageCount);
  
  const [counter, setCounter] = useState(props.slot);
  const [selectedCounter, setSelectedCounter] = useState(props.activeCounter);
  const [pageNo, setPageNo] = useState([])
 
  useEffect(() => {
    const searchedList = [];
    console.log("selectedCounter", selectedCounter);
    const initial =
      selectedCounter === 1 ? 0 : props.maxElement * (selectedCounter - 1);
      console.log("initial", initial)
    for (let i = initial; i < props.maxElement * selectedCounter; i++) {
      if (listItems[i]) {
        searchedList.push(listItems[i]);
      }
    }
    console.log(searchedList)
    props.getList(searchedList);
  }, [selectedCounter]);

  useEffect(() => {
    const pageNoArr = [];
    for (let i = 1; i <= totalPageCount; i++) {
      pageNoArr.push(i);
    }
    setPageNo(pageNoArr);
    console.log("prevPageCount", prevPageCount);
    console.log("totalPageCount", totalPageCount);
    if(prevPageCount > totalPageCount) {
      setSelectedCounter(parseInt(selectedCounter));
      props.currentPageNumber(selectedCounter);
    } 
  }, [totalPageCount]);
  
  return totalPageCount > 1 ? (
    <div className="pagination-container">
      {totalPageCount > props.slot && (
        <button
          className="next-prev"
          disabled={counter > props.slot ? false : true}
          onClick={() => {
            setCounter(counter - props.slot);
          }}
        >
          <MdKeyboardArrowLeft color={"#cccaca"} size={18} />
        </button>
      )}
      {pageNo?.map((result, index) => {
        if (counter >= result && counter - props.slot < result) {
          return (
            <div className="pagination-counter" key={index}>
              <a
                style={
                  parseInt(selectedCounter) === parseInt(result)
                    ? {
                        borderBottomWidth: 1,
                        borderBottomColor: "black",
                        borderBottomStyle: "solid",
                      }
                    : null
                }
                onClick={() => {
                  setSelectedCounter(parseInt(result));
                  props.currentPageNumber(result);
                }}
              >
                {result}
              </a>
            </div>
          );
        }
      })}
      {totalPageCount > props.slot && (
        <button
          className="next-prev"
          disabled={
            counter * props.maxElement < listItems.length ? false : true
          }
          onClick={() => {
            setCounter(counter + props.slot);
          }}
        >
          <MdKeyboardArrowRight color={"#cccaca"} size={18} />
        </button>
      )}
    </div>
  ) : null;
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
        <TextFieldContainer
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
        <PaginationComponent
          maxElement={maxElement}
          getList={(list) => {
            setDisplayData(list);
            setResetList(false);
          }}
          slot={5}
          activeCounter={pageNumber}
          resetList={resetList}
          currentPageNumber={(pageNo) => {
            console.log("pageNo:", pageNo)
            setPageNumber(pageNo)
          }}
        />
      )}
    </>
  );
}

export default App;
