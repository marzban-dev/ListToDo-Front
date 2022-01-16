import React from "react";
import Spinner from "components/UI/Spinner";
import "./loadingScreen.scss";

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <Spinner/>
        </div>
    );
};

export default LoadingScreen;
