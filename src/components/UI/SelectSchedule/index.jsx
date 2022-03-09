import React from "react";
import DatePicker from "react-datepicker";
import "./selectSchedule.scss";

const SelectSchedule = ({scheduleDate, setSchedule}) => {
    return (
        <div className="schedule">
            <DatePicker
                className="schedule-input"
                showTime={{use12Hours: true, format: "hh:mm a"}}
                dateFormat="yyyy-MM-dd hh:mm a"
                closeOnScroll={false}
                selected={scheduleDate}
                onChange={(date) => setSchedule(date)}
                placeholderText="Select deadline"
                shouldCloseOnSelect={true}
                minDate={new Date()}
                showTimeInput
            />
            <button
                className={[
                    scheduleDate
                        ? "schedule-clear-icon far fa-times"
                        : "schedule-icon far fa-calendar",
                ].join(" ")}
                onClick={scheduleDate ? () => setSchedule(null) : null}
            ></button>
        </div>
    );
};

export default SelectSchedule;
