import React, {useState} from "react";
import "./createSection.scss";

const CreateSection = ({onClick, inputRef, isDisabled}) => {

    return (
        <section className="create-section">
            <div className="create-section-input">
                <button className="col-1" onClick={!isDisabled ? onClick : null}>
                    <span className="far fa-plus-circle "></span>
                </button>
                <input
                    type="text"
                    className="col-11"
                    placeholder="Section Title"
                    ref={inputRef}
                    onKeyPress={(e) => (
                        e.key === "Enter" ? (!isDisabled ? onClick() : null) : null
                    )}
                />
            </div>
        </section>
    );
};

export default CreateSection;
