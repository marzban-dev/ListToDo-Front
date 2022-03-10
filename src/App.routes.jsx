import React from "react";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import Login from "pages/LoginPage";
import Signup from "pages/SignupPage";
import Projects from "pages/Projects";
import CreateUpdateTask from "components/CreateUpdateTask";
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
import ArchivePage from "pages/ArchivePage";
import CreateUpdateProject from "components/CreateUpdateProject";
import LayoutsContainer from "components/UI/LayoutsContainer";

const AppRoutes = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const projectInbox = queryClient.getQueryData('inbox-project');

    return (
        <React.Fragment>
            <AnimatePresence exitBeforeEnter>
                <Routes key={location.pathname.split("/")[0]} location={location.state?.backgroundLocation || location}>
                    <Route path="/" element={<LayoutsContainer/>}>
                        <Route index element={<Home/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="signup" element={<Signup/>}/>
                        <Route path="404" element={<NotFoundPage/>}/>
                        <Route path="tasks" element={<RequireAuth><Tasks project={projectInbox}/></RequireAuth>}/>
                        <Route path="projects" element={<RequireAuth><Projects/></RequireAuth>}/>
                        <Route path="project/:id/:parentId" element={<RequireAuth><ProjectPage/></RequireAuth>}/>
                        <Route path="settings" element={<RequireAuth><Settings/></RequireAuth>}/>
                        <Route path="labels">
                            <Route path=":id" element={<RequireAuth><Labels/></RequireAuth>}/>
                            <Route path="" element={<RequireAuth><Labels/></RequireAuth>}/>
                        </Route>
                        <Route path="join-to-project/:inviteSlug" element={<RequireAuth><JoinToProjectPage/></RequireAuth>}/>
                        <Route path="activity" element={<RequireAuth><ActivityPage/></RequireAuth>}/>
                        <Route path="archive" element={<RequireAuth><ArchivePage/></RequireAuth>}/>
                        <Route path="/*" element={<Navigate to="/404" replace/>}/>
                    </Route>
                </Routes>
            </AnimatePresence>
            {location.state?.backgroundLocation && (
                <AnimatePresence exitBeforeEnter>
                    <Routes key={location.pathname.split("/")[0] + "a"}>
                        <Route path="/create-task/:sectionId/:parentId/:projectId"
                               element={<RequireAuth><CreateUpdateTask mode="create"/></RequireAuth>}/>
                        <Route path="/update-task/:taskId/:parentId/:projectId"
                               element={<RequireAuth><CreateUpdateTask mode="modify"/></RequireAuth>}/>
                        <Route path="/create-project/:parentId"
                               element={<RequireAuth><CreateUpdateProject mode="create"/></RequireAuth>}/>
                        <Route path="/update-project/:parentId/:projectId"
                               element={<RequireAuth><CreateUpdateProject mode="modify"/></RequireAuth>}/>
                        <Route path="/task/:taskId" element={<RequireAuth><ShowTask/></RequireAuth>}/>
                    </Routes>
                </AnimatePresence>
            )}
        </React.Fragment>
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
