import React from "react";
import Lottie from "lottie-react";
import orbAnimation from "./assets/wellness-orb.json";

function Orb() {
  return (
    <div
      style={{
        width: "300px",
        height: "300px",
        borderRadius: "999px",
        padding: "20px",
        background:
          "radial-gradient(circle,#111827 0%,rgba(15,23,42,0.4) 40%,transparent 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Lottie
        animationData={orbAnimation}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default Orb;
