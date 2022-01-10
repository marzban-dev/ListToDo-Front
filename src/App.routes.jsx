import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login/Login";
import Signup from "pages/Auth/Signup/Signup";
import Projects from "pages/Projects/Projects";
import Tasks from "pages/Tasks/Tasks";
import RequireAuth from "components/helper/RequireAuth";
import NotFound from "components/NotFound/NotFound";
import CreateUpdateTaskModal from "./components/CreateUpdateTaskModal/CreateUpdateTaskModal";
import ShowSubTasks from "./components/ShowSubTasks/ShowSubTasks";
import Settings from "./pages/Settings/Settings";

const AppRoutes = () => {

    const routes = [
        {
            path: "/",
            element: <Home/>
        },
        {
            path: '/login',
            element: <Login/>,
        },
        {
            path: '/signup',
            element: <Signup/>,
        },
        {
            path: '/tasks/*',
            element: <Tasks/>,
            children:
                <React.Fragment>
                    <Route path="modify/:taskId" element={<CreateUpdateTaskModal mode={'modify'}/>}/>
                    <Route path="create" element={<CreateUpdateTaskModal mode={'create'}/>}/>
                    <Route path="subtasks" element={<ShowSubTasks/>}/>
                </React.Fragment>,
            isPrivate: true
        },
        // {
        //     path: '/projects',
        //     element: <Projects/>,
        //     isPrivate: true
        // },
        {
            path: '/settings',
            element: <Settings/>,
            isPrivate: true
        },
        {
            path: '/404',
            element: <NotFound/>,
        },
        {
            path: '*',
            element: <Navigate to="/404" replace/>,
        },
    ]

    const renderRoutes = () => {
        return routes.map(({path, element, children, isPrivate}) => {
            return (
                <Route
                    path={path}
                    element={isPrivate ? <RequireAuth>{element}</RequireAuth> : element}
                >
                    {children}
                </Route>
            );
        });
    }

    return (
        <Routes>
            {renderRoutes()}
        </Routes>
    );
};

export default AppRoutes;
