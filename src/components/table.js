import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setData } from "../redux/apiData";

function Table() {
  const [info, setInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(
      "https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entries"
    )
      .then((response) => response.json())
      .then((x) => {
        setInfo(x);
        setIsLoading(false);
        dispatch(setData(x));
      })
      .catch((error) => console.log(error));
  }, []);

  // Logic for displaying current data
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = info && info.slice(indexOfFirstData, indexOfLastData);

  // Logic for displaying page numbers
  const pageNumbers = [];
  if (info) {
    for (let i = 1; i <= Math.ceil(info.length / dataPerPage); i++) {
      pageNumbers.push(i);
    }
  }

  const handleRowClick = (id) => {
    window.history.pushState(null, null, `/entryId=${id}`);
  };

  return (
    <div className="margin">
      <table id="table">
        <tr>
          <th>Location</th>
          <th>ID</th>
          <th>Message</th>
        </tr>
        {currentData &&
          currentData.map((item) => (
            <tr key={item.Id} onClick={() => handleRowClick(item.Id)}>
              <td data-label="Location">{item.Address}</td>
              <td data-label="ID">{item.Id}</td>
              <td data-label="Message">{item.Notes}</td>
            </tr>
          ))}
      </table>
      <div className="pagination flex">
        <button
          disabled={currentPage === 1}
          className={currentPage === 1 ? "disabledBtn" : ""}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <div className="flex">
          <span>{currentPage}</span>
          <p>out of</p>
          <span>{pageNumbers.length}</span>
        </div>
        <button
          disabled={currentPage === pageNumbers.length}
          className={currentPage === pageNumbers.length ? "disabledBtn" : ""}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Table;
