import React from "react";
import DatePicker from "react-datepicker";
import "./selectSchedule.scss";

const SelectSchedule = ({taskSchedule, setTaskSchedule}) => {
    return (
        <div className="schedule">
            <DatePicker
                calendarClassName=""
                className="schedule-input"
                dayClassName=""
                showTime={{use12Hours: true, format: "hh:mm a"}}
                dateFormat="yyyy-MM-dd hh:mm a"
                closeOnScroll={false}
                selected={taskSchedule}
                onChange={(date) => setTaskSchedule(date)}
                placeholderText="Select deadline"
                shouldCloseOnSelect={true}
                minDate={new Date()}
                showTimeInput
            />
            <button
                className={[
                    taskSchedule
                        ? "schedule-clear-icon far fa-times"
                        : "schedule-icon far fa-calendar",
                ].join(" ")}
                onClick={taskSchedule ? () => setTaskSchedule(null) : null}
            ></button>
        </div>
    );
};

export default SelectSchedule;
