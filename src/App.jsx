import React, { useEffect, useRef, useState } from "react";
import Orb from "./Orb";

const HF_URL = "https://api-inference.huggingface.co/models/TON_ORG/TON_MODELE";
const HF_TOKEN = "hf_TA_CLE_ICI"; // remplace par ton token HF
const initialIsMobile =
  typeof window !== "undefined" ? window.innerWidth < 900 : false;

function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasSent, setHasSent] = useState(false);
  const [isMobile, setIsMobile] = useState(() => initialIsMobile);
  const [sidebarOpen, setSidebarOpen] = useState(() => !initialIsMobile);
  const prevIsMobile = useRef(initialIsMobile);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (prevIsMobile.current !== isMobile) {
      // On mobile, hide the sidebar by default; on desktop, keep it open.
      setSidebarOpen(!isMobile);
      prevIsMobile.current = isMobile;
    }
  }, [isMobile]);

  async function sendMessageToBackend(text) {
    const res = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_TOKEN}`,
      },
      body: JSON.stringify({ inputs: text }),
    });

    const data = await res.json();

    let reply;
    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data?.generated_text) {
      reply = data.generated_text;
    } else {
      reply = typeof data === "string" ? data : JSON.stringify(data);
    }

    setMessages((prev) => [...prev, { from: "ai", text: reply }]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInputValue("");
    setHasSent(true);
    sendMessageToBackend(text);
  }

  function handleMicClick() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportee par ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      alert("Petit souci avec le micro, essaie encore.");
    };

    recognition.start();
  }

  const navButtons = [
    { icon: "ri-add-line", label: "Nouveau chat" },
    { icon: "ri-time-line", label: "Chats recents" },
    { icon: "ri-star-line", label: "Favoris" },
  ];

  const headerHeight = isMobile ? 56 : 64;
  const footerHeight = isMobile ? 92 : 98;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "radial-gradient(circle at 20% 20%, #162138, #0b1021 55%)",
        display: "flex",
        fontFamily:
          "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#e5e7eb",
        paddingBottom: "0px",
      }}
    >
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 20,
          }}
        />
      )}

      <aside
        style={{
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          height: isMobile ? "100%" : "100vh",
          width: "260px",
          maxWidth: "80%",
          background: "rgba(9,12,26,0.9)",
          borderRight: "1px solid rgba(148,163,184,0.2)",
          transform: isMobile
            ? sidebarOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "translateX(0)",
          transition: "transform 0.25s ease, opacity 0.25s ease",
          zIndex: 30,
          padding: "18px 14px",
          display: sidebarOpen ? "flex" : "none",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            height: "48px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "14px",
                background: "linear-gradient(135deg,#38bdf8,#6366f1)",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                color: "#0b1120",
                letterSpacing: "0.02em",
              }}
            >
              OA
            </div>
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#e2e8f0",
                }}
              >
                Octaia Assistant
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                Toujours a l'ecoute
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.35)",
              background: "rgba(255,255,255,0.02)",
              color: "#e5e7eb",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
            aria-label="Fermer la barre laterale"
          >
            <i className="ri-close-line" style={{ fontSize: "18px" }} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {navButtons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "flex-start",
                padding: "12px 12px",
                borderRadius: "12px",
                border: "1px solid rgba(148,163,184,0.15)",
                background: "rgba(255,255,255,0.03)",
                color: "#e5e7eb",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <i className={btn.icon} style={{ fontSize: "18px" }} />
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "14px",
            borderTop: "1px solid rgba(148,163,184,0.18)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <button
            type="button"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "flex-start",
              padding: "11px 12px",
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.2)",
              background:
                "linear-gradient(135deg,rgba(56,189,248,0.12),rgba(99,102,241,0.15))",
              color: "#e2e8f0",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <i className="ri-compass-3-line" style={{ fontSize: "18px" }} />
            <span>Explorer</span>
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "16px 14px 18px" : "20px 24px 24px",
          gap: isMobile ? "10px" : "14px",
          minWidth: 0,
          width: "100%",
          height: "auto",
          overflowY: "auto",
          position: "relative",
          paddingBottom: isMobile ? "12px" : "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            height: `${headerHeight}px`,
          }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            style={{
              width: isMobile ? "52px" : "40px",
              height: isMobile ? "52px" : "40px",
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.35)",
              background: "rgba(255,255,255,0.05)",
              color: "#e2e8f0",
              display: sidebarOpen ? "none" : "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
            aria-label="Ouvrir le menu"
          >
            <i
              className="ri-menu-line"
              style={{ fontSize: isMobile ? "20px" : "18px" }}
            />
          </button>

          <div style={{ textAlign: "center", flex: 1 }} />

          <div style={{ width: "38px", visibility: "hidden" }} />
        </div>

        {!hasSent && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "16px 0" : "22px 0",
              flexDirection: "column",
              gap: "10px",
              flex: 1,
            }}
          >
            <div
              style={{
                transform: isMobile ? "scale(1.35)" : "scale(1.8)",
                transformOrigin: "center",
              }}
            >
              <Orb />
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "6px",
                color: "#cfeff8",
                opacity: 0.95,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: 700,
                  color: "#cfeff8",
                }}
              >
                Octaia Assistant
              </div>
              <div
                style={{
                  fontSize: isMobile ? "13px" : "14px",
                  color: "#bfeff4",
                  marginTop: "4px",
                  opacity: 0.9,
                }}
              >
                En quoi puis-je vous aider aujourd'hui ?
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: isMobile ? "4px 4px" : "8px 6px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            maxHeight: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "flex-start" : "center",
            paddingLeft: isMobile ? "4px" : "20px",
            paddingRight: isMobile ? "4px" : "20px",
          }}
        >
          <div
            style={{
              width: isMobile ? "100%" : "70%",
              maxWidth: isMobile ? "100%" : "840px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    maxWidth: isMobile ? "88%" : "74%",
                    padding: isMobile ? "10px 13px" : "10px 14px",
                    borderRadius: "16px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    background:
                      m.from === "user"
                        ? "linear-gradient(135deg,#38bdf8,#6366f1)"
                        : "rgba(255,255,255,0.08)",
                    color: m.from === "user" ? "#f8fafc" : "#e2e8f0",
                    border:
                      m.from === "user"
                        ? "1px solid rgba(255,255,255,0.14)"
                        : "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingTop: isMobile ? "8px" : "10px",
            paddingBottom: isMobile ? "6px" : "8px",
            position: "sticky",
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(11,16,33,0.15), rgba(11,16,33,0.45))",
            zIndex: 6,
            justifyContent: isMobile ? "flex-start" : "center",
            paddingLeft: isMobile ? "0" : "20px",
            paddingRight: isMobile ? "0" : "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: isMobile ? "100%" : "70%",
              maxWidth: isMobile ? "100%" : "840px",
            }}
          >
            <button
              type="button"
              onClick={handleMicClick}
              style={{
                width: isMobile ? "48px" : "44px",
                height: isMobile ? "48px" : "44px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e5e7eb",
                fontSize: "18px",
                cursor: "pointer",
                flexShrink: 0,
              }}
              aria-label="Activer le micro"
            >
              <i className="ri-mic-2-line" />
            </button>


            <input
              type="text"
              placeholder="Ecris ta question ou ta consigne ici..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                flex: 1,
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.08)",
                padding: isMobile ? "10px 14px" : "12px 16px",
                fontSize: "14px",
                color: "#e5e7eb",
                outline: "none",
                minWidth: 0,
              }}
            />

            <button
              type="submit"
              style={{
                padding: isMobile ? "10px 14px" : "11px 18px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg,#38bdf8,#6366f1)",
                color: "#f9fafb",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexShrink: 0,
              }}
            >
              <i className="ri-send-plane-2-line" />
              Envoyer
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
