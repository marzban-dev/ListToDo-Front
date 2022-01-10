import React from "react";
import Spinner from "../Spinner/Spinner";
import PropTypes from "prop-types";

const LoadingWrapper = ({show, size, type, spinnerClassName, style, children}) => {
    if (show) {
        return children;
    } else {
        return <Spinner size={size} type={type} className={spinnerClassName} style={style}/>
    }
}

LoadingWrapper.propTypes = {
    show: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['circle', 'dots']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    spinnerClassName: PropTypes.string,
    style: PropTypes.object
}

export default LoadingWrapper;