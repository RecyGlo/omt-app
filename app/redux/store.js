import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import reducer from "./reducers/rootReducer";

const createAppStore = initialState => {
 return createStore(
   reducer,
   initialState,
   composeWithDevTools(applyMiddleware(thunk))
 );
};
export default createAppStore;

