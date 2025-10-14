import React, { useState } from 'react';
import styles from './ViewControlButtons.module.css';
import { useSelector } from 'react-redux';
import { BsFillFastForwardBtnFill, BsZoomIn } from "react-icons/bs";


const ViewControlButtons = ({
    ShowBack,
    ShowFront,
    ShowLeftSleeve,
    ShowRightSleeve,
    toggleZoom,
    logo,
    settingsForsides,
    hidden
}) => {

    const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
    const [toggleTitle, setToggleTitle] = useState("BACK");
    const [toggleTitleLeftRight, setToggleTitleLeftRight] = useState("LEFT");

    const handleFrontBackToggle = () => {
        if (activeSide === "front") {
            ShowBack();
            setToggleTitle("FRONT");
        }
        else {
            setToggleTitle("BACK");
            ShowFront();
        }
        // console.log('Toggle Front/Back View');
    };

    const handleLeftRightToggle = () => {
        if (activeSide === "leftSleeve") {
            ShowRightSleeve();
            setToggleTitleLeftRight("LEFT");
        }
        else {
            ShowLeftSleeve();
            setToggleTitleLeftRight("RIGHT");
        }
        console.log('Toggle Left/Right View');
    };

    // const handleVerticalZoom = () => {
    //     console.log('Zoom Vertically');
    // };

    return (
        <div className={styles.buttonContainer}>
            <button
                onClick={handleFrontBackToggle}
                className={styles.iconButton}
                title={"BACK"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 48 48">
                    <path d="M47.8 39.5 39 32.3c-.1-.1-.3-.2-.5-.2-.4 0-.7.3-.7.7v2.8H25.6c-.6 0-1.1.5-1.1 1.1v6.7c0 .6.5 1.1 1.1 1.1h12.3v2.8c0 .3.2.5.4.6.2.1.5.1.7-.1l8.8-7.3.2-.3v-.5l-.2-.2zM2.2 9.5z" />
                    <path d="M28.6 6.6c1.1-1.2 1.6-2.5 1.7-3.2v-.1h.3c.5.1.8.1 1.6.6.8.4 2.1 1.3 4.2 2.7 1.1.8 2.6 2.1 3.7 3.1.6.5 1.1 1 1.4 1.4l.2.2-5.5 5.9c-.3-.1-.6-.3-.9-.6-.3-.2-.7-.4-1-.6l-.3-.2-.1-.1c-.1-.2-.4-.4-.6-.3-.3.1-.5.3-.5.6v17.3c0 .2.1.3.2.4s.3.2.4.2h2.1c.2 0 .3-.1.4-.2s.2-.3.2-.4V20.6h.2c.7 0 1.4-.3 2-.9l6.2-6.6c.5-.5.7-1.2.7-1.8 0-.7-.3-1.3-.7-1.9-.2-.2-3.6-3.8-6.2-5.6-2.2-1.5-3.6-2.4-4.6-3-1-.6-1.8-.8-2.7-.9h-.1c-.1.1-.3.1-.6.1s-.9 0-1.6.4c-.7.4-1.3 1.1-1.6 2.2 0 .1-.3.8-.8 1.6-.6.7-1.5 1.4-2.9 1.5-1.5-.1-2.4-.8-3-1.5-.3-.4-.5-.8-.6-1l-.1-.3v-.1c-.3-1.2-.9-1.9-1.6-2.2-.7-.6-1.4-.6-1.7-.6-.3 0-.5 0-.7.1h-.1c-.8.1-1.5.3-2.6.9-1 .6-2.4 1.5-4.6 3-2.6 1.7-6.1 5.3-6.2 5.5-.5.5-.7 1.2-.7 1.9s.2 1.3.7 1.8l6.2 6.6c.5.6 1.2.9 2 .9h.3V38c0 2.5 1.9 4.5 4.3 4.5h7.2c.2 0 .3-.1.4-.2.1-.1.2-.3.2-.4v-2.1c0-.2-.1-.3-.2-.4-.1-.1-.3-.2-.4-.2H15c-.3 0-.5-.1-.7-.3-.2-.2-.3-.5-.3-.9V15.9c0-.2-.1-.3-.2-.4-.1-.1-.3-.2-.4-.2s-.3.1-.4.2c-.1.1-.1.1-.1.2 0 0-.2.2-.5.4-.4.3-1 .6-1.4.9-.1.1-.3.2-.4.2L5 11.3l.2-.2c1.1-1.1 3.4-3.4 5.1-4.5 2.2-1.5 3.4-2.3 4.2-2.7.8-.4 1.1-.5 1.6-.6h.3l.1.1c.2.6.7 1.9 1.7 3.2C19.3 7.8 21 8.9 23.4 9c2.4-.1 4.1-1.2 5.2-2.4zM44.6 9.5z" />
                </svg>
                {toggleTitle}
            </button>
            {!hidden && (
                <button
                    onClick={handleLeftRightToggle}
                    className={styles.iconButton}
                    title={"view left"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 48 48">
                        <path d="M47.8 39.5 39 32.3c-.1-.1-.3-.2-.5-.2-.4 0-.7.3-.7.7v2.8H25.6c-.6 0-1.1.5-1.1 1.1v6.7c0 .6.5 1.1 1.1 1.1h12.3v2.8c0 .3.2.5.4.6.2.1.5.1.7-.1l8.8-7.3.2-.3v-.5l-.2-.2zM2.2 9.5z" />
                        <path d="M28.6 6.6c1.1-1.2 1.6-2.5 1.7-3.2v-.1h.3c.5.1.8.1 1.6.6.8.4 2.1 1.3 4.2 2.7 1.1.8 2.6 2.1 3.7 3.1.6.5 1.1 1 1.4 1.4l.2.2-5.5 5.9c-.3-.1-.6-.3-.9-.6-.3-.2-.7-.4-1-.6l-.3-.2-.1-.1c-.1-.2-.4-.4-.6-.3-.3.1-.5.3-.5.6v17.3c0 .2.1.3.2.4s.3.2.4.2h2.1c.2 0 .3-.1.4-.2s.2-.3.2-.4V20.6h.2c.7 0 1.4-.3 2-.9l6.2-6.6c.5-.5.7-1.2.7-1.8 0-.7-.3-1.3-.7-1.9-.2-.2-3.6-3.8-6.2-5.6-2.2-1.5-3.6-2.4-4.6-3-1-.6-1.8-.8-2.7-.9h-.1c-.1.1-.3.1-.6.1s-.9 0-1.6.4c-.7.4-1.3 1.1-1.6 2.2 0 .1-.3.8-.8 1.6-.6.7-1.5 1.4-2.9 1.5-1.5-.1-2.4-.8-3-1.5-.3-.4-.5-.8-.6-1l-.1-.3v-.1c-.3-1.2-.9-1.9-1.6-2.2-.7-.6-1.4-.6-1.7-.6-.3 0-.5 0-.7.1h-.1c-.8.1-1.5.3-2.6.9-1 .6-2.4 1.5-4.6 3-2.6 1.7-6.1 5.3-6.2 5.5-.5.5-.7 1.2-.7 1.9s.2 1.3.7 1.8l6.2 6.6c.5.6 1.2.9 2 .9h.3V38c0 2.5 1.9 4.5 4.3 4.5h7.2c.2 0 .3-.1.4-.2.1-.1.2-.3.2-.4v-2.1c0-.2-.1-.3-.2-.4-.1-.1-.3-.2-.4-.2H15c-.3 0-.5-.1-.7-.3-.2-.2-.3-.5-.3-.9V15.9c0-.2-.1-.3-.2-.4-.1-.1-.3-.2-.4-.2s-.3.1-.4.2c-.1.1-.1.1-.1.2 0 0-.2.2-.5.4-.4.3-1 .6-1.4.9-.1.1-.3.2-.4.2L5 11.3l.2-.2c1.1-1.1 3.4-3.4 5.1-4.5 2.2-1.5 3.4-2.3 4.2-2.7.8-.4 1.1-.5 1.6-.6h.3l.1.1c.2.6.7 1.9 1.7 3.2C19.3 7.8 21 8.9 23.4 9c2.4-.1 4.1-1.2 5.2-2.4zM44.6 9.5z" />
                    </svg>
                    {toggleTitleLeftRight}
                </button>
            )}

            {settingsForsides?.enableZoomFeature &&
                (
                    <button
                        className={styles.iconButton}
                        onClick={() => toggleZoom()}
                    >
                        <BsZoomIn />
                        ZOOM
                    </button>

                )}

        </div>
    );
};

export default ViewControlButtons;
