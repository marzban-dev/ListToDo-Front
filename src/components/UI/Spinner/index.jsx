import React from "react";
import PropTypes from "prop-types";
import "./spinner.scss";

const Spinner = ({size = 'md', type = "circle", className, style = {}}) => {
    if (type === "circle") {
        return (
            <div className={["circle-spinner",`circle-spinner-size-${size}`, className].join(' ')} style={style}>
                <span className="far fa-spinner"></span>
            </div>
        );
    } else {
        return (
            <div className={['dots-spinner', `dots-spinner-size-${size}`, className].join(' ')} style={style}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                     width="60px" height="10px" viewBox="0 0 80 20">
                    <circle cx="10" cy="10" r="10" fill="var(--color-primary)">
                        <animate attributeName="cx" from="10" to="40" dur="0.35s" calcMode="spline"
                                 keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="10" cy="10" r="0" fill="var(--color-primary)">
                        <animate attributeName="r" from="0" to="10" dur="0.35s" calcMode="spline"
                                 keySplines="0.42 0 0.58 1"
                                 keyTimes="0;1" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="40" cy="10" r="10" fill="var(--color-primary)">
                        <animate attributeName="cx" from="40" to="70" dur="0.35s" calcMode="spline"
                                 keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="70" cy="10" r="10" fill="var(--color-primary)">
                        <animate attributeName="r" from="10" to="0" dur="0.35s" calcMode="spline"
                                 keySplines="0.42 0 0.58 1"
                                 keyTimes="0;1" repeatCount="indefinite"/>
                    </circle>
                </svg>
            </div>
        );
    }
}

Spinner.propTypes = {
    type: PropTypes.oneOf(['dots', 'circle']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
    style: PropTypes.object
}

export default Spinner;