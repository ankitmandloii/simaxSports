import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./NotFound.module.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1 className={style.title}>404</h1>
        <p className={style.message}>Oops! The page you're looking for doesn't exist.</p>
        <button className={style.button} onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
