import { combineReducers } from "redux";

import auth from "./Auth.reducer";
import projects from "./Projects.reducer";
import main from "./Main.reducer";

export default combineReducers({ auth, projects, main });
