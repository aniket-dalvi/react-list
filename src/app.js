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

function TextFieldContainer(props) {
  const [friendName, setFriendName] = useState("");

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      if (friendName) {
        const list = addNewFriend(friendName, props.list);
        props.getList(list, true);
        setFriendName("");
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

function sortByFav(arr) {
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

function FriendListCard({ list, currentPageNumber, updateList }) {
  const listData = list? [...list]: [];

  const onFavClick = (data, index) => {
    const listItems = JSON.parse(localStorage.getItem("list"));
    const currentIndex = currentPageNumber > 1 ? ((currentPageNumber-1)*4)+(index): currentPageNumber*index;
    listItems[currentIndex].fav = !data?.fav;
    
    const sortedList = sortByFav(listItems);
    localStorage.setItem("list", JSON.stringify(sortedList));
    updateList(currentIndex);
  };

  const onDeleteClick = (index) => {
    const listItems = JSON.parse(localStorage.getItem("list"));
    const currentIndex = currentPageNumber > 1 ? ((currentPageNumber-1)*4)+(index): currentPageNumber*index;
    delete listItems.splice(currentIndex, 1);
    
    const sortedList = sortByFav(listItems);
    localStorage.setItem("list", JSON.stringify(sortedList));
    updateList(currentIndex);
  };

  return listData.map((result, index) => (
    <div className="card" key={index}>
      <div className="card-data">
        <label className="card-label">{result?.name}</label>
        <label className="card-desc">is your friend</label>
      </div>
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
    </div>
  ));
}

function PaginationComponent(props) {
  const listItems = JSON.parse(localStorage.getItem("list"));
  const count = (listItems?.length / props.maxElement).toFixed();
  const totalPageCount = count >= (listItems?.length / props.maxElement) ? count: parseInt(count)+1;
  const [counter, setCounter] = useState(props.slot);
  const [selectedCounter, setSelectedCounter] = useState(1);

  useEffect(() => {
    const searchedList = [];
    const initial =
      selectedCounter === 1 ? 0 : props.maxElement * (selectedCounter - 1);
    for (let i = initial; i < props.maxElement * selectedCounter; i++) {
      if (listItems[i]) {
        searchedList.push(listItems[i]); 
      }
    }
    props.getList(searchedList);
  }, [selectedCounter]);

  const pageNo = [];
  for (let i = 1; i <= totalPageCount; i++) {
    pageNo.push(i);
  }

  return totalPageCount > 1 ? (
    <div className="pagination-container">
      {totalPageCount > props.slot && (
        <button
          className="next-prev"
          disabled={counter > props.slot? false: true}
          onClick={() => setCounter(counter - props.slot)}
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
          disabled={counter*props.maxElement < listItems.length? false: true}
          onClick={() => setCounter(counter + props.slot)}
        >
          <MdKeyboardArrowRight color={"#cccaca"} size={18} />
        </button>
      )}
    </div>
  ) : null;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App() {
  const listItems = JSON.parse(localStorage.getItem("list"));
  const [displayData, setDisplayData] = useState(null);
  const [isSearched, setSearchFlag] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

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
          />
        ) : (
          <div className="no-data">
            <label>You have not added any friend.</label>
          </div>
        )}
      </div>
      {listItems && !isSearched && (
        <PaginationComponent
          maxElement={4}
          getList={(list) => setDisplayData(list)}
          slot={5}
          currentPageNumber={(pageNo) => setPageNumber(pageNo)}
        />
      )}
    </>
  );
}

export default App;
