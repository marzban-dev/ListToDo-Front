import React, {useRef} from "react";
import Spinner from "components/UI/Spinner";
import "./createCommentInput.scss";

const CreateCommentInput =
    ({
         isDisabled,
         attachment,
         setAttachment,
         description,
         setDescription,
         onClick,
         isCreating
     }) => {
        const descriptionInput = useRef(null);
        const uploadAttachInput = useRef(null);

        const onClickHandler = () => {
            onClick();
            descriptionInput.current.value = "";
        }

        const setAttachmentHandler = (e) => {
            if (e.target.files.length > 0) {
                setAttachment(e.target.files[0]);
            }
        }

        const deleteAttachment = () => {
            uploadAttachInput.current.value = null;
            setAttachment(null);
        }

        return (
            <div className="create-comment-input">
            <textarea
                ref={descriptionInput}
                wrap="hard"
                cols={2}
                placeholder="Write your comment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
                <div className="create-comment-input-actions">
                    <input type="file" id="comment-attachment" onChange={setAttachmentHandler} ref={uploadAttachInput}
                           hidden/>
                    {attachment ? (
                        <button
                            className="comment-attachment-preview"
                            onClick={deleteAttachment}
                            data-tip={attachment.name}
                            data-effect="solid"
                        >
                            <span className="far fa-file-upload"></span>
                        </button>
                    ) : (
                        <label htmlFor="comment-attachment">
                            <span className="far fa-paperclip"></span>
                        </label>
                    )}
                    <button onClick={isDisabled ? null : onClickHandler}>
                        {isCreating ? (
                            <Spinner type="dots" size="xs" />
                        ) : (
                            <span className="far fa-paper-plane"></span>
                        )}
                    </button>
                </div>
            </div>
        )
    };

export default CreateCommentInput;