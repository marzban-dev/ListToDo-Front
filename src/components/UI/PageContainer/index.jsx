import React from "react";
import AnimateComponent from "components/UI/AnimateComponent";
import "./pageContainer.scss";

const PageContainer = ({children, widthPadding, scrollY}) => {
    return (
        <AnimateComponent>
            <main className="page-container" style={{
                paddingLeft: widthPadding ? '2rem' : '0',
                overflowY: scrollY ? "scroll" : "auto"
            }} id="scrollable-container">
                {children}
            </main>
        </AnimateComponent>
    )
}

export default PageContainer;