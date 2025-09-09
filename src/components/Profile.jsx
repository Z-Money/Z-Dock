// Import from middleware
import supabase from '../middleware/supabase';

// Import styles
import styles from "./Profile.module.css"

export default function Profile({ user, setIsModalOpen }) {
    const signOut = () => {
        supabase.auth.signOut();
        setIsModalOpen(false);
    }
    return (
        <div className={styles.container}>
            <h2>Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <button onClick={signOut}>Sign Out</button>
        </div>
    )
}
