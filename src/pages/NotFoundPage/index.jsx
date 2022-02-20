import React from "react";
import PageContainer from "components/UI/PageContainer";
import "./notFound.scss";

const NotFoundPage = () => {
    return (
        <PageContainer>
            <div className="notfound-container">
                <h1>
                    <b>404</b> Not Found
                </h1>
            </div>
        </PageContainer>
    );
};

export default NotFoundPage;
