import { useState } from "react";
import { uploadIcon } from "../middleware/shortcutService";
import styles from "./CreateIcon.module.css";

export default function CreateIcon({ shortcuts, setShortcuts, setIsModalOpen, handleModalClick, loggedIn, userId }) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [iconFile, setIconFile] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        let newShortcut = null;
        if (!loggedIn) {
            if (!name || !url || !iconUrl) {
                alert('Please fill in all required fields.');
                return;
            }
            else if (!url.match(regex)) {
                alert('Please enter a valid URL.');
                return;
            }
            newShortcut = {
                id: crypto.randomUUID(),
                name: name,
                icon_url: iconUrl,
                link: url,
                orderIndex: shortcuts.length + 1
            }
        }
        else {
            if (iconUrl && iconFile) {
                alert('Please only enter the icon url or file');
                return;
            }
            else if (!name || !url && (!iconUrl || !iconFile)) {
                alert('Please fill in all required fields');
                return;
            }
            if (userId && iconUrl) {
                newShortcut = {
                    id: crypto.randomUUID(),
                    name: name,
                    icon_url: iconUrl,
                    link: url,
                    orderIndex: shortcuts.length + 1
                }
            }
            else if (userId && iconFile) {
                let tempUrl = await uploadIcon(userId, iconFile);
                newShortcut = {
                    id: crypto.randomUUID(),
                    name: name,
                    icon_url: tempUrl,
                    link: url,
                    orderIndex: shortcuts.length + 1
                }
            }
        }

        localStorage.setItem("shortcuts", JSON.stringify([...shortcuts, newShortcut]));
        setShortcuts([...shortcuts, newShortcut]);
        setName('');
        setUrl('');
        setIconUrl('');
        setIconFile('');
        setIsModalOpen(false);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create Shortcut</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Name</label>
                    <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} className={styles.input} required />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>URL</label>
                    <input type="url" value={url} onChange={(e) => { setUrl(e.target.value) }} className={styles.input} pattern="https?://.+" required />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Icon (Link)</label>
                    {loggedIn ? <input type="url" value={iconUrl} onChange={(e) => { setIconUrl(e.target.value) }} className={styles.input} /> : <input type="url" value={iconUrl} onChange={(e) => { setIconUrl(e.target.value) }} className={styles.input} required />}
                </div>
                {loggedIn &&
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Icon (File)</label>
                        <input type="file" onChange={(e) => { setIconFile(e.target.files[0]) }} className={styles.input} accept="image/*" />
                    </div>}
                <button type="submit" className={styles.submitBtn}>Create</button>
            </form>
        </div>
    )
}