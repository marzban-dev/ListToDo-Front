import React from "react";
import {Navigate, Route, Routes, useLocation, useSearchParams} from "react-router-dom";
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
import PageLayout from "components/UI/PageLayout";

const AppRoutes = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const projectInbox = queryClient.getQueryData('inbox-project');
    const [searchParams] = useSearchParams();
    const backgroundLocation = JSON.parse(searchParams.get('bl'));

    return (
        <React.Fragment>
            <AnimatePresence exitBeforeEnter>
                <Routes key={location.pathname.split("/")[0]} location={backgroundLocation ? backgroundLocation : location}>
                    <Route path="/" element={<PageLayout/>}>
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
                        <Route path="join-to-project/:inviteSlug"
                               element={<RequireAuth><JoinToProjectPage/></RequireAuth>}/>
                        <Route path="activity" element={<RequireAuth><ActivityPage/></RequireAuth>}/>
                        <Route path="archive" element={<RequireAuth><ArchivePage/></RequireAuth>}/>
                        <Route path="/*" element={<Navigate to="/404" replace/>}/>
                    </Route>
                </Routes>
            </AnimatePresence>

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

        </React.Fragment>
    );
};

export default React.memo(AppRoutes);