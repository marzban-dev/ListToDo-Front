import React, {useEffect, useState} from "react";
import SelectMenu from "components/UI/SelectMenu";
import Member from "components/Member";
import "./selectAssignee.scss";

const SelectAssignee = ({taskAssignee, setTaskAssignee, members}) => {

    const [selectMenuOptions, setSelectMenuOptions] = useState([
        {
            iconClass: "far fa-user-circle",
            text: "No Assignee",
            value: null,
            iconColor: "var(--color-icon)"
        }
    ]);

    useEffect(() => {
        const selectMenuMembers = [];

        members.forEach(member => {
            selectMenuMembers.push({
                iconCustomComponent: (
                    <Member
                        picture={member.owner.profile_img}
                        name={member.owner.username}
                        style={{width : "20px",height: "20px"}}
                        disableHover
                    />
                ),
                text: member.owner.username,
                value: member.owner
            })
        })

        setSelectMenuOptions([...selectMenuOptions, ...selectMenuMembers]);
    }, []);

    return (
        <SelectMenu
            options={selectMenuOptions}
            type="selectable-options"
            CustomButtonComponent={(
                <Member
                    picture={taskAssignee ? taskAssignee.profile_img : null}
                    name={taskAssignee ? taskAssignee.username : "No Assignee"}
                    style={{width : "24px",height: "24px"}}
                    defaultIconSize="22px"
                    disableHover
                />
            )}
            activeOption={taskAssignee}
            setActiveOption={setTaskAssignee}
        />
    );
};

export default SelectAssignee;
