import {toast} from "react-toastify";
import {TOASTIFY_OPTIONS} from "config";

const catchAsync = (cb, options, errorCb) => {

    let alertSetting = {
        onLoad: "Request is loading", onSuccess: "Request completed", onError: "Request failed",
    };

    if (typeof options === "object") {
        alertSetting = options
    }

    return () => {

        if (options) {
            const alertId = toast.loading(alertSetting.onLoad, TOASTIFY_OPTIONS);

            cb().then(() => {
                toast.update(alertId, {
                    render: alertSetting.onSuccess, type: "success", isLoading: false, ...TOASTIFY_OPTIONS
                });
            }).catch(error => {
                console.log(error);
                if (errorCb) errorCb(error);
                toast.update(alertId, {
                    render: alertSetting.onError, type: "error", isLoading: false, ...TOASTIFY_OPTIONS
                });
            });
        } else {
            cb().catch(error => {
                console.log(error)
                if (errorCb) errorCb(error);
            });
        }
    };
};

export default catchAsync;