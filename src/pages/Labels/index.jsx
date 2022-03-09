import React, {useEffect, useState} from "react";
import PageContainer from "components/UI/PageContainer";
import CreateInput from "components/CreateInput";
import Label from "components/Label";
import catchAsync from "utils/CatchAsync";
import LabelTabs from "components/LabelTabs";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {useQueryClient} from "react-query";
import {useCreateLabelQuery} from "hooks/useDetailsData";
import EmptySign from "components/UI/EmptySign";
import "./labels.scss";

const Labels = () => {
    const {pathname} = useLocation();
    const {id} = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const labels = queryClient.getQueryData('labels');
    const {mutateAsync: createLabel} = useCreateLabelQuery();

    const [selectedLabelId, setSelectedLabelId] = useState(
        id ? Number(id) : (labels.length !== 0 ? labels[0].id : 0)
    );

    useEffect(() => {
        if (id) {
            if (!Number(id)) navigate('/404')
            if (!labels.find(lbl => lbl.id === Number(id))) navigate('/404')
            setSelectedLabelId(Number(id))
        }
    }, [pathname]);

    const onLabelSelected = (e) => navigate('/labels/' + Number(e.target.value));

    const [isCreateLabelButtonDisabled, setIsCreateLabelButtonDisabled] = useState(false);
    const createLabelHandler = (title) => {
        catchAsync(async () => {
            setIsCreateLabelButtonDisabled(true);
            await createLabel(title);
            setIsCreateLabelButtonDisabled(false)
        }, {
            onLoad: "Creating label", onSuccess: "Label created", onError: "Create label failed"
        })();
    };

    return (
        <React.Fragment>
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
                            {labels.map(label => (
                                <Label
                                    id={label.id}
                                    key={label.id}
                                    title={label.title}
                                    active={selectedLabelId === label.id}
                                    onLabelSelected={onLabelSelected}
                                />
                            ))}
                        </section>
                    </div>

                    {labels.length !== 0
                        ? <LabelTabs selectedLabelId={selectedLabelId}/>
                        : <EmptySign text="There is no any label"/>
                    }

                </div>
            </PageContainer>
            <Outlet/>
        </React.Fragment>
    )
}

export default Labels;
