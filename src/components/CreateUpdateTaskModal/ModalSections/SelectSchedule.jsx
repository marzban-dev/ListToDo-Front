import React from "react";
import DatePicker from "react-datepicker";
import "./selectSchedule.scss";

const SelectSchedule = ({ taskSchedule, setTaskSchedule }) => {
  return (
    <div className="schedule">
      <DatePicker
        calendarClassName=""
        className="schedule-input col-6"
        dayClassName=""
        dateFormat="yyyy/MM/dd"
        closeOnScroll={false}
        selected={taskSchedule}
        onChange={(date) => setTaskSchedule(date)}
        placeholderText="Select Deadline"
        shouldCloseOnSelect={true}
        minDate={new Date()}
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
