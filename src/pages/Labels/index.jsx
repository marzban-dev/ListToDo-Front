import React, {useState} from "react";
import PageContainer from "../../components/UI/PageContainer";
import CreateInput from "../../components/CreateInput";
import {useSelector} from "react-redux";
import Label from "../../components/Label";
import "./labels.scss";

const Labels = () => {

    const labels = useSelector(state => state.main.labels)
    const [selectedLabel, setSelectedLabel] = useState(null);

    const onLabelSelected = (e) => {
        console.log(e.target.value)
        setSelectedLabel(e.target.value);
    }

    return (
        <PageContainer>
            <div className="labels-container">
                <div className="labels">

                    <CreateInput onClick={(e) => {}} iconClass="far fa-plus-circle" placeholder="Label name"/>

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
            </div>
        </PageContainer>
    )
}

export default Labels;