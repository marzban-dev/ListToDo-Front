/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "store/actions/Auth.actions";
import "../form.scss";
import {fetchData} from "../../../store/actions/Main.actions";

const login = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.auth.isLoading);
    const [isLoggedIn, setIsLoggedIn] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({mode: "onChange"});

    const handleLogin = async (data) => {
        try {
            await dispatch(loginUser(data.username, data.password));

            setIsLoggedIn(1);

            const fromLocation = location.state ? location.state.from : null;

            setTimeout(
                async () => {
                    await dispatch(fetchData())
                    fromLocation ? navigate(fromLocation.pathname) : navigate("/")
                },
                1000
            );
        } catch (error) {
            console.log(error);
            setIsLoggedIn(-1);
        }
    };

    const handleErrors = (e) => {
    };

    const loginFormOptions = {
        username: {required: "Please enter the username"},
        password: {
            required: "Please enter the password",
            minLength: {
                value: 8,
                message: "length of your password must bigger than 8 characters",
            },
        },
    };

    return (
        <main className="auth-form">
            <form
                onSubmit={handleSubmit(handleLogin, handleErrors)}
                className="col-9 col-sm-7 col-md-5 col-lg-4 col-xl-3"
            >
                <div
                    className={[
                        "form-success-request-layer",
                        isLoggedIn === 1 ? "form-success-request-layer-active" : null,
                    ].join(" ")}
                >
                    <span className="fa fa-check-circle"></span>
                </div>
                <legend>Login</legend>
                <div className="form-input-container">
                    <div className="form-input">
                        <div className="form-input-box col-12">
                            <input
                                type="text"
                                placeholder="Name"
                                {...register("username", loginFormOptions.username)}
                                name="username"
                                className="col-11"
                                autoComplete="off"
                            />
                            <span className="fa fa-envelope col-1"></span>
                        </div>
                        <div
                            className={[
                                "form-input-line",
                                errors.username ? "form-input-error-line-active" : null,
                            ].join(" ")}
                        ></div>
                    </div>
                    <div
                        className={[
                            "form-input-box-error",
                            errors.username ? "form-input-error-box-active" : null,
                        ].join(" ")}
                    >
                        {errors.username && errors.username.message}
                    </div>
                </div>

                <div className="form-input-container">
                    <div className="form-input">
                        <div className="form-input-box col-12">
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password", loginFormOptions.password)}
                                name="password"
                                className="col-11"
                                autoComplete="off"
                            />
                            <span className="fa fa-lock col-1"></span>
                        </div>
                        <div
                            className={[
                                "form-input-line",
                                errors.password ? "form-input-error-line-active" : null,
                            ].join(" ")}
                        ></div>
                    </div>
                    <div
                        className={[
                            "form-input-box-error",
                            errors.password ? "form-input-error-box-active" : null,
                        ].join(" ")}
                    >
                        {errors.password && errors.password.message}
                    </div>
                </div>
                <div className="form-request-error-box">
                    <p>
                        {isLoggedIn === -1 ? "Your email or password is incorrect" : null}
                    </p>
                </div>

                <button type="submit" className="col-12" disabled={isLoading}>
                    {isLoading ? <span className="fa fa-spinner"></span> : "Login"}
                </button>

                <div className="form-auth-with-accounts">
                    <div className="form-auth-with-accounts-separator ">
                        <div></div>
                        <span>or</span>
                        <div></div>
                    </div>
                    <ul className="form-auth-with-accounts-list col-8">
                        <li>
                            <span className="fab fa-github"></span>
                        </li>
                        <li>
                            <span className="fab fa-google"></span>
                        </li>
                        <li>
                            <span className="fab fa-linkedin"></span>
                        </li>
                    </ul>
                </div>
                <div className="form-helper-text">
                    <p>
                        You do not have any account ? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </form>
        </main>
    );
};

export default login;
