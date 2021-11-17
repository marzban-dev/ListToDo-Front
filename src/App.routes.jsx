import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login/Login";
import Signup from "pages/Auth/Signup/Signup";
import Projects from "pages/Projects/Projects";
import Tasks from "pages/Tasks/Tasks";
import SectionTasks from "components/SectionTasks/SectionTasks";
import RequireAuth from "components/helper/RequireAuth";
import NotFound from "components/NotFound/NotFound";
import { useSelector, useDispatch } from "react-redux";
import { checkUser } from "store/actions/Auth.actions";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isLoading);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route
        path="/projects"
        element={
          <RequireAuth>
            <Projects />
          </RequireAuth>
        }
      />
      <Route
        path="/tasks/*"
        element={
          <RequireAuth>
            <Tasks />
          </RequireAuth>
        }
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
