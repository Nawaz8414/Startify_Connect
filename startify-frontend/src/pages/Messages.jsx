import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "../components/common.css";
import DashboardLayout from "../components/DashboardLayout";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5050");

export default function Messages() {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { userId } = useParams();

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef();

  if (!user || !token) {
    return <p style={{ padding: 20 }}>Please login to view messages.</p>;
  }

  // Join socket room
  useEffect(() => {
    socket.emit("join", user.id);
  }, [user.id]);



  // Fetch all users
  useEffect(() => {

    fetch("http://localhost:5050/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {

        setUsers(data);

        // AUTO SELECT USER FROM URL
        if (userId) {
          const found = data.find(u => u._id === userId);
          if (found) setActiveUser(found);
        }

      })
      .catch(err => console.error("User fetch error:", err));

  }, [token, userId]);



  // Load messages when active user changes
  useEffect(() => {

    if (!activeUser) return;

    fetch(`http://localhost:5050/api/messages/${activeUser._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setMessages);

  }, [activeUser, token]);



  // Receive socket messages
  useEffect(() => {

    socket.on("receiveMessage", msg => {

      if (
        activeUser &&
        (msg.from === activeUser._id || msg.from === user.id)
      ) {
        setMessages(prev => [...prev, msg]);
      }

    });

    return () => socket.off("receiveMessage");

  }, [activeUser, user.id]);



  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  const sendMessage = async () => {

    if (!text || !activeUser) return;

    const msgData = {
      from: user.id,
      to: activeUser._id,
      fromName: user.name,
      text,
    };

    socket.emit("sendMessage", msgData);

    await fetch("http://localhost:5050/api/messages", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        to: activeUser._id,
        toName: activeUser.name,
        text,
      }),

    });

    setMessages(prev => [...prev, msgData]);
    setText("");

  };



  return (
    <DashboardLayout>

      <div className="chat-layout">

        {/* Users list */}
        <div className="chat-users">
          <h3>Chats</h3>

          {users.map(u => (
            <div
              key={u._id}
              className={`chat-user-item ${
                activeUser?._id === u._id ? "active" : ""
              }`}
              onClick={() => setActiveUser(u)}
            >
              👤 {u.name}
            </div>
          ))}

        </div>



        {/* Chat box */}
        <div className="chat-box">

          {!activeUser ? (

            <p>Select a user to start chatting</p>

          ) : (

            <>
              <h3>Chat with {activeUser.name}</h3>

              <div className="chat-messages">

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`chat-bubble ${
                      m.from === user.id ? "me" : "other"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}

                <div ref={bottomRef} />

              </div>

              <div className="chat-input">

                <input
                  placeholder="Type a message..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                />

                <button
                  className="btn-primary"
                  onClick={sendMessage}
                >
                  Send
                </button>

              </div>
            </>
          )}

        </div>

      </div>

    </DashboardLayout>
  );
}