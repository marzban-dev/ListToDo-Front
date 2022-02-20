import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {CalculateRemainingTime, ConvertToHumanReadableDate} from "Utils/DateHelpers";
import "./scheduleProgressBar.scss";

const ScheduleProgressBar = ({createdTime, deadTime, width = 120}) => {
    const [isDeadLineActive, setIsDeadLineActive] = useState(false);
    const [remainingTime, setRemainingTime] = useState("");
    const [progressPercent, setProgressPercent] = useState(0);

    useEffect(() => {
        const {remaining, total} = CalculateRemainingTime(createdTime, deadTime);
        const readableDate = ConvertToHumanReadableDate(remaining);
        setRemainingTime(readableDate);

        const percent = Math.floor(100 - remaining / (total / 100));
        if (percent > 0) setProgressPercent(percent);
        else {
            setProgressPercent(100);
            setIsDeadLineActive(true);
        }

        setProgressPercent()

        if (remaining <= Math.floor(total / 5)) {
            setIsDeadLineActive(true);
        } else {
            setIsDeadLineActive(false);
        }

        // setInterval(() => {
        //     const remainingTime = CalculateRemainingTime(createdTime, deadTime);
        //     setIsDeadLineActive(remainingTime)
        // }, 60000)
    }, []);

    return (
        <div className="schedule-progress-container">
            <div className="schedule-progress-bar-container">
                <div className="schedule-progress-bar-date-icons">
                    <div className="schedule-progress-bar-date-icon"
                         data-tip={(new Date(createdTime).toLocaleString())}>
                        <span className="far fa-calendar-plus"></span>
                    </div>
                    <div className="schedule-progress-bar-date-icon"
                         data-tip={(new Date(deadTime).toLocaleString())}>
                        <span className="far fa-calendar-check"></span>
                    </div>
                </div>

                <div
                    style={{width: width + "px"}}
                    className={[
                        "schedule-progress-bar",
                        isDeadLineActive && "schedule-progress-bar-warning"
                    ].join(' ')}>
                    <div style={{width: progressPercent + "%"}} data-tip={remainingTime}></div>
                </div>
            </div>
        </div>
    );
};

ScheduleProgressBar.propTypes = {
    createdTime: PropTypes.string,
    deadTime: PropTypes.string,
    width: PropTypes.number
}

export default ScheduleProgressBar;