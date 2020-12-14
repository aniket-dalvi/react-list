import React, { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import "./styles.css";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Pagination(props) {
  const listItems = JSON.parse(localStorage.getItem("list"));
  const count = (listItems?.length / props.maxElement).toFixed();
  const totalPageCount =
    count >= listItems?.length / props.maxElement ? count : parseInt(count) + 1;
  const prevPageCount = usePrevious(totalPageCount);

  const [counter, setCounter] = useState(props.slot);
  const [selectedCounter, setSelectedCounter] = useState(props.activeCounter);
  const [pageNo, setPageNo] = useState([]);

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

  useEffect(() => {
    const pageNoArr = [];
    for (let i = 1; i <= totalPageCount; i++) {
      pageNoArr.push(i);
    }
    setPageNo(pageNoArr);

    if (prevPageCount > totalPageCount) {
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

export default Pagination;
