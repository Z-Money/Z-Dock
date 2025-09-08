import { useEffect } from "react"
import styles from "./Modal.module.css"

export default function Modal({ modalContent, isModalOpen, handleModalClick }) {
    // useEffect(() => {
    //     if (!isModalOpen) return;

    //     const handleClickOutside = (event) => {
    //         const modal = document.querySelector(`.${styles.modal}`);
    //         if (modal && event.target === modal) {
    //             handleModalClick();
    //         }
    //     };

    //     document.addEventListener("click", handleClickOutside);
    //     return () => document.removeEventListener("click", handleClickOutside);
    // }, [isModalOpen, handleModalClick]);


    return (
        <div onClick={(e) => {if (e.target.classList.contains(styles.modal)) {handleModalClick()}}} className={`${styles.modal} ${isModalOpen ? styles.open : ''}`}>
            {modalContent}
        </div>
    )
}