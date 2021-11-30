import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  checkUser,
  finishPreAuth,
  startPreAuth,
} from "store/actions/Auth.actions";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideMenu from "components/SideMenu/SideMenu";
import AppRoutes from "App.routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.min.css";
import "assets/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.scss";
import Loading from "components/Loading/Loading";
import "./assets/scss/theme/themes.scss";
import "animate.css";

const App = () => {
  const dispatch = useDispatch();
  const preAuth = useSelector((state) => state.auth.preAuth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    dispatch(startPreAuth());

    dispatch(checkUser()).then(() => {
      navigate(currentPath);
      dispatch(finishPreAuth());
    });
  }, []);

  return (
    <div className="App" id="app">
      <ToastContainer />
      {location.pathname === "/login" ||
      location.pathname === "/signup" ? null : (
        <SideMenu />
      )}
      {preAuth ? <AppRoutes /> : <Loading />}
    </div>
  );
};

export default App;
