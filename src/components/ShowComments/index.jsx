import React, {useState} from "react";
import {useCommentsQuery, useCreateCommentQuery} from "hooks/useComments";
import LoadingWrapper from "components/UI/LoadingWrapper";
import Comment from "components/Comment";
import CreateCommentInput from "./components/CreateCommentInput";
import {toast} from "react-toastify";
import {TOASTIFY_OPTIONS} from "config";
import SkeletonLoader from "components/UI/SkeletonLoader";
import "./comments.scss";
import catchAsync from "utils/CatchAsync";

const ShowComments = ({id, task}) => {
    const {data: comments} = useCommentsQuery(id, task);
    const {mutateAsync: createComment,isLoading} = useCreateCommentQuery(id, task);
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [description, setDescription] = useState('');

    const createCommentHandler = catchAsync(async () => {
        setIsInputDisabled(true);

        const commentData = new FormData();

        if (description.length !== 0) {
            commentData.append('description', description);
            commentData.append('project', id);
            if (attachment) commentData.append('file', attachment, attachment.name);
            setDescription("");
            await createComment({data: commentData});
            setIsInputDisabled(false);
        } else {
            setIsInputDisabled(false);
            toast.info(
                "Description is empty",
                {...TOASTIFY_OPTIONS, autoClose: 2000, position: "top-center"}
            )
        }
    }, null, () => setIsInputDisabled(false));

    return (
        <div className="show-comments-container">
            <CreateCommentInput
                attachment={attachment}
                setAttachment={setAttachment}
                description={description}
                setDescription={setDescription}
                onClick={createCommentHandler}
                isDisabled={isInputDisabled}
                isCreating={isLoading}
            />
            <LoadingWrapper show={!!comments} customLoadingComponent={
                <SkeletonLoader
                    type={"comments"}
                    width={500}
                    height={450}
                    viewBox="0 0 500 450"
                    style={{marginTop: "2.5rem"}}
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