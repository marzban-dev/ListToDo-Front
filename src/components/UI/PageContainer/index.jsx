import React from "react";
import AnimateComponent from "components/UI/AnimateComponent";
import "./pageContainer.scss";
import {useLocation} from "react-router-dom";

const PageContainer = ({children, widthPadding, scrollY}) => {
    const location = useLocation();

    console.log();

    return (
        <AnimateComponent>
            <div className="page-container" style={{
                height : location.pathname === "/login" || location.pathname === "/signup" ? "100vh" : "calc(100vh - 70px)",
                paddingLeft: widthPadding ? '2rem' : '0',
                overflowY: scrollY ? "scroll" : "auto"
            }} id="scrollable-container">
                {children}
            </div>
        </AnimateComponent>
    )
}

export default PageContainer;