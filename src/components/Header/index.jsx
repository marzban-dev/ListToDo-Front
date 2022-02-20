import React from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import LoadingWrapper from "components/UI/LoadingWrapper";
import ProfilePicture from "components/UI/ProfilePicture";
import {useQueryClient,} from "react-query";
import "./header.scss";

const Header = ({title, isSideMenuOpen, setIsSideMenuOpen}) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = queryClient.getQueryData('user');

    const logoutUser = async () => {
        localStorage.removeItem("AUTH_ACCESS_TOKEN");
        localStorage.removeItem("AUTH_REFRESH_TOKEN");
        queryClient.setQueryData('user', undefined);
        queryClient.setQueryData('settings', {});
        navigate('/');
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
                show={user !== null}
                type="dots"
                spinnerClassName="col-3"
                style={{
                    justifyContent: 'flex-end',
                    paddingRight: '2rem'
                }}
                size="sm"
            >
                <div className="header-user-data col-3">
                    {user === undefined ?
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

                        {user && (
                            <Link to="/settings">
                                <ProfilePicture
                                    profilePicture={user ? user.profile_img : null}
                                    preloaderStyle={{width: 40, height: 40}}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        marginRight: "0.75rem"
                                    }}
                                />
                            </Link>
                        )}

                        {user === undefined && (
                            <ProfilePicture
                                profilePicture={user ? user.profile_img : null}
                                preloaderStyle={{width: 40, height: 40}}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    marginRight: "0.75rem"
                                }}
                            />
                        )}

                        {user ?
                            <Link to="/settings">
                                {user ? user.username : null}
                            </Link>
                            :
                            <span>Please login</span>
                        }
                    </div>
                </div>
            </LoadingWrapper>
        </header>
    );
};

export default Header;
