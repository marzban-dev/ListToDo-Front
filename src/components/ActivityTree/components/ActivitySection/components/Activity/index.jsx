import React, {useEffect} from "react";
import Member from "components/Member";
import "./activity.scss";
import ReactTooltip from "react-tooltip";

const Activity = ({activity}) => {

    useEffect(() => ReactTooltip.rebuild(), []);

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
                    <p data-tip={activity.description} data-effect="solid">{activity.description}</p>
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