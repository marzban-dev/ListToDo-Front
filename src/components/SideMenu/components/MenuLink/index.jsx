import React from "react";
import {NavLink, useLocation} from "react-router-dom";
import {useQueryClient} from "react-query";
import "./menuLink.scss";

const MenuLink = ({to, iconClass, children, setIsOpen}) => {
    const location = useLocation();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData("user");

    const linkClickHandler = (e) => {
        if (user !== null) {
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
                "side-menu-link",
                user !== null ? (location.pathname.includes(to) ? "side-menu-link-active" : null) : null,
                user === null ? "side-menu-link-disabled" : null
            ].join(' ')}
        >
            <span className={["link-icon", iconClass].join(" ")}></span>
            <span className="link-text">{children}</span>
        </NavLink>
    );
};

export default MenuLink;