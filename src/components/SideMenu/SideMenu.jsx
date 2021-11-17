import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./sideMenu.scss";

const MenuLink = ({ to, iconClass, children }) => {
  const location = useLocation();
  return (
    <NavLink
      to={to}
      className={
        location.pathname.includes(to) ? "side-menu-section-active" : null
      }
    >
      <span className={["section-icon", iconClass].join(" ")}></span>
      <span className="section-text">{children}</span>
    </NavLink>
  );
};

const SideMenu = () => {
  return (
    <aside className="side-menu col-2">
      <h1 className="side-menu-logo">Logo</h1>
      <ul className="side-menu-sections">
        <div className="side-menu-sections-1">
          <MenuLink to="/tasks" iconClass="far fa-tasks">
            Tasks
          </MenuLink>

          <MenuLink to="/projects" iconClass="far fa-briefcase">
            Projects
          </MenuLink>

          <MenuLink to="/sections" iconClass="far fa-archive">
            Archive
          </MenuLink>

          <MenuLink to="/labels" iconClass="far fa-tags">
            Labels
          </MenuLink>
        </div>
        <div className="side-menu-sections-2">
          <MenuLink to="/notifications" iconClass="far fa-bell">
            Notifications
          </MenuLink>

          <MenuLink to="/settings" iconClass="far fa-cog">
            Settings
          </MenuLink>
        </div>
      </ul>
    </aside>
  );
};

export default SideMenu;
