import { useState } from "react";

export default function Copilot({ open, setOpen }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "👋 Hello! I'm FlowCRM AI Copilot.\n\nI'm your virtual CRM assistant. You can ask me anything about your customers, meetings, sales pipeline, follow-ups, or even general business questions.\n\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    // Show user's message immediately
    setMessages((prev) => [...prev, userMessage]);

    const question = input;
    setInput("");

    try {
      setLoading(true);

      // =====================================
      // TEMPORARY AI RESPONSE
      // Replace this section with Gemini later
      // =====================================

      let aiReply = "";

      if (question.toLowerCase().includes("hello")) {
        aiReply =
          "Hello! 😊 How can I assist you with your CRM today?";
      } else if (question.toLowerCase().includes("meeting")) {
        aiReply =
          "Meetings help you track interactions with customers. You can schedule, update, and manage them from the Meetings page.";
      } else if (question.toLowerCase().includes("pipeline")) {
        aiReply =
          "Your sales pipeline shows where every company is in the sales journey—from Lead to Customer.";
      } else if (question.toLowerCase().includes("company")) {
        aiReply =
          "You can manage all customer companies from the Companies page, including editing their details and tracking progress.";
      } else if (question.toLowerCase().includes("email")) {
        aiReply =
          "Soon I'll be able to generate professional follow-up emails using Gemini AI.";
      } else {
        aiReply =
          "That's a great question! 😊 I'm currently running in demo mode. Once Gemini AI is connected, I'll provide intelligent, context-aware answers.";
      }

      const aiMessage = {
        sender: "ai",
        text: aiReply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="copilot" style={{ display: "block" }}>
          <div className="copilot-header">
            🤖 FlowCRM AI Copilot

            <span
              className="close-copilot"
              onClick={() => setOpen(false)}
            >
              ✖
            </span>
          </div>

          <div
            className="copilot-body"
            style={{
              height: "420px",
              overflowY: "auto",
              padding: "15px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "15px",
                  textAlign:
                    msg.sender === "user" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    maxWidth: "80%",
                    background:
                      msg.sender === "user"
                        ? "#2563eb"
                        : "#f1f5f9",
                    color:
                      msg.sender === "user"
                        ? "white"
                        : "#222",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <strong>
                    {msg.sender === "user"
                      ? "You"
                      : "AI Copilot"}
                  </strong>

                  <br />

                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ marginTop: "10px" }}>
                🤖 Thinking...
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "10px",
              borderTop: "1px solid #ddd",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Ask AI anything..."
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={handleSend}
              style={{
                padding: "12px 18px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#2563eb",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <div
        className="copilot-btn"
        onClick={() => setOpen(!open)}
      >
        🤖
      </div>
    </>
  );
}