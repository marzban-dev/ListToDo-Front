import React from "react";
import {Link} from "react-router-dom";
import "./notFound.scss";

const NotFoundPage = () => {

    return (
        <div className="notfound-container">
            <h2>404</h2>
            <p>
                The link you 're looking for is wrong.
                <span>Tap here and back to tasks page <Link to="/tasks" className="fa fa-reply"></Link></span>
            </p>
        </div>
    );
};

export default NotFoundPage;
