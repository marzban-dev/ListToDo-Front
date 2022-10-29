import React from "react";
import {useQueryClient} from "react-query";
import {Navigate, useLocation} from "react-router-dom";
import LoadingScreen from "components/UI/LoadingScreen";

const RequireAuth = ({children}) => {
    const queryClient = useQueryClient();
    const isUserAuthorized = queryClient.getQueryData('user');
    const inboxProject = queryClient.getQueryData('inbox-project');
    const labels = queryClient.getQueryData('labels');
    const location = useLocation();

    if (isUserAuthorized) {
        if (inboxProject && labels) {
            return children;
        } else {
            return <LoadingScreen text="Fetching app data"/>
        }
    } else {
        return <Navigate to="/login" state={{from: location}}/>;
    }
};

export default RequireAuth;
