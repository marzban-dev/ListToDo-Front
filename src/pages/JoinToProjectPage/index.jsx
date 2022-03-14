import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useJoinToProjectQuery} from "hooks/useProjectsData";
import catchAsync from "utils/CatchAsync";
import Spinner from "components/UI/Spinner";
import "./joinToProjectPage.scss";

const JoinToProjectPage = () => {
    const {inviteSlug} = useParams();
    const navigate = useNavigate();
    const {mutateAsync: joinToProject, isLoading} = useJoinToProjectQuery(inviteSlug);
    const [isJoined, setIsJoined] = useState(false);
    const [joinMsg, setJoinMsg] = useState("Joining");

    const joinToProjectHandler = catchAsync(async () => {
        await joinToProject();
        setIsJoined(true);
        setJoinMsg("You are successfully joined, and you will redirect to home page")
        setTimeout(() => {
            navigate('/')
        }, 4000)
    }, null, (error) => {
        if (error?.response.status === 400) {
            setJoinMsg("You can't join to your own project you will redirect to home page.");
            setTimeout(() => {
                navigate('/')
            }, 4000)
        }
        if (error?.response.status === 404) {
            navigate('/404')
        }
    });

    useEffect(() => joinToProjectHandler(), []);

    return (
        <div className="join-to-project-page-container">
            {isLoading ? <Spinner size="lg"/> : <span className="join-warning far fa-info-circle"></span>}
            <h3>{joinMsg}</h3>
        </div>
    );
};

export default JoinToProjectPage;