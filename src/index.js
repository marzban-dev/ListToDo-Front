import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import store from "store/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <Provider store={store}>
                <App/>
            </Provider>
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
);

reportWebVitals();
