import { combineReducers } from "redux";

import DashboardReducer from "./dashboard/reducer";
import HomeReducer from "./home/reducer";

const rootReducer = combineReducers({
  dashboardReducer: DashboardReducer,
  homeReducer: HomeReducer
});

export default rootReducer;
