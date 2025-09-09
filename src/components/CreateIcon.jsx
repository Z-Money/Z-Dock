import { useState } from "react";
import { uploadIcon } from "../middleware/shortcutService";
import styles from "./CreateIcon.module.css";

export default function CreateIcon({ shortcuts, setShortcuts, setIsModalOpen, loggedIn, userId }) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [iconFile, setIconFile] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValidUrl = (urlString) => {
            try {
                new URL(urlString);
                return true;
            } catch {
                return false;
            }
        }
        let newShortcut = null;
        if (!loggedIn) {
            if (!name || !url || !iconUrl) {
                alert('Please fill in all required fields.');
                return;
            }
            else if (!isValidUrl(url)) {
                alert('Please enter a valid URL.');
                return;
            }
            newShortcut = {
                id: crypto.randomUUID(),
                name: name,
                icon_url: iconUrl,
                link: url,
                orderIndex: shortcuts.length + 1
            };
            localStorage.setItem("shortcuts", JSON.stringify([...shortcuts, newShortcut]));
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

        setShortcuts([...shortcuts, newShortcut]);
        setName('');
        setUrl('');
        setIconUrl('');
        setIconFile('');
        if (loggedIn) document.querySelector('#iconFileUpload').value = '';
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
                        <input id='iconFileUpload' type="file" onChange={(e) => { setIconFile(e.target.files[0]) }} className={styles.input} accept="image/*" />
                    </div>}
                <button type="submit" className={styles.submitBtn}>Create</button>
            </form>
        </div>
    )
}