import React, {useRef, useState} from "react";
import PropTypes from "prop-types";
import {CSSTransition} from "react-transition-group";
import isOutOfViewport from "utils/IsOutOfViewPort";
import "./selecMenu.scss";

const SelectMenu =
    ({
         type = "selectable-options",
         options,
         activeOption,
         setActiveOption,
         buttonAxis = "v",
         buttonSize = "22px",
         style,
         customButtonIcon,
         customButtonIconColor,
         CustomButtonComponent
     }) => {
        const [isSelectMenuOpen, setIsSelectMenuOpen] = useState(false);
        const selectMenuElement = useRef(null);

        const checkIsSelectMenuOutOfViewPort = () => {
            const isOut = isOutOfViewport(selectMenuElement.current);

            if (isOut) {
                if (isOut.right) selectMenuElement.current.style.right = 0;
                if (isOut.left) selectMenuElement.current.style.left = 0;
                // if (isOut.top) selectMenuElement.current.style.top = "110%";
                // if (isOut.bottom) selectMenuElement.current.style.bottom = "110%";
            }
        }

        document.addEventListener('scroll', () => {
            checkIsSelectMenuOutOfViewPort();
        }, {passive: true});

        const closeMenu = (e) => {
            const currentTarget = e.currentTarget;

            requestAnimationFrame(() => {
                if (!currentTarget.contains(e.relatedTarget)) {
                    setIsSelectMenuOpen(false);
                }
            });
        }

        const onClickHandler = (e, option) => {
            e.stopPropagation();
            if (!option.disabled) {
                if (type === "selectable-options") {
                    setActiveOption(option.value)
                } else {
                    if (option.yesNoQAlert) {
                        const result = window.confirm(option.yesNoQAlert);
                        if (result) option.action();
                    } else option.action();
                }
            }
        }

        return (
            <div className="select-menu" onBlur={closeMenu} style={style}>
                <button
                    className="select-menu-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsSelectMenuOpen(!isSelectMenuOpen)
                    }}
                >
                    {CustomButtonComponent ? CustomButtonComponent : (
                        <span
                            style={{
                                transform: buttonAxis === "h" ? "rotate(90deg)" : "none",
                                fontSize: buttonSize,
                                color: customButtonIconColor ? customButtonIconColor : 'var(--color-icon)'
                            }}
                            className={customButtonIcon ? customButtonIcon : "far fa-ellipsis-v"}
                        ></span>
                    )}
                </button>
                <CSSTransition
                    in={isSelectMenuOpen}
                    timeout={350}
                    classNames="select-menu-fade"
                    unmountOnExit
                    onEnter={() => checkIsSelectMenuOutOfViewPort()}
                >
                    <div className="select-menu-box" tabIndex="0" ref={selectMenuElement}>
                        <ul>
                            {
                                options.map((option, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className={[
                                                "select-menu-item",
                                                type === "selectable-options" ? (
                                                    JSON.stringify(option.value) === JSON.stringify(activeOption) ? "select-menu-item-active" : null
                                                ) : null,
                                                option.disabled ? "select-menu-item-disabled" : null,
                                                option.color ? `select-menu-item-color-${option.color}` : null
                                            ].join(" ")}
                                            onClick={(e) => onClickHandler(e, option)}
                                        >
                                            {option.iconCustomComponent ? option.iconCustomComponent : (
                                                <span
                                                    className={[
                                                        "select-menu-item-icon", option.iconClass ? option.iconClass : "far fa-circle"
                                                    ].join(' ')}
                                                    style={option.iconColor ? {color: option.iconColor} : null}
                                                ></span>
                                            )}
                                            <span className="select-menu-item-value">{option.text}</span>
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>
                </CSSTransition>
            </div>
        );
    }

SelectMenu.propTypes = {
    type: PropTypes.oneOf(["selectable-options", "executable-options"]),
    options: PropTypes.arrayOf({
        text: PropTypes.string,
        value: PropTypes.string,
        iconClass: PropTypes.string,
        action: PropTypes.func,
        disabled: PropTypes.bool,
        yesNoQAlert: PropTypes.string,
        color: PropTypes.oneOf(["danger", "warning", "info"]),
        iconColor: PropTypes.string,
        iconCustomComponent: PropTypes.element,
    }).isRequired,
    activeOption: PropTypes.string,
    setActiveOption: PropTypes.func,
    buttonAxis: PropTypes.oneOf(["v", "h"]),
    buttonSize: PropTypes.string,
    style: PropTypes.object,
    customButtonIcon: PropTypes.string,
    customButtonIconColor: PropTypes.string,
    customButtonComponent: PropTypes.element
}

export default SelectMenu;