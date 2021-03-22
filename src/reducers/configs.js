import { GET_CONFIGS, SET_LOADING } from "../actions/types";

const initialState = {
  configs: [],
  loading: false
};

const configs = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CONFIGS:
      return {
        ...state,
        configs: action.payload,
        loading: false
      };
    default:
      return state
  }
};

export default configs;
