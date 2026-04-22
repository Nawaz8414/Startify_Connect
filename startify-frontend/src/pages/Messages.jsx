import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "../components/common.css";
import DashboardLayout from "../components/DashboardLayout";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";   // ✅ added

export default function Messages() {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { userId } = useParams();

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socketRef = useRef(null);   // ✅ FIXED
  const bottomRef = useRef();

  if (!user || !token) {
    return <p style={{ padding: 20 }}>Please login to view messages.</p>;
  }

  // ✅ CONNECT SOCKET
  useEffect(() => {
    socketRef.current = io(API_URL);   // ✅ dynamic

    socketRef.current.emit("join", user.id);

    return () => {
      socketRef.current.disconnect();
    };
  }, [user.id]);



  // ✅ FETCH USERS
  useEffect(() => {

    fetch(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {

        setUsers(data);

        if (userId) {
          const found = data.find(u => u._id === userId);
          if (found) setActiveUser(found);
        }

      })
      .catch(err => console.error("User fetch error:", err));

  }, [token, userId]);



  // ✅ LOAD MESSAGES
  useEffect(() => {

    if (!activeUser) return;

    fetch(`${API_URL}/api/messages/${activeUser._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setMessages);

  }, [activeUser, token]);



  // ✅ RECEIVE SOCKET
  useEffect(() => {

    if (!socketRef.current) return;

    socketRef.current.on("receiveMessage", msg => {

      if (
        activeUser &&
        (msg.from === activeUser._id || msg.from === user.id)
      ) {
        setMessages(prev => [...prev, msg]);
      }

    });

    return () => socketRef.current?.off("receiveMessage");

  }, [activeUser, user.id]);



  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  // ✅ SEND MESSAGE
  const sendMessage = async () => {

    if (!text || !activeUser) return;

    const msgData = {
      from: user.id,
      to: activeUser._id,
      fromName: user.name,
      text,
    };

    socketRef.current.emit("sendMessage", msgData);

    await fetch(`${API_URL}/api/messages`, {
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

        {/* Users */}
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



        {/* Chat Box */}
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