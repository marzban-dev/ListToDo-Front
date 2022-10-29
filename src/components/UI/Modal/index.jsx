import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import {REACT_MODAL_OPTIONS} from "config";
import ReactTooltip from "react-tooltip";

const Modal = ({isOpen, onClose, children}) => {

    useEffect(() => ReactTooltip.rebuild());

    const setModalStyle = () => {
        const modalContainer = document.getElementsByClassName('ReactModal__Content')[0];
        const modalOverlay = document.getElementsByClassName('ReactModal__Overlay')[0];

        if (modalOverlay && modalContainer) {
            if (modalContainer.clientHeight > window.innerHeight) {
                modalOverlay.style.overflowY = "scroll";
                modalOverlay.style.padding = "2rem 0";
                modalOverlay.style.alignItems = "flex-start";
            } else {
                modalOverlay.style.overflowY = "visible";
                modalOverlay.style.padding = "0";
                modalOverlay.style.alignItems = "center";
            }
        }
    }

    window.addEventListener('resize', setModalStyle)

    const modalHeight =  document.getElementsByClassName('ReactModal__Content')[0]?.clientHeight;

    useEffect(() => setModalStyle(), [modalHeight]);

    return ReactDOM.createPortal((
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            {...REACT_MODAL_OPTIONS}
        >
            {children}
        </ReactModal>
    ), document.querySelector('body'))
}

export default Modal;