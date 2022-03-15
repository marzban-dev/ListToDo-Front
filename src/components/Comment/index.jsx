import React from "react";
import Member from "components/Member";
import {useQueryClient} from "react-query";
import {useDeleteCommentQuery} from "hooks/useComments";
import catchAsync from "utils/CatchAsync";
import "./comment.scss";

const Comment = ({comment}) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData('user');
    const {mutateAsync: deleteComment} = useDeleteCommentQuery(comment.project.id, !!comment.task);

    const isOwnerIsCurrentUser = user.id === comment.owner.id;

    const deleteCommentHandler = catchAsync(async () => {
        await deleteComment(comment.id);
    }, {
        onLoad: "Deleting comment",
        onSuccess: "Comment deleted",
        onError: "Delete comment failed"
    })

    return (
        <div className={["comment", isOwnerIsCurrentUser ? "comment-view-right" : null].join(' ')}>
            {!isOwnerIsCurrentUser && (
                <Member
                    picture={comment.owner.profile_img}
                    name={comment.owner.first_name}
                    style={{width: "40px", height: "40px"}}
                    disableHover
                />
            )}
            <div className="comment-box">
                {!isOwnerIsCurrentUser && <h4>{comment.owner.first_name}</h4>}
                <p>{comment.description}</p>
                <div className="comment-box-data">
                    <span className="comment-box-data-date">
                        {new Date(comment.created).toLocaleDateString()} {new Date(comment.created).toLocaleTimeString()}
                    </span>
                    {comment.file && (
                        <a
                            href={comment.file}
                            className="comment-box-data-attachment-link"
                            data-tip="Download attachment"
                            data-effect="solid"
                            download
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="far fa-paperclip"></span>
                        </a>
                    )}
                    {isOwnerIsCurrentUser && (
                        <button className="comment-box-data-delete-btn" onClick={deleteCommentHandler}>
                            <span className="far fa-trash-alt"></span>
                        </button>
                    )}
                </div>
            </div>
            {isOwnerIsCurrentUser && (
                <Member
                    picture={comment.owner.profile_img}
                    name={comment.owner.first_name}
                    style={{width: "40px", height: "40px"}}
                    disableHover
                />
            )}
        </div>
    );
}

export default Comment;