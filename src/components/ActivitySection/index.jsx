import React from "react";
import Activity from "./components/Activity";
import "./activitySection.scss";

const ActivitySection = ({activities, dateTitle}) => {
    return (
        <div className="activity-section">
           <div className="activity-section-title">
               <span></span>
               <h1>{dateTitle}</h1>
           </div>
            {activities.map(activity => <Activity activity={activity}/>)}
        </div>
    );
}

export default ActivitySection;