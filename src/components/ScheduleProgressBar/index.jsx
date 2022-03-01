import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {CalculateRemainingTime, ConvertToHumanReadableDate} from "utils/DateHelpers";
import "./scheduleProgressBar.scss";

const ScheduleProgressBar = ({createdTime, deadTime, width = 120}) => {
    const [isDeadLineActive, setIsDeadLineActive] = useState(false);
    const [remainingTime, setRemainingTime] = useState("");
    const [passedTime, setPassedTime] = useState("");
    const [progressPercent, setProgressPercent] = useState(5);

    const setScheduleProgress = () => {
        const {remaining, total, passed} = CalculateRemainingTime(createdTime, deadTime);

        const {readableDate: readableRemainingDate, isLeft} = ConvertToHumanReadableDate(remaining);
        if (isLeft) setRemainingTime(readableRemainingDate + " left");
        else setRemainingTime(readableRemainingDate + " ago");

        const {readableDate: readablePassedDate} = ConvertToHumanReadableDate(passed);
        setPassedTime(readablePassedDate + " passed");

        const percent = Math.floor((100 - remaining / (total / 100)) * 100) / 100;

        if (remaining > 0) {
            if (percent > 5) setProgressPercent(percent)
        } else {
            setProgressPercent(100);
            setIsDeadLineActive(true);
        }

        if (remaining <= Math.floor(total / 5)) {
            setIsDeadLineActive(true);
        } else {
            setIsDeadLineActive(false);
        }
    }

    useEffect(() => {
        setScheduleProgress()
        setInterval(setScheduleProgress, 1000)
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
                    ].join(' ')}
                    data-tip={passedTime}
                    data-delay-update={1000}
                    data-effect="solid"
                >
                    <div className="schedule-progress-bar-text">{remainingTime}</div>
                    <div
                        className="schedule-progress-bar-bar"
                        style={{width: progressPercent + "%"}}
                    ></div>
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