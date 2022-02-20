import {toast} from "react-toastify";

export const TOASTIFY_OPTIONS = {
    autoClose: 1100,
    closeOnClick: true,
    position: "top-center",
    pauseOnHover: false,
    hideProgressBar: true,
    theme: localStorage.getItem("APP_THEME") ? localStorage.getItem("APP_THEME") : 'light'
};

export const SKELETON_OPTIONS = {
    backgroundColor: getComputedStyle(document.body).getPropertyValue("--color-react-loader-background"),
    foregroundColor: getComputedStyle(document.body).getPropertyValue("--color-react-loader-forground"),
}

export const REACT_MODAL_OPTIONS = {
    overlayClassName: "react-modal-overlay",
    className: "react-modal-container",
    closeTimeoutMS: 100,
}

export const APP_THEMES = [
    {
        title: 'dark',
        colors: {
            primary: "#44b993",
            secondary: "#232931",
            secondaryComplement: "#393E46",
            text: "#EEEEEE",
        }
    },
    {
        title: 'light',
        colors: {
            primary: "#00aab3",
            secondary: "#ffffff",
            secondaryComplement: "#dfdede",
            text: "#171717",
        }
    }
]

export const USE_QUERY_ALERT_SETTINGS = (options) => ({
    onSuccess: () => {
        toast.update(options.alertId, {
            render: options.onSuccess,
            type: "success",
            isLoading: false,
        });
    },
    onError: () => {
        toast.update(options.alertId, {
            render: options.onError,
            type: "error",
            isLoading: false,
        });
    }
})