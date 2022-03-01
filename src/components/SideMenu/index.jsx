import React from "react";
import MenuLink from "./components/MenuLink";
import "./sideMenu.scss";

const SideMenu = ({isOpen, setIsOpen}) => {
    return (
        <aside className={["side-menu", isOpen ? "side-menu-active" : null].join(' ')} onClick={() => setIsOpen(false)}>
            <div className="side-menu-container" onClick={(e) => e.stopPropagation()}>
                <h1 className="side-menu-logo">Logo</h1>
                <ul className="side-menu-links">
                    <div className="side-menu-links-divider">
                        <MenuLink to="/tasks" iconClass="far fa-tasks" setIsOpen={setIsOpen}>
                            Tasks
                        </MenuLink>

                        <MenuLink to="/projects" iconClass="far fa-briefcase" setIsOpen={setIsOpen}>
                            Projects
                        </MenuLink>

                        <MenuLink to="/sections" iconClass="far fa-archive" setIsOpen={setIsOpen}>
                            Archive
                        </MenuLink>

                        <MenuLink to="/labels" iconClass="far fa-tags" setIsOpen={setIsOpen}>
                            Labels
                        </MenuLink>

                        <MenuLink to="/activity" iconClass="far fa-chart-line" setIsOpen={setIsOpen}>
                            Activity
                        </MenuLink>
                    </div>
                    <div className="side-menu-links-divider">
                        <MenuLink to="/notifications" iconClass="far fa-bell" setIsOpen={setIsOpen}>
                            Notifications
                        </MenuLink>

                        <MenuLink to="/settings" iconClass="far fa-cog" setIsOpen={setIsOpen}>
                            Settings
                        </MenuLink>
                    </div>
                </ul>
            </div>
        </aside>
    );
};

export default SideMenu;
