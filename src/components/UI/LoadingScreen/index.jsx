import React from "react";
import Spinner from "components/UI/Spinner";
import "./loadingScreen.scss";

const LoadingScreen = ({text}) => {
    return (
        <div className="loading-screen">
            <div className="loading-screen-content-wrapper">
                <Spinner/>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
