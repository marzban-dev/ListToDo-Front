import React from "react";
import "./pageContainer.scss";

const PageContainer = ({children, widthPadding, scrollY}) => {
    return (
        <main className="page-container" style={{
            paddingLeft: widthPadding ? '2rem' : '0',
            overflowY: scrollY ? "scroll" : "auto"
        }}>
            {children}
        </main>
    )
}

export default PageContainer;