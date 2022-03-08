import React from "react";
import EmptySign from "components/UI/EmptySign";
import "./listTab.scss";

const ListTab = ({children,isEmpty, emptyListWarning = "There is no any item"}) => {

    const renderTasks = () => {
        if (!isEmpty) {
            return (
                <div className="list-tab-items">
                    {children}
                </div>
            )
        } else {
            return <EmptySign text={emptyListWarning}/>
        }
    }

    return (
        <div className="list-tab">
            {renderTasks()}
        </div>
    );
}

export default ListTab;