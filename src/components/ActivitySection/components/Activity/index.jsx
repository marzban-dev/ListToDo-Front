import React from "react";
import Member from "components/Member";
import "./activity.scss";

const Activity = ({activity}) => {
    return (
        <div className="activity">
            <div className="activity-details">
                <Member
                    picture={activity.assignee.profile_img}
                    name={activity.assignee.username}
                    style={{width: "40px", height: "40px"}}
                    disableHover
                />
                <div className="activity-text">
                    <p>{activity.description}</p>
                    <span>{new Date(activity.created).toLocaleDateString()} {new Date(activity.created).toLocaleTimeString()}</span>
                </div>
            </div>
            <div className={["activity-status", `activity-status-${activity.status}`].join(' ')}>
                {activity.status === "D" && <span className="fa fa-trash-alt"></span>}
                {activity.status === "U" && <span className="fa fa-pencil"></span>}
                {activity.status === "C" && <span className="fa fa-plus-hexagon"></span>}
            </div>
        </div>
    );
}

export default Activity;