import { Avatar } from "@material-ui/core";
import {
  ThumbUpOutlined,
  ThumbDownOutlined,
  ChatBubbleOutlined,
  MoreHorizOutlined,
  RepeatOneOutlined,
  ShareOutlined,
} from "@material-ui/icons";
import React, { useState } from "react";
import "./css/Post.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CloseIcon from "@material-ui/icons/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactTimeAgo from "react-time-ago";
import axios from "axios";
import ReactHtmlParser from "html-react-parser";
import { useSelector } from "react-redux";
import { selectUser } from "../feature/userSlice";

function LastSeen({ date }) {
  return (
    <div>
      <ReactTimeAgo date={date} locale="en-US" timeStyle="round" />
    </div>
  );
}

function Post({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const Close = <CloseIcon />;

  const user = useSelector(selectUser);

  const handleQuill = (value) => {
    setAnswer(value);
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1);
  };

  const handleSubmit = async () => {
    if (post?._id && answer !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = {
        answer: answer,
        questionId: post?._id,
        user: user,
      };
      try {
        const res = await axios.post("/api/answers", body, config);
        console.log(res.data);
        alert("Answer added successfully");
        setIsModalOpen(false);
        window.location.href = "/";
      } catch (error) {
        console.error(error);
      }
    }
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Share Post',
        text: 'Check out this post!',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
      window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank');
      window.open(`https://www.linkedin.com/shareArticle?url=${window.location.href}`, '_blank');
    }
  };

  return (
    <div className="post">
      <div className="post__info">
        <Avatar src={post?.user?.photo} />
        <h4>{post?.user?.userName}</h4>
        <small>
          <LastSeen date={post?.createdAt} />
        </small>
      </div>
      <div className="post__body">
        <div className="post__question">
          <p>{post?.questionName}</p>
          <button
            onClick={() => {
              setIsModalOpen(true);
              console.log(post?._id);
            }}
            className="post__btnAnswer"
          >
            Answer
          </button>
          <ShareOutlined onClick={sharePost} className="post__btnShare" />
          <Modal
            open={isModalOpen}
            closeIcon={Close}
            onClose={() => setIsModalOpen(false)}
            closeOnEsc
            center
            closeOnOverlayClick={false}
            styles={{
              overlay: {
                height: "auto",
              },
            }}
          >
            <div className="modal__question">
              <h1>{post?.questionName}</h1>
              <p>
                asked by <span className="name">{post?.user?.userName}</span> on{" "}
                <span className="name">
                  {new Date(post?.createdAt).toLocaleString()}
                </span>
              </p>
            </div>
            <div className="modal__answer">
              <ReactQuill
                value={answer}
                onChange={handleQuill}
                placeholder="Enter your answer"
              />
            </div>
            <div className="modal__button">
              <button className="cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSubmit} type="submit" className="add">
                Add Answer
              </button>
            </div>
          </Modal>
        </div>
        {post.questionUrl !== "" && <img src={post.questionUrl} alt="url" />}
      </div>
      <div className="post__footer">
        <div className="post__footerAction">
          <ThumbUpOutlined onClick={handleLike} />
          <span>{likes}</span>
          <ThumbDownOutlined onClick={handleDislike} /><span>{dislikes}</span>
        </div>
        <RepeatOneOutlined />
        <ChatBubbleOutlined />
        <div className="post__footerLeft">
          <ShareOutlined onClick={sharePost} />
          <MoreHorizOutlined />
        </div>
      </div>
      <p
        style={{
          color: "rgba(0,0,0,0.5)",
          fontSize: "12px",
          fontWeight: "bold",
          margin: "10px 0",
        }}
      >
        {post?.allAnswers.length} Answer(s)
      </p>
      <div
        style={{
          margin: "5px 0px 0px 0px ",
          padding: "5px 0px 0px 20px",
          borderTop: "1px solid lightgray",
        }}
        className="post__answer"
      >
        {post?.allAnswers?.map((_a, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              padding: "10px 5px",
              borderTop: "1px solid lightgray",
            }}
            className="post-answer-container"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#888",
              }}
              className="post-answered"
            >
              <Avatar src={_a?.user?.photo} />
              <div
                style={{
                  margin: "0px 10px",
                }}
                className="post-info"
              >
                <p>{_a?.user?.userName}</p>
                <span>
                  <LastSeen date={_a?.createdAt} />
                </span>
              </div>
            </div>
            <div className="post-answer">{ReactHtmlParser(_a?.answer)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
