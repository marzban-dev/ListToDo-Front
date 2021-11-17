import { combineReducers } from "redux";

import auth from "./Auth.reducer";
import projects from "./Projects.reducer";
import inbox from "./Inbox.reducer";

export default combineReducers({ auth, projects, inbox });
