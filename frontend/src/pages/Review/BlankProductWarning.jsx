import React from "react";
import { useNavigate } from "react-router-dom";

const BlankProductWarning = () => {
    const navigate = useNavigate();
    return (
        <div style={styles.container}>
            <span style={styles.text}>
                You cannot purchase blank products in our studio.{" "}
                <span onClick={() => navigate("/design/product")} style={styles.link}>
                    Click Here
                </span>{" "}
                to add a design to your product
            </span>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#f6dede",
        color: "#8b2c2c",
        padding: "16px",
        borderRadius: "6px",
        fontSize: "16px",
        lineHeight: "1.5",
        maxWidth: "100%",
        fontFamily: "sans-serif",
    },
    text: {
        display: "inline",
    },
    link: {
        cursor: "pointer",
        color: "#f5592b",
        textDecoration: "none",
        fontWeight: "500",
    },
};

export default BlankProductWarning;
