import styles from './Shortcut.module.css';
export default function Shortcut({ id, link, icon_url, name, isEditing, handleDelete }) {
    const handleClick = (e) => {
        e.preventDefault();
        if (isEditing) return;
        window.open(link, '_blank');
    };

    return (
        <li className={styles.li} onClick={handleClick}>
            <div className={`${styles.icon} ${isEditing ? styles.iconEditing : ''}`}>
                <img src={icon_url} alt={name} />
                <h3>{name}</h3>
            </div>
            {isEditing && <span onClick={(e) => { e.stopPropagation(); handleDelete(id); }} className={styles.deleteBtn}>X</span>}
        </li>
    );
}

