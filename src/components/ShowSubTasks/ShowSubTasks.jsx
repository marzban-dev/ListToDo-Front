import React, {useEffect} from 'react';
import Modal from "react-modal";
import {useNavigate, useLocation} from 'react-router-dom'

const ShowSubTasks = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log(location);
    }, []);

    return (<Modal
        isOpen={true}
        onRequestClose={() => navigate(-1)}
        style={{
            overlay: {
                backgroundColor: "#17171796",
            },
        }}
        className="modal-content"
        closeTimeoutMS={100}>
    </Modal>);
}

export default ShowSubTasks;