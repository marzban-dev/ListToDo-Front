import React, { useState } from "react";
import "./selectAssignee.scss";
import testImage from "assets/img/faces/face-1.jpeg";

const SelectAssignee = () => {
  const [selectedAssignee, setSelectedAssignee] = useState(null);

  const users = [
    { id: 1, name: "ali" },
    { id: 2, name: "gholi" },
    { id: 3, name: "soltan" },
    { id: 4, name: "mostafa" },
    { id: 5, name: "ali" },
    { id: 6, name: "gholi" },
    { id: 7, name: "soltan" },
    { id: 8, name: "mostafa" },
  ];

  const onSelectUserChanged = (e) => {
    const userIndex = users.findIndex(
      (user) => user.id === Number(e.target.value)
    );
    setSelectedAssignee(users[userIndex]);
  };

  const User = ({ id, name }) => {
    const userClasses = [
      selectedAssignee !== null
        ? selectedAssignee.id === id
          ? "user-selected"
          : null
        : null,
    ];

    return (
      <li className={userClasses.join(" ")}>
        <input
          type="radio"
          id={`select-user-input-${id}`}
          hidden
          value={id}
          onChange={onSelectUserChanged}
        />
        <label htmlFor={`select-user-input-${id}`}>
          <img src={testImage} alt="user-profile" />
          <span>{name}</span>
        </label>
      </li>
    );
  };

  const ListOfUsers = () => {
    return (
      <div className="assignee-users-list">
        <ul>
          {users.map((user) => {
            return <User key={user.id} id={user.id} name={user.name} />;
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="assignee">
      <div className="assignee-wrapper">
        <div
          className={[
            selectedAssignee
              ? "assignee-selected-user"
              : "assignee-not-selected",
          ].join(" ")}
        >
          {selectedAssignee ? (
            <React.Fragment>
              <img src={testImage} alt="user-profile" />
              <span>{selectedAssignee.name}</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div>
                <span className="far fa-user"></span>
              </div>
              <span>No User</span>
            </React.Fragment>
          )}
        </div>
        <ListOfUsers />
      </div>
    </div>
  );
};

export default SelectAssignee;
