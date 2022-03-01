import React, {useState} from "react";
import catchAsync from "utils/CatchAsync";
import {useDeleteLabelQuery, useLabelProjectsQuery, useLabelTasksQuery} from "hooks/useDetailsData";
import "./label.scss";
import SelectMenu from "components/UI/SelectMenu";

const Label = ({id, title, active, onLabelSelected}) => {

    const {isLoading: isTasksLoading} = useLabelTasksQuery(id);
    const {isLoading: isProjectsLoading} = useLabelProjectsQuery(id);
    const {mutateAsync: deleteLabel, isLoading} = useDeleteLabelQuery();

    const deleteLabelHandler = catchAsync(async () => {
        await deleteLabel(id);
    }, {
        onLoad: "Deleting label",
        onSuccess: "Label deleted",
        onError: "Delete label failed"
    });

    const [isMouseInLabel, setIsMouseInLabel] = useState(false);

    const selectMenuOptions = [
        {
            text: "Edit",
            iconClass: "far fa-pen",
            action: () => {},
        },
        {
            text: "Delete",
            iconClass: "far fa-trash-alt",
            action: deleteLabelHandler,
            disabled: isLoading,
            yesNoQAlert: true,
            color: "danger"
        }
    ]

    return (
        <React.Fragment>

            <input
                type="radio"
                id={`label-${id}`}
                name="select-label"
                onChange={onLabelSelected}
                value={id}
                hidden
            />

            <label
                className={[
                    "label",
                    active ? "label-active" : null,
                    isMouseInLabel ? "label-hover" : null
                ].join(" ")}
                htmlFor={`label-${id}`}
                onClick={isTasksLoading || isProjectsLoading ? (e) => e.preventDefault() : null}
                onMouseEnter={(e) => setIsMouseInLabel(true)}
                onMouseLeave={(e) => setIsMouseInLabel(false)}
            >
                <div className="label-text-wrapper">
                    <span className="label-text">{title}</span>
                    <SelectMenu options={selectMenuOptions} type="executable-options" buttonAxis="v"/>
                </div>

                <div className="label-shape">
                    <div></div>
                </div>
            </label>

        </React.Fragment>
    )
}
export default Label;