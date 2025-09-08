import { CiSearch } from "react-icons/ci";
import styles from './SearchBar.module.css';

export default function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div className={styles.searchbar}>
            <CiSearch />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
        </div>
    )
}