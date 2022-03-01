import React from "react";
import AnimatedPage from "components/UI/AnimatedPage";
import "./pageContainer.scss";

const PageContainer = ({children, widthPadding, scrollY}) => {
    return (
        <AnimatedPage>
            <main className="page-container" style={{
                paddingLeft: widthPadding ? '2rem' : '0',
                overflowY: scrollY ? "scroll" : "auto"
            }} id="scrollable-container">
                {children}
            </main>
        </AnimatedPage>
    )
}

export default PageContainer;