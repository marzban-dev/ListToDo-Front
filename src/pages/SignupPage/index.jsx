/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from "react";
import "../form.scss";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {signupUser} from "store/actions/Auth.actions";
import {Link, useNavigate} from "react-router-dom";
import AnimateComponent from "components/UI/AnimateComponent";

const signup = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.auth.isLoading);
    const [isSignedUp, setIsSignedUp] = useState(0);
    const [ServerErrorMessage, setServerErrorMessage] = useState(null);
    const navigate = useNavigate();

    const {
        register, handleSubmit, formState: {errors},
    } = useForm({mode: "onChange"});

    const handleSignup = async (data) => {
        try {
            await dispatch(signupUser(data.username, data.email, data.password));

            setIsSignedUp(1);

            setTimeout(() => navigate("/login"), 1000);

        } catch (error) {
            console.log(error.response);
            if (error.response && error.response.status === 400) {
                setServerErrorMessage(error.response.data);
            }

            if (error.message === "Network Error") {
                setServerErrorMessage('Network Error');
            }

            setIsSignedUp(-1);
        }
    };

    const handleErrors = (e) => {
    };

    const signupFormOptions = {
        email: {
            required: "Please enter the email", pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address",
            },
        }, username: {required: "Please enter the name"}, password: {
            required: "Please enter the password", minLength: {
                value: 8, message: "length of your password must bigger than 8 characters",
            },
        },
    };

    const showServerErrors = () => {
        if (typeof ServerErrorMessage === "object") {

            const listOfErrorsMessage = [];
            Object.keys(ServerErrorMessage).forEach(errorKey => {
                ServerErrorMessage[errorKey].forEach(error => listOfErrorsMessage.push(<li>{error}</li>))
            })

            return <ul className="form-request-error-box-list">{listOfErrorsMessage}</ul>;
        }
        return <p>ServerErrorMessage</p>;
    }

    return (
        <AnimateComponent>
            <main className="auth-form">
                <form
                    onSubmit={handleSubmit(handleSignup, handleErrors)}
                    className="col-9 col-sm-7 col-md-5 col-lg-4 col-xl-3"
                >
                    <div
                        className={["form-success-request-layer", isSignedUp === 1 ? "form-success-request-layer-active" : null,].join(" ")}
                    >
                        <span className="fa fa-check-circle"></span>
                    </div>
                    <legend>Sign Up</legend>
                    <div className="form-input-container">
                        <div className="form-input">
                            <div className="form-input-box col-12">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    {...register("username", signupFormOptions.username)}
                                    name="username"
                                    className="col-11"
                                    autoComplete="off"
                                />
                                <span className="fa fa-envelope col-1"></span>
                            </div>
                            <div
                                className={["form-input-line", errors.username ? "form-input-error-line-active" : null,].join(" ")}
                            ></div>
                        </div>
                        <div
                            className={["form-input-box-error", errors.username ? "form-input-error-box-active" : null,].join(" ")}
                        >
                            {errors.username && errors.username.message}
                        </div>
                    </div>

                    <div className="form-input-container">
                        <div className="form-input">
                            <div className="form-input-box col-12">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    {...register("email", signupFormOptions.email)}
                                    name="email"
                                    className="col-11"
                                    autoComplete="off"
                                />
                                <span className="fa fa-envelope col-1"></span>
                            </div>
                            <div
                                className={["form-input-line", errors.email ? "form-input-error-line-active" : null,].join(" ")}
                            ></div>
                        </div>
                        <div
                            className={["form-input-box-error", errors.email ? "form-input-error-box-active" : null,].join(" ")}
                        >
                            {errors.email && errors.email.message}
                        </div>
                    </div>

                    <div className="form-input-container">
                        <div className="form-input">
                            <div className="form-input-box col-12">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    {...register("password", signupFormOptions.password)}
                                    name="password"
                                    className="col-11"
                                    autoComplete="off"
                                />
                                <span className="fa fa-lock col-1"></span>
                            </div>
                            <div
                                className={["form-input-line", errors.password ? "form-input-error-line-active" : null,].join(" ")}
                            ></div>
                        </div>
                        <div
                            className={["form-input-box-error", errors.password ? "form-input-error-box-active" : null,].join(" ")}
                        >
                            {errors.password && errors.password.message}
                        </div>
                    </div>
                    <div className="form-request-error-box">

                        {isSignedUp === -1 ? showServerErrors() : null}

                    </div>

                    <button type="submit" className="col-12" disabled={isLoading}>
                        {isLoading ? <span className="fa fa-spinner"></span> : "Sign Up"}
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
                            Already have an account ? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </form>
            </main>
        </AnimateComponent>
    )
};

export default signup;
