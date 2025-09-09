import styles from './Navbar.module.css';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineAddBox } from "react-icons/md";
import { LuSquareUser } from "react-icons/lu";
import SearchBar from './SearchBar';
import Profile from './Profile';
import CreateIcon from './CreateIcon';
import { Auth } from './Auth';

export default function Navbar({ user, loggedIn, isEditing, handleEditing, dateTime, searchQuery, setSearchQuery, setIsModalOpen, handleModalClick, setModalContent, shortcuts, setShortcuts, userId }) {
    const handleAddShortcut = () => {
        if (searchQuery || isEditing) return;
        handleModalClick();
        setModalContent(<CreateIcon shortcuts={shortcuts} setShortcuts={setShortcuts} setIsModalOpen={setIsModalOpen} loggedIn={loggedIn} userId={userId} />);
    }
    
    const handleUserIconClick = () => {
        handleModalClick();
        setModalContent(loggedIn ? <Profile user={user} setIsModalOpen={setIsModalOpen} /> : <Auth setModalContent={setModalContent} handleModalClick={handleModalClick} setIsModalOpen={setIsModalOpen} />);
    }

    return (
        <div className={styles.navbar}>
            {/* Menu Icon */}
            {/* Name */}
            <span>Hello, {user.name}</span>
            {/* Search Bar */}
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <span className={styles.navbarSection}>
                <span>{dateTime[0]}</span> | <span>{dateTime[1]}</span>
            </span>
            <span className={`${styles.navbarSection} ${styles.iconsContainer}`}>
                <FaRegEdit onClick={handleEditing} className={`${styles.icon} ${styles.editIcon} ${isEditing ? styles.editing : ''} ${searchQuery ? styles.disabledBtn : ''}`} />
                <MdOutlineAddBox onClick={handleAddShortcut} className={`${styles.icon} ${(searchQuery || isEditing) ? styles.disabledBtn : ''}`} />
            </span>
            <LuSquareUser onClick={handleUserIconClick} className={styles.icon} />
            {/* Profile */}
        </div>
    )
}