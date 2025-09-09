// Import from dependencies
import { useState, useEffect, useRef } from "react"


// Import components
import Navbar from "./components/Navbar"
import ShortcutContainer from "./components/SortableContainer"
import Modal from "./components/Modal"

// Import middleware
import { setDateTime } from "./middleware/dateTime"
import supabase from "./middleware/supabase"
import { getShortcuts, saveShortcuts, deleteShortcut } from "./middleware/shortcutService"

// Main App
export default function App() {
  const [session, setSession] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({
    id: null,
    name: "Guest",
    email: null,
    created_at: null,
    background_color: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dateTime, setDateTimeState] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState();
  // const [shortcuts, setShortcuts] = useState([
  //   {
  //     id: 1,
  //     name: "MyUSF",
  //     icon: "https://zdmc-sso.vercel.app/images/MyUSF.webp",
  //     link: "https://my.usf.edu/myusf/home_myusf/index",
  //     orderIndex: 0
  //   },
  //   {
  //     id: 2,
  //     name: "USF Canvas",
  //     icon: "https://zdmc-sso.vercel.app/images/USF Canvas.webp",
  //     link: "https://usflearn.instructure.com/",
  //     orderIndex: 1
  //   },
  //   {
  //     id: 3,
  //     name: "Schoology",
  //     icon: "https://zdmc-sso.vercel.app/images/Schoology.webp",
  //     link: "https://manatee.schoology.com/home",
  //     orderIndex: 2
  //   },
  //   {
  //     id: 4,
  //     name: "Focus",
  //     icon: "https://zdmc-sso.vercel.app/images/Focus.webp",
  //     link: "https://focus.manateeschools.net/focus/Modules.php?modname=misc/Portal.php",
  //     orderIndex: 3
  //   },
  //   {
  //     id: 5,
  //     name: "CollegeBoard",
  //     icon: "https://zdmc-sso.vercel.app/images/CollegeBoard.webp",
  //     link: "https://apstudents.collegeboard.org/",
  //     orderIndex: 4
  //   },
  //   {
  //     id: 6,
  //     name: "Pearson Course",
  //     icon: "https://zdmc-sso.vercel.app/images/Pearson Course.webp",
  //     link: "https://mycourses.pearson.com/course-home#/tab/active",
  //     orderIndex: 5
  //   },
  //   {
  //     id: 7,
  //     name: "Pivot Interactives",
  //     icon: "https://zdmc-sso.vercel.app/images/Pivot Interactives.webp",
  //     link: "https://app.pivotinteractives.com/classes",
  //     orderIndex: 6
  //   },
  //   {
  //     id: 8,
  //     name: "MySCF",
  //     icon: "https://zdmc-sso.vercel.app/images/MySCF.webp",
  //     link: "https://my.scf.edu/",
  //     orderIndex: 7
  //   },
  //   {
  //     id: 9,
  //     name: "SCF Canvas",
  //     icon: "https://zdmc-sso.vercel.app/images/SCF Canvas.webp",
  //     link: "https://scf.instructure.com/",
  //     orderIndex: 8
  //   },
  //   {
  //     id: 10,
  //     name: "BryteWave",
  //     icon: "https://zdmc-sso.vercel.app/images/BryteWave.webp",
  //     link: "https://brytewave.redshelf.com/app/ecom/shelf",
  //     orderIndex: 9
  //   }
  // ]);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState(shortcuts);
  const hasLoaded = useRef(false);

  // Check active session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoggedIn(!!session);
      getUserProfile();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoggedIn(!!session);
      getUserProfile();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event == "PASSWORD_RECOVERY") {
        const newPassword = prompt("What would you like your new password to be?");
        const { data, error } = await supabase.auth
          .updateUser({ password: newPassword })
        if (data) alert("Password updated successfully!")
        if (error) alert("There was an error updating your password.")
      }
    })
  }, []);

  const getUserProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // Fetch extra profile data
      const { data: profile, error } = await supabase
        .from("users")
        .select("id, name, email, created_at, background_color")
        .eq("id", session.user.id)
        .single();


      if (error) {
        // console.error("Error loading user profile:", error);
      } else {
        setUser(profile);
      }
    } else {
      // Default guest user
      setUser({
        id: null,
        name: "Guest",
        email: null,
        created_at: null,
        background_color: null,
      });
    }
  };

  // Load shortcuts on login or fallback to localStorage
  useEffect(() => {
    const loadShortcuts = async () => {
      if (session?.user) {
        const dbShortcuts = await getShortcuts(session.user.id);
        setShortcuts(dbShortcuts);
      }
      else {
        const savedShortcuts = localStorage.getItem("shortcuts");
        if (savedShortcuts) {
          setShortcuts(JSON.parse(savedShortcuts));
        }
        else {
          const portfolio = [{ id: crypto.randomUUID(), name: "Portfolio", icon_url: "https://zachariah-kersey.web.app/images/apple-touch-icon.png", link: "https://zachariah-kersey.web.app/", orderIndex: 0 }];
          localStorage.setItem("shortcuts", JSON.stringify(portfolio));
          setShortcuts(portfolio);
        }
      }
      hasLoaded.current = true;
    };

    loadShortcuts();
  }, [session]);

  // Save whenever shortcuts change (but not on first load)
  useEffect(() => {
    if (hasLoaded.current) return; // ⛔ skip first render

    const save = async () => {
      if (session?.user) {
        await saveShortcuts(session.user.id, shortcuts);
      } else {
        localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
      }
    };

    save();
  }, [shortcuts, session]);

  const handleDelete = async (id) => {
    try {
      setShortcuts((prev) => prev.filter(s => s.id !== id));
      if (session?.user) {
        await deleteShortcut(session.user.id, id);
      }
      else {
        localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
        console.log(localStorage.getItem("shortcuts"));
      }
    } catch (err) {
      console.error("Failed to delete shortcut:", err);
    }
  };

  function handleEditing() {
    if (searchQuery) return;
    setIsEditing(!isEditing);
  }

  function handleModalClick() {
    setIsModalOpen(!isModalOpen);
  }

  // Run setDate function on whenever tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setDateTimeState(setDateTime());
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Set date and time immediately on load
    setDateTimeState(setDateTime());
  }, []);

  useEffect(() => {
    const filteredShortcuts = shortcuts.filter(shortcut => {
      const name = shortcut.name.toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query);
    });
    setFilteredShortcuts(filteredShortcuts);
  }, [searchQuery, shortcuts]);


  return (
    <>
      <Modal modalContent={modalContent} isModalOpen={isModalOpen} handleModalClick={handleModalClick} />
      <Navbar user={user} loggedIn={loggedIn} isEditing={isEditing} handleEditing={handleEditing} dateTime={dateTime} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setIsModalOpen={setIsModalOpen} handleModalClick={handleModalClick} setModalContent={setModalContent} shortcuts={shortcuts} setShortcuts={setShortcuts} userId={session?.user?.id} />
      <ShortcutContainer isEditing={isEditing} shortcuts={shortcuts} filteredShortcuts={filteredShortcuts} setFilteredShortcuts={setFilteredShortcuts} handleDelete={handleDelete} userId={session?.user?.id} />
    </>
  )
}