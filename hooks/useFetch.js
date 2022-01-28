import { useEffect, useReducer, useRef } from "react";
import hashCode from "../helper/hashcode";

function useFetch(url, options) {
  let controller = new AbortController();
  const { signal } = controller;
  const cache = useRef({});
  const requestHash = hashCode(url + options.body);

  const initialState = {
    data: false,
    error: false,
    loading: false,
  };

  const fetchReducer = (state = initialState, action) =>
    ({
      Loading: { ...initialState, loading: true },
      Success: { ...initialState, data: action.data, loading: false },
      Error: { ...initialState, error: action.error, loading: false },
      DEFAULT: state,
    }[action.type] || "DEFAULT");

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!url) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    controller = new AbortController();
    const optionsWithSignal = { ...options, signal };
    const fetchData = async () => {
      dispatch({ type: "Loading" });
      if (cache.current[requestHash]) {
        dispatch({ type: "Success", data: cache.current[requestHash] });
        return;
      }
      try {
        const response = await fetch(url, optionsWithSignal);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        cache.current[requestHash] = data;
        dispatch({ type: "Success", data });
      } catch (error) {
        dispatch({ type: "Error", error });
      }
    };
    fetchData();
    return () => controller.abort();
  }, [url, options]);

  return state;
}

export default useFetch;
