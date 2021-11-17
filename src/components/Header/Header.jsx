import React from "react";
import "./header.scss";
import testImg from "assets/img/image-from-rawpixel-id-1219868-jpeg.jpg";
import { Link } from "react-router-dom";

const Header = ({ title }) => {
  return (
    <header className="col-12">
      <h3 className="col-9">{title}</h3>
      <div className="header-user-data col-3">
        <div className="header-auth">
          <Link to="/signup">
            <span className="far fa-user-plus"></span>
          </Link>
        </div>
        <div className="header-auth">
          <Link to="/login">
            <span className="far fa-sign-in"></span>
          </Link>
        </div>
        <div className="header-auth">
          <Link to="/">
            <span className="far fa-sign-out"></span>
          </Link>
        </div>
        <div className="header-profile">
          <img src={testImg} alt="profile" />
          <span>Mansour</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
