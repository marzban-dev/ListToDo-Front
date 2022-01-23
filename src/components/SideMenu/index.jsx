import React from "react";
import {NavLink, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import "./sideMenu.scss";

const SideMenu = ({isOpen, setIsOpen}) => {
    const isPreAuthLoading = useSelector(state => state.auth.isPreAuthLoading);

    const MenuLink = ({to, iconClass, children}) => {
        const location = useLocation();

        const linkClickHandler = (e) => {
            if (!isPreAuthLoading) {
                setIsOpen(false)
            } else {
                e.preventDefault();
            }
        }

        return (
            <NavLink
                to={to}
                onClick={linkClickHandler}
                className={[
                    !isPreAuthLoading ? (location.pathname.includes(to) ? "side-menu-link-active" : null) : null,
                    isPreAuthLoading ? "side-menu-link-disabled" : null
                ].join(' ')}
            >
                <span className={["link-icon", iconClass].join(" ")}></span>
                <span className="link-text">{children}</span>
            </NavLink>
        );
    };

    return (
        <aside className={["side-menu", isOpen ? "side-menu-active" : null].join(' ')} onClick={() => setIsOpen(false)}>
            <div className="side-menu-container" onClick={(e) => e.stopPropagation()}>
                <h1 className="side-menu-logo">Logo</h1>
                <ul className="side-menu-links">
                    <div className="side-menu-links-divider">
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
                    <div className="side-menu-links-divider">
                        <MenuLink to="/notifications" iconClass="far fa-bell">
                            Notifications
                        </MenuLink>

                        <MenuLink to="/settings" iconClass="far fa-cog">
                            Settings
                        </MenuLink>
                    </div>
                </ul>
            </div>
        </aside>
    );
};

export default SideMenu;
