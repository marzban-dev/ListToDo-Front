import React from "react";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import SideMenu from "components/SideMenu/SideMenu";
import AppRoutes from "App.routes";
import {ToastContainer} from "react-toastify";
import Loading from "components/Loading/Loading";
import {
    checkUser,
    finishPreAuth,
    startPreAuth,
} from "store/actions/Auth.actions";
import {fetchData} from "./store/actions/Main.actions";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.min.css";
import "assets/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.scss";
import "./assets/scss/theme/themes.scss";
import "animate.css";

const App = () => {
    const dispatch = useDispatch();
    const preAuth = useSelector((state) => state.auth.preAuth);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fn = async () => {
            const currentPath = location.pathname;
            dispatch(startPreAuth());

            try {
                await dispatch(checkUser())
                await dispatch(fetchData())
                dispatch(finishPreAuth());
                navigate(currentPath);
            } catch (error) {
                dispatch(finishPreAuth());
                navigate('/');
            }
        }
        fn();
    }, []);

    return (
        <div className="App" id="app">
            <ToastContainer/>
            {location.pathname === "/login" ||
            location.pathname === "/signup" ? null : (
                <SideMenu/>
            )}
            {preAuth ? <AppRoutes/> : <Loading/>}
        </div>
    );
};

export default App;
