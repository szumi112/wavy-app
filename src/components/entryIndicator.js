import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EntryIndicator() {
  const [currentLastEntry, setCurrentLastEntry] = useState();
  const [previousLastEntry, setPreviousLastEntry] = useState();
  const hasRendered = useRef(false);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        "https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entries"
      );
      const lastEntry = res.data[0].Id;
      setCurrentLastEntry(lastEntry);
    }
    fetchData();
    // This function runs every 20 seconds to prevent the server from being overloaded - it is also used to check for new entries and show a notification
    setInterval(fetchData, 20000);
  }, []);

  useEffect(() => {
    if (!previousLastEntry) {
      setPreviousLastEntry(currentLastEntry);
    }
  }, [currentLastEntry]);

  useEffect(() => {
    if (!hasRendered.current && currentLastEntry) {
      hasRendered.current = true;
    } else if (currentLastEntry !== previousLastEntry) {
      toast.info("New entry added to the API!");
    }
  }, [currentLastEntry, previousLastEntry]);

  return (
    <div className="margin">
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default EntryIndicator;
