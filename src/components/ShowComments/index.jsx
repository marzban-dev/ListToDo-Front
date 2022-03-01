import React, {useState} from "react";
import {useCommentsQuery, useCreateCommentQuery} from "hooks/useComments";
import LoadingWrapper from "components/UI/LoadingWrapper";
import Comment from "components/Comment";
import CreateCommentInput from "./components/CreateCommentInput";
import {toast} from "react-toastify";
import {TOASTIFY_OPTIONS} from "config";
import SkeletonLoader from "components/UI/SkeletonLoader";
import "./comments.scss";

const ShowComments = ({id, task}) => {
    const {data: comments} = useCommentsQuery(id, task);
    const {mutateAsync: createComment} = useCreateCommentQuery(id, task);
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [description, setDescription] = useState('');

    const createCommentHandler = async () => {
        setIsInputDisabled(true);

        const alertId = toast.loading("Creating comment", {
            ...TOASTIFY_OPTIONS,
            hideProgressBar: false,
            progressStyle: {backgroundColor: "var(--color-primary)"},
        });

        try {
            const commentData = new FormData();

            if (description.length !== 0) {

                commentData.append('description', description)
                if (attachment) commentData.append('file', attachment, attachment.name);

                const uploadProgressHandler = (progressEvent) => {
                    if (attachment) {
                        const percentCompleted = progressEvent.loaded / progressEvent.total;
                        toast.update(alertId, {
                            progress: percentCompleted,
                        });
                    } else {
                        toast.update(alertId, {
                            render: "Comment created",
                            type: "success",
                            isLoading: false,
                            hideProgressBar: true,
                            autoClose: 2000
                        });
                    }
                }

                await createComment({id, data: commentData, uploadProgressHandler});
            } else {
                toast.info("Description is empty", {...TOASTIFY_OPTIONS, autoClose: 2000})
            }
        } catch (error) {
            toast.update(alertId, {
                render: "Create comment failed",
                type: "error",
                isLoading: false,
                progress: 100
            });
        } finally {
            setIsInputDisabled(false);
        }
    }

    return (
        <div className="show-comments-container">
            <CreateCommentInput
                attachment={attachment}
                setAttachment={setAttachment}
                description={description}
                setDescription={setDescription}
                onClick={createCommentHandler}
                isDisabled={isInputDisabled}
            />
            <LoadingWrapper show={!!comments} customLoadingComponent={
                <SkeletonLoader
                    type={"comments"}
                    width={500}
                    height={450}
                    viewBox="0 0 500 450"
                    style={{marginTop:"2.5rem"}}
                />
            }>
               <div className="comments-list">
                   {comments && comments.map(comment => <Comment comment={comment}/>)}
               </div>
            </LoadingWrapper>
        </div>
    );
}

export default ShowComments;