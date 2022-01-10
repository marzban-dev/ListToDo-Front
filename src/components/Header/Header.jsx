import React from "react";
import testImg from "assets/img/image-from-rawpixel-id-1219868-jpeg.jpg";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "store/actions/Auth.actions";
import {useNavigate} from "react-router";
import LoadingWrapper from "../UI/LoadingWrapper/LoadingWrapper";
import "./header.scss";
import ProfilePicture from "../UI/ProfilePicture/ProfilePicture";

const Header = ({title, isSideMenuOpen, setIsSideMenuOpen}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const isPreAuthLoading = useSelector(state => state.auth.isPreAuthLoading);

    const logoutUser = async () => {
        try {
            await dispatch(logout());
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <header>
            <div className="header-title-and-menu col-9">
                {
                    <button className="header-menu-btn" onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}>
                        <span className="far fa-bars"></span>
                    </button>
                }
                <h3 className="header-title">{title.charAt(0).toUpperCase() + title.slice(1)}</h3>
            </div>

            <LoadingWrapper
                show={!isPreAuthLoading}
                type="dots"
                spinnerClassName="col-3"
                style={{
                    justifyContent: 'flex-end',
                    paddingRight: '2rem'
                }}
                size="sm"
            >
                <div className="header-user-data col-3">
                    {/*{!user ?*/}
                    {/*    <div className="header-auth">*/}
                    {/*        <Link to="/signup">*/}
                    {/*            <span className="far fa-user-plus"></span>*/}
                    {/*        </Link>*/}
                    {/*    </div>*/}
                    {/*    : null*/}
                    {/*}*/}

                    {!user ?
                        <div className="header-auth">
                            <Link to="/login">
                                <span className="far fa-sign-in"></span>
                            </Link>
                        </div>
                        :
                        <div className="header-auth" onClick={logoutUser}>
                            <span className="far fa-sign-out"></span>
                        </div>
                    }

                    <div className="header-profile">
                        <ProfilePicture profilePicture={user ? user.setting.profile : null} style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "0.75rem"
                        }}/>
                        <span>{user ? user.username : "Please Login"}</span>
                    </div>
                </div>
            </LoadingWrapper>
        </header>
    );
};

export default Header;
