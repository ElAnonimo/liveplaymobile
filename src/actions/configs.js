import axios from "axios";
import { GET_CONFIGS, SET_LOADING } from "./types";

const BASE_URL = "https://71x3eni3og.execute-api.us-west-2.amazonaws.com/testcase/process/";

axios.defaults.headers.common.authorization = "Basic SuperKey";

// get all configs
export const getConfigs = () => async dispatch => {
  dispatch(setLoading());

  try {
    const res = await axios.get(BASE_URL);

    dispatch({
      type: GET_CONFIGS,
      payload: res.data
    });
  } catch(err) {
    console.log("Error fetching configs:", err.response);
  }
};

// edit config
export const editConfig = (id, data) => async dispatch => {
  dispatch(setLoading());

  try {
    await axios.post(BASE_URL, { item_id: id, data });
    const res = await axios.get(BASE_URL);

    dispatch({
      type: GET_CONFIGS,
      payload: res.data
    });
  } catch(err) {
    console.log("Error updating config:", err.response);
  }
};

// add config
export const addConfig = data => async dispatch => {
  dispatch(setLoading());

  try {
    await axios.post(BASE_URL, data);
    const res = await axios.get(BASE_URL);

    dispatch({
      type: GET_CONFIGS,
      payload: res.data
    });
  } catch(err) {
    console.log("Error adding config:", err.response);
  }
};

const setLoading = () => ({
  type: SET_LOADING
});
