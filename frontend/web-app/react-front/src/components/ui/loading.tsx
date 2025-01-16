import React from "react";

const Loader: React.FC = () => {
  return (
    <div style={styles.loaderContainer}>
      <div style={styles.loader}></div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #d4d4d4",
    borderTop: "5px solid blue",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Loader;

/** Add this CSS to the global stylesheet */
const globalStyles = `
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;

if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}
