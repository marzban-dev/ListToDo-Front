import React from "react";
import DatePicker from "react-datepicker";
import "./selectSchedule.scss";

const SelectSchedule = ({schedule,setSchedule}) => {

    return (
        <div className="schedule">
            <DatePicker
                className="schedule-input"
                showTime={{use12Hours: true, format: "hh:mm a"}}
                dateFormat="yyyy-MM-dd hh:mm a"
                closeOnScroll={false}
                selected={schedule}
                onChange={(date) => setSchedule(date)}
                placeholderText="Select deadline"
                shouldCloseOnSelect={true}
                minDate={new Date()}
                showTimeInput
            />
            <button
                className={[
                    schedule
                        ? "schedule-clear-icon far fa-times"
                        : "schedule-icon far fa-calendar",
                ].join(" ")}
                onClick={schedule ? () => setSchedule(null) : null}
            ></button>
        </div>
    );
};

export default SelectSchedule;
