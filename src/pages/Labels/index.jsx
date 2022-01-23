import React, {useState} from "react";
import PageContainer from "components/UI/PageContainer";
import CreateInput from "components/CreateInput";
import {useDispatch, useSelector} from "react-redux";
import Label from "components/Label";
import catchAsync from "Utils/CatchAsync";
import {createLabel, fetchLabelTreeData} from "store/actions/ApiCalls.actions";
import {addLabel, setLabelData} from "store/actions/Main.actions";
import LabelTree from "components/LabelTree";
import "./labels.scss";

const Labels = () => {
    const labels = useSelector(state => state.main.labels)
    const dispatch = useDispatch();

    const [selectedLabel, setSelectedLabel] = useState(null);
    const [isCreateLabelButtonDisabled, setIsCreateLabelButtonDisabled] = useState(false);

    const onLabelSelected = (e) => {
        console.log(e.target.value)
        setSelectedLabel(e.target.value);
    }

    const setLabelTree = (labelId) => {
        catchAsync(async () => {
            const {projects, tasks} = await dispatch(fetchLabelTreeData(labelId));
            dispatch(setLabelData(labelId, {projects, tasks}))
        })();
    };

    const createLabelHandler = (title) => {
        catchAsync(async () => {
            setIsCreateLabelButtonDisabled(true);

            const createdLabel = await dispatch(createLabel(title));
            dispatch(addLabel(createdLabel));

            setIsCreateLabelButtonDisabled(false)
        }, {
            onLoad: "Creating label",
            onSuccess: "Label created",
            onError: "Create label failed"
        })();
    };

    const [tabState, setTabState] = useState("tasks");

    return (
        <PageContainer>
            <div className="labels-container">
                <div className="labels">
                    <CreateInput
                        onClick={createLabelHandler}
                        iconClass="far fa-plus-circle"
                        placeholder="Label name"
                        isDisabled={isCreateLabelButtonDisabled}
                    />
                    <section className="labels-list">
                        {labels.map(label => {
                            return (
                                <Label
                                    id={label.id}
                                    key={label.id}
                                    title={label.title}
                                    active={selectedLabel === label.id}
                                    onLabelSelected={onLabelSelected}
                                />
                            )
                        })}
                    </section>
                </div>
                <LabelTree activeTab={tabState} labelTasks={} labelProjects={}/>
            </div>
        </PageContainer>
    )
}

export default Labels;
