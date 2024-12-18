import React, { useState } from "react";
import HomeIcon from "@material-ui/icons/Home";
import {
  AssignmentTurnedInOutlined,
  NotificationsOutlined,
  PeopleAltOutlined,
  Search,
} from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { Avatar, Button, Input } from "@material-ui/core";
import "./css/QuoraHeader.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { logout, selectUser } from "../feature/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ExpandMore } from "@material-ui/icons";

function QuoraHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleSubmit = async () => {
    if (question !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = {
        questionName: question,
        questionUrl: inputUrl,
        user: user,
      };
      try {
        const res = await axios.post("/api/questions", body, config);
        console.log(res.data);
        alert(res.data.message);
        window.location.href = "/";
      } catch (error) {
        console.error("Error adding question:", error.response);
        if (error.response) {
          alert("Error: " + error.response.data.message);
        } else {
          alert("Error adding question. Please try again later.");
        }
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure to logout ?")) {
      signOut(auth)
        .then(() => {
          dispatch(logout());
          console.log("Logged out");
        })
        .catch(() => {
          console.log("error in logout");
        });
    }
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="qHeader">
      <div className="qHeader-content">
        <div className="qHeader__logo">
          <img
            src="https://video-public.canva.com/VAD8lt3jPyI/v/ec7205f25c.gif"
            alt="logo"
          />
        </div>
        <div className="qHeader__icons">
          <div className="qHeader__icon" onClick={scrollToTop}>
            <HomeIcon />
          </div>
          <div className="qHeader__icon">
            <PeopleAltOutlined />
          </div>
          <div className="qHeader__icon">
            <NotificationsOutlined onClick={handleNotifications} />
          </div>
        </div>
        <div className="qHeader__input">
          <Search />
          <input type="text" placeholder="Search questions" />
        </div>
        <div className="qHeader__Rem">
          <span onClick={handleLogout}>
            <Avatar src={user?.photo} />
          </span>

          <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
          <Modal
            open={isModalOpen}
            closeIcon={<CloseIcon />}
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
            <div className="modal__title">
              <h5>Add Question</h5>
              <h5>Share Link</h5>
            </div>
            <div className="modal__info">
              <Avatar src={user?.photo} className="avatar" />
              <div className="modal__scope">
                <PeopleAltOutlined />
                <p>Public</p>
                <ExpandMore />
              </div>
            </div>
            <div className="modal__Field">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                type=" text"
                placeholder="Start your question with 'What', 'How', 'Why', etc. "
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  style={{
                    margin: "5px 0",
                    border: "1px solid lightgray",
                    padding: "10px",
                    outline: "2px solid #000",
                  }}
                  placeholder="Optional: include a link that gives context"
                />
                {inputUrl !== "" && (
                  <img
                    style={{
                      height: "40vh",
                      objectFit: "contain",
                    }}
                    src={inputUrl}
                    alt="displayimage"
                  />
                )}
              </div>
            </div>
            <div className="modal__buttons">
              <button className="cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSubmit} type="submit" className="add">
                Add Question
              </button>
            </div>
          </Modal>
        </div>
      </div>
      {showNotifications && (
        <div className="notifications-panel">
          {}
          <p>Notifications Panel</p>
        </div>
      )}
    </div>
  );
}

export default QuoraHeader;
