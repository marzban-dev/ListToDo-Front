import React from "react";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import Login from "pages/LoginPage";
import Signup from "pages/SignupPage";
import Projects from "pages/Projects";
import CreateUpdateTaskModal from "./components/CreateUpdateTaskModal";
import Settings from "./pages/Settings";
import Labels from "./pages/Labels";
import RequireAuth from "components/helper/RequireAuth";
import ProjectPage from "pages/ProjectPage";
import Tasks from "pages/Tasks";
import {useQueryClient} from "react-query";
import JoinToProjectPage from "pages/JoinToProjectPage";
import {AnimatePresence} from "framer-motion/dist/framer-motion";
import NotFoundPage from "pages/NotFoundPage";
import ShowTask from "components/ShowTask";
import ActivityPage from "pages/ActivityPage";

const AppRoutes = ({loadPrivateRoutes}) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const projectInbox = queryClient.getQueryData('inbox-project');

    const privateAppRoutes = (
        <React.Fragment>
            <Route path="/tasks" element={<RequireAuth><Tasks project={projectInbox}/></RequireAuth>}>
                <Route path="create-task/:sectionId/:parentId/:projectId" element={<CreateUpdateTaskModal mode="create"/>}/>
                <Route path="update-task/:taskId/:parentId/:projectId" element={<CreateUpdateTaskModal mode="modify"/>}/>
                <Route path="task/:taskId" element={<ShowTask />}/>
            </Route>
            <Route path="/projects" element={<RequireAuth><Projects/></RequireAuth>}>
                <Route path="create-task/:sectionId/:parentId/:projectId" element={<CreateUpdateTaskModal mode="create"/>}/>
                <Route path="update-task/:taskId/:parentId/:projectId" element={<CreateUpdateTaskModal mode="modify"/>}/>
                <Route path="task/:taskId" element={<ShowTask />} />
            </Route>
            <Route path="/project/:id/:parentId" element={<RequireAuth><ProjectPage/></RequireAuth>}>
                <Route path="create-task/:sectionId/:parentId/:projectId" element={<CreateUpdateTaskModal mode="create"/>}/>
                <Route path="update-task/:taskId/:parentId/:projectId" element={<CreateUpdateTaskModal mode="modify"/>}/>
                <Route path="task/:taskId" element={<ShowTask />}/>
            </Route>
            <Route path="/settings" element={<RequireAuth><Settings/></RequireAuth>}/>
            <Route path="/labels">
                <Route path=":id" element={<RequireAuth><Labels/></RequireAuth>}/>
                <Route path="" element={<RequireAuth><Labels/></RequireAuth>}/>
                <Route path="create-task/:sectionId/:parentId/:projectId" element={<CreateUpdateTaskModal mode="create"/>}/>
                <Route path="update-task/:taskId/:parentId/:projectId" element={<CreateUpdateTaskModal mode="modify"/>}/>
                <Route path="task/:taskId" element={<ShowTask />} />
            </Route>
            <Route exact path="/join-to-project/:inviteSlug" element={<RequireAuth><JoinToProjectPage/></RequireAuth>}/>
            <Route exact path="/activity" element={<RequireAuth><ActivityPage/></RequireAuth>} />
        </React.Fragment>
    );

    const publicAppRoutes = (
        <React.Fragment>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/signup" element={<Signup/>}/>
        </React.Fragment>
    );

    const importantAppRoutes = (
        <React.Fragment>
            <Route exact path="/404" element={<NotFoundPage/>}/>
            <Route path="/*" element={<Navigate to="/404" replace/>}/>
        </React.Fragment>
    );

    return (
        <AnimatePresence exitBeforeEnter>
            <Routes key={location.pathname.split("/")[0]} location={location}>
                {publicAppRoutes}
                {privateAppRoutes}
                {importantAppRoutes}
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;

// let routes = [
//     {
//         path: "/",
//         element: <Home/>
//     },
//     {
//         path: '/login',
//         element: <Login/>,
//     },
//     {
//         path: '/signup',
//         element: <Signup/>,
//     },
//     {
//         path: '/tasks',
//         element: <RequireAuth><Tasks project={projectInbox}/></RequireAuth>,
//     },
//     {
//         path: '/projects',
//         element: <RequireAuth><Projects/></RequireAuth>,
//     },
//     {
//         path: '/project/:id/:parentId',
//         element: <RequireAuth><ProjectPage/></RequireAuth>,
//     },
//     {
//         path: '/settings',
//         element: <RequireAuth><Settings/></RequireAuth>,
//     },
//     {
//         path: '/labels',
//         element: <RequireAuth><Labels/></RequireAuth>,
//     },
//     {
//         path: '/join-to-project/:inviteSlug',
//         element: <RequireAuth><JoinToProjectPage/></RequireAuth>
//     },
//     {
//         path: '/404',
//         element: <NotFound/>,
//     },
//     {
//         path: '*',
//         element: <Navigate to="/404" replace/>,
//     },
// ];

// const Routes = useRoutes(routes.map(route => {
//     let copyOfRoute = {...route};
//     if (route.path.includes('tasks') || route.path.includes('labels') || route.path.includes('project')) {
//         copyOfRoute['children'] = [
//             {
//                 path: copyOfRoute.path + "/create-task/:sectionId/:parentId",
//                 element: <CreateUpdateTaskModal mode="create"/>
//             },
//             {
//                 path: copyOfRoute.path + "/update-task/:taskId/:parentId",
//                 element: <CreateUpdateTaskModal mode="modify"/>
//             }
//         ]
//     }
//
//     return copyOfRoute;
// }), location);
