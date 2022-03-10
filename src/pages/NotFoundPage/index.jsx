import React from "react";
import PageContainer from "components/UI/PageContainer";
import "./notFound.scss";
import {Link} from "react-router-dom";

const NotFoundPage = () => {
    return (
        <PageContainer>
            <div className="notfound-container">
                <h2>404</h2>
                <p>
                    The link you 're looking for is wrong.
                    <div>Tap here and back to tasks page <Link to="/tasks" className="fa fa-reply"></Link></div>
                </p>
            </div>
        </PageContainer>
    );
};

export default NotFoundPage;
