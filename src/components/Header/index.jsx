import React from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import LoadingWrapper from "components/UI/LoadingWrapper";
import ProfilePicture from "components/UI/ProfilePicture";
import {useQueryClient,} from "react-query";
import UpperCaseFirstLetter from "utils/UpperCaseFirstLetter";
import NetworkStatus from "components/UI/NetworkStatus";
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
                <h3 className="header-title">{UpperCaseFirstLetter(title)}</h3>
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

                    <NetworkStatus/>

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
                        {user && (
                            <Link to="/settings">
                                <ProfilePicture
                                    profilePicture={user.profile_img}
                                    preloaderStyle={{width: 40, height: 40}}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        marginRight: "0.75rem"
                                    }}
                                />
                            </Link>
                        )}

                        {!user && (
                            <ProfilePicture
                                profilePicture={null}
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
