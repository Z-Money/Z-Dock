// Import from dependencies
import { useState } from "react";

// Import styles
import styles from './Auth.module.css';

// Import middleware
import supabase from '../middleware/supabase';

export function Auth({ setModalContent, handleModalClick, setIsModalOpen }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert(error.message);
            return;
        }
        setIsModalOpen(false);
    };

    const handleForgotPassword = () => {
        setModalContent(<ForgotPassword setModalContent={setModalContent} handleModalClick={handleModalClick} setIsModalOpen={setIsModalOpen} />);
    };

    const handleSignup = () => {
        setModalContent(<Signup setModalContent={setModalContent} handleModalClick={handleModalClick} setIsModalOpen={setIsModalOpen} />);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <span onClick={handleForgotPassword} className={styles.forgotPassword}>Forgot Password?</span>
                <button type="submit" className={styles.submitBtn}>Login</button>
                <span className={styles.signupText}>Don't have an account?&nbsp;<span onClick={handleSignup} className={styles.signup}>Signup</span>
                </span>
            </form>
        </div>
    );
}

export function Signup({ setModalContent, handleModalClick, setIsModalOpen }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            alert(error.message);
            return;
        }

        const userId = data?.user?.id;
        if (!userId) {
            console.error("No user ID returned after signup:", data);
            alert("Could not create user. Please try again.");
            return;
        }

        const { error: updateError } = await supabase
            .from("users")
            .update({ name })
            .eq("id", userId);

        if (updateError) {
            console.error("Error updating user name:", updateError);
        }

        const shortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
        if (shortcuts.length > 0) {
            const { error: insertError } = await supabase.from("shortcuts").insert(
                shortcuts.map((s, idx) => ({
                    user_id: userId,
                    name: s.name,
                    link: s.link,
                    icon_url: s.icon,
                    order_index: idx,
                }))
            );

            if (insertError) {
                console.error("Error inserting shortcuts:", insertError);
            }
        }
        setIsModalOpen(false);
    }

    const handleLogin = () => {
        setModalContent(<Auth setModalContent={setModalContent} handleModalClick={handleModalClick} setIsModalOpen={setIsModalOpen} />);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Signup</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className={styles.submitBtn}>Signup</button>
                <span className={styles.signupText}>
                    Already have an account?&nbsp;
                    <span onClick={handleLogin} className={styles.signup}>Login</span>
                </span>
            </form>
        </div>
    );
}

export function ForgotPassword({ setModalContent, handleModalClick, setIsModalOpen }) {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin
        });
        if (error) {
            alert(error.message);
            return;
        } else {
            alert("Password reset email sent! Please check your inbox.");
            setIsModalOpen(false);
            handleBackToLogin();
        }
    }

    const handleBackToLogin = () => {
        setModalContent(<Auth setModalContent={setModalContent} handleModalClick={handleModalClick} setIsModalOpen={setIsModalOpen} />);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Forgot Password</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required
                    />
                </div>
                <button type="submit" className={styles.submitBtn}>Reset Password</button>
                <span className={styles.signupText}>
                    Already have an account?&nbsp;
                    <span onClick={handleBackToLogin} className={styles.signup}>
                        Login
                    </span>
                </span>
            </form>
        </div>
    );
}
