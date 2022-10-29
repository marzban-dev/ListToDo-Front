import React, {useEffect, useState} from 'react';
import {CSSTransition} from "react-transition-group";
import ReactTooltip from "react-tooltip";
import "./networkStatus.scss";

const NetworkStatus = () => {
    const [networkStatus, setNetworkStatus] = useState("4g");
    const [dataTipMsg, setDataTipMsg] = useState("online");

    useEffect(() => ReactTooltip.rebuild());

    useEffect(() => {
        window.addEventListener('online', () => {
            setNetworkStatus("online");
        });
        window.addEventListener('offline', () => {
            setDataTipMsg("You are offline");
            setNetworkStatus("offline")
        });
        setInterval(checkStatus, 5000);
    }, []);

    const checkStatus = () => {
        const networkType = navigator.connection.effectiveType;

        if (networkType === "slow-2g" || networkType === "2g" || networkType === "3g") {
            setNetworkStatus(networkType);
            setDataTipMsg(`Network speed is very low [${networkType}]`);
        } else {
            if (navigator.onLine) setNetworkStatus(networkType);
        }
    }

    return (
        <CSSTransition
            in={
                networkStatus === "offline" ||
                networkStatus === "slow-2g" ||
                networkStatus === "2g" ||
                networkStatus === "3g"
            }
            timeout={330}
            classNames="network-warning-fade"
            unmountOnExit
        >
            <div
                className="network-status-container"
                data-tip={dataTipMsg}
                data-effect="solid"
            >
                <span className="far fa-exclamation-triangle"></span>
            </div>
        </CSSTransition>
    );
}

export default NetworkStatus;