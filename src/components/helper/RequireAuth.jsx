import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

const RequireAuth = ({children}) => {
    const isUserAuthorized = useSelector((state) => state.auth.user);
    const location = useLocation();

    if (isUserAuthorized !== null) {
        return children;
    } else {
        return <Navigate to="/login" state={{from: location}}/>;
    }
};

export default RequireAuth;
