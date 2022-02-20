import React from "react";
import Spinner from "../Spinner";
import PropTypes from "prop-types";

const LoadingWrapper = ({show, size, type, spinnerClassName, style, children, onLoaded, customLoadingComponent}) => {
    if (show) {
        if (onLoaded) return onLoaded();
        else return children;
    } else {
        if (customLoadingComponent) {
            return customLoadingComponent;
        } else {
            return <Spinner size={size} type={type} className={spinnerClassName} style={style}/>
        }
    }
}

LoadingWrapper.propTypes = {
    show: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['circle', 'dots']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    spinnerClassName: PropTypes.string,
    style: PropTypes.object,
    onLoaded: PropTypes.func,
    customLoadingComponent: PropTypes.element
}

export default LoadingWrapper;