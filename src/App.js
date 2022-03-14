import React, {useEffect, useState} from "react";
import {ReactQueryDevtools} from "react-query/devtools";
import {useDispatch} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Modal from "react-modal";
import SideMenu from "components/SideMenu";
import LoadingScreen from "components/UI/LoadingScreen";
import {setAppTheme} from "store/actions/Main.actions";
import Header from "./components/Header";
import {useCheckUserQuery} from "hooks/useAuth";
import {useLabelsQuery} from "hooks/useDetailsData";
import {instance} from "axios.instance";
import {useInboxProjectQuery} from "hooks/useProjectsData";
import AppRoutes from "App.routes";
import ReactTooltip from "react-tooltip";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.min.css";
import "assets/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.scss";
import "./assets/scss/theme/themes.scss";
import "animate.css";

const App = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    Modal.setAppElement('body');
    dispatch(setAppTheme());

    const currentPath = location.pathname;
    const {data: authedUser} = useCheckUserQuery();

    useLabelsQuery({enabled: !!authedUser});

    const {isFetchedAfterMount: isInboxFetched} = useInboxProjectQuery({
        enabled: !!authedUser,
        onSuccess: () => navigate(currentPath)
    })

    useEffect(() => {
        instance.interceptors.request.use(null, error => {
            if (error.status === 401) navigate('/login');
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }, []);

    const checkPathIsAuthPages = location.pathname === "/login" || location.pathname === "/signup";

    const [isMobileSideMenuOpen, setIsMobileSideMenuOpen] = useState(false);

    return (
        <div className="App" id="app">
            <ToastContainer/>
            <ReactTooltip/>

            {!checkPathIsAuthPages && <SideMenu isOpen={isMobileSideMenuOpen} setIsOpen={setIsMobileSideMenuOpen}/>}

            <div
                className={[checkPathIsAuthPages ? "full-width" : "width-minus-sidebar"].join(' ')}
                style={{overflow: 'hidden'}}
            >
                {!checkPathIsAuthPages && (
                    <Header
                        title={location.pathname.split('/')[1]}
                        isSideMenuOpen={isMobileSideMenuOpen}
                        setIsSideMenuOpen={setIsMobileSideMenuOpen}
                    />
                )}

                {authedUser !== null
                    ? <AppRoutes loadPrivateRoutes={isInboxFetched}/>
                    : <LoadingScreen text="Authorizing"/>
                }

            </div>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-left"/>
        </div>
    );
};

export default App;
