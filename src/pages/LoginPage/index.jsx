/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useLoginQuery} from "hooks/useAuth";
import {useQueryClient} from "react-query";
import AnimateComponent from "components/UI/AnimateComponent"
import {check} from "apis/auth.api";

import "../form.scss";

const login = () => {
    const queryClient = useQueryClient();
    const [isLoggedIn, setIsLoggedIn] = useState(0);
    const [ServerErrorMessage, setServerErrorMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({mode: "onChange"});

    const {mutateAsync: loginUser, isLoading} = useLoginQuery();

    const handleLogin = async (data) => {
        try {
            await loginUser({username: data.username, password: data.password});

            const user = await check();

            queryClient.setQueryData('user', user);

            setIsLoggedIn(1);

            const fromLocation = location.state ? location.state.from : null;

            setTimeout(() => {
                fromLocation ? navigate(fromLocation.pathname) : navigate("/")
            }, 1200);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                setServerErrorMessage(error.response.data.detail);
            }
            if (error.message === "Network Error") {
                setServerErrorMessage('Network Error');
            }
            setIsLoggedIn(-1);
        }
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
        <AnimateComponent>
            <main className="auth-form">
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="col-10 col-sm-7 col-md-5 col-lg-4 col-xl-3"
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
                                <span className="fa fa-user col-1"></span>
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
                            {isLoggedIn === -1 ? (
                                Array.isArray(ServerErrorMessage) ? ServerErrorMessage.map(err =>
                                    <h3>{err}</h3>) : ServerErrorMessage
                            ) : null}
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
        </AnimateComponent>
    );
};

export default login;
