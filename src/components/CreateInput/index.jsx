import React, {useRef} from "react";
import PropTypes from "prop-types";
import "./createInput.scss";

const CreateInput = ({onClick, iconClass, placeholder, isDisabled}) => {

    const input = useRef(null);

    const onClickHandler = () => {
        onClick(input.current.value)
        input.current.value = "";
    }

    return (
        <section className="create-input-container">
            <div className="create-input">
                <button className="col-1" onClick={!isDisabled ? onClickHandler : null}>
                    <span className={iconClass}></span>
                </button>
                <input
                    type="text"
                    className="col-11"
                    placeholder={placeholder}
                    ref={input}
                    onKeyPress={(e) => (
                        e.key === "Enter" ? (!isDisabled ? onClickHandler() : null) : null
                    )}
                />
            </div>
        </section>
    );
};

CreateInput.propTypes = {
    onClick: PropTypes.func.isRequired,
    iconClass: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    isDisabled: PropTypes.bool
}

export default CreateInput;
