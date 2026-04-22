import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { API_URL } from "../config";   // ✅ added

export default function AIAssistant() {

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const chatEndRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;  // ✅ safe

  // Load chat history
  useEffect(() => {

    if (!user) return;

    fetch(`${API_URL}/api/ai/history/${user.id}`)   // ✅ fixed
      .then(res => res.json())
      .then(data => {

        const formatted = data.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        setMessages(formatted);

      })
      .catch(err => console.error("AI history error:", err));

  }, [user]);



  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);



  const askAI = async () => {

    if (!prompt.trim() || !user) return;

    const userMessage = { role: "user", content: prompt };

    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {

      const res = await fetch(`${API_URL}/api/ai/ask`, {   // ✅ fixed
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          userId: user.id
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error("AI request failed");

      const aiMessage = { role: "ai", content: data.content };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error("AI error:", err);
      setMessages(prev => [
        ...prev,
        { role: "ai", content: "⚠️ Failed to get response. Try again." }
      ]);
    } finally {
      setLoading(false);
    }

  };



  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };



  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };



  const clearChat = () => {
    setMessages([]);
  };



  // Voice input
  const startVoice = () => {

    if (!window.webkitSpeechRecognition) {
      alert("Voice not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;

    setListening(true);

    recognition.onresult = (event) => {
      setPrompt(event.results[0][0].transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();

  };



  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>

      <h2>✨ AI Assistant</h2>

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          background: "#fafafa"
        }}
      >

        {messages.map((msg, index) => (

          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px"
            }}
          >

            <div
              style={{
                padding: "12px",
                borderRadius: "12px",
                background: msg.role === "user" ? "#4f46e5" : "#e5e7eb",
                color: msg.role === "user" ? "white" : "black",
                maxWidth: "70%"
              }}
            >

              <ReactMarkdown>{msg.content}</ReactMarkdown>

              {msg.role === "ai" && (
                <button onClick={() => copyText(msg.content)}>
                  📋 Copy
                </button>
              )}

            </div>

          </div>

        ))}

        {loading && <p>🤖 AI is typing...</p>}

        <div ref={chatEndRef} />

      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="Ask about startups, tech, or ideas..."
        style={{
          width: "100%",
          marginTop: "15px",
          padding: "10px"
        }}
      />

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

        <button onClick={askAI}>
          Ask AI
        </button>

        <button onClick={startVoice}>
          🎤 Voice
        </button>

        <button onClick={clearChat}>
          🗑 Clear
        </button>

      </div>

      {listening && <p>🎤 Listening...</p>}

    </div>
  );
}