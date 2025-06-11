import { useEffect, useState } from "react";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    updateProfile,
    updatePassword,
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "../services/api";
import { fetchGameDetails } from "../services/gamesService";
import type { User } from "firebase/auth";

export default function Profile() {
    const auth = getAuth();
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userReviews, setUserReviews] = useState<{ gameName: string; review: string }[]>([]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFirstName(data.firstName || "");
                    setLastName(data.lastName || "");
                    setBio(data.bio || "");
                }
            }
        });
        return unsub;
    }, []);

    useEffect(() => {
        const fetchUserReviews = async () => {
            if (!user) return;
            const q = query(
                collection(db, "reviews"),
                where("user", "==", user.email || user.uid)
            );
            const querySnapshot = await getDocs(q);
            const reviewsArr: { gameName: string; review: string }[] = [];
            for (const docSnap of querySnapshot.docs) {
                const data = docSnap.data();
                let gameName = "";
                try {
                    const gameDetails = await fetchGameDetails(data.id);
                    gameName = gameDetails.name;
                } catch {
                    gameName = "Unknown Game";
                }
                reviewsArr.push({
                    gameName,
                    review: data.review,
                });
            }
            setUserReviews(reviewsArr);
        };
        if (user) fetchUserReviews();
    }, [user]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (isRegister) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const currentUser = userCredential.user;
                if (currentUser) {
                    await setDoc(doc(db, "users", currentUser.uid), {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        firstName,
                        lastName,
                        bio,
                        role: "user",
                        createdAt: serverTimestamp(),
                    });
                }
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogle = async () => {
        setError(null);
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            const currentUser = result.user;

            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    firstName: "",
                    lastName: "",
                    bio: "",
                    role: "user",
                    createdAt: serverTimestamp(),
                });
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (!confirmed) return;
        await signOut(auth);
    };

    const handleUpdate = async () => {
        if (!user) return;
        try {
            await updateDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                bio,
            });
            if (newPassword) {
                await updatePassword(user, newPassword);
                setNewPassword("");
            }
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-200 text-center space-y-4">
                    <h1 className="text-3xl font-bold text-green-600">Profile</h1>
                    <p><strong>Email:</strong> {user.email}</p>

                    {!isEditing ? (
                        <>
                            <p><strong>First Name:</strong> {firstName}</p>
                            <p><strong>Last Name:</strong> {lastName}</p>
                            <p><strong>Bio:</strong> {bio || "No bio yet."}</p>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                className="border-b border-gray-400 p-1 w-full"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                            />
                            <input
                                type="text"
                                className="border-b border-gray-400 p-1 w-full"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                            />
                            <textarea
                                className="border-b border-gray-400 p-1 w-full"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Bio"
                            />
                            <input
                                type="password"
                                className="border-b border-gray-400 p-1 w-full"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                            />
                        </>
                    )}

                    {isEditing ? (
                        <div className="flex gap-2 justify-center">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={handleUpdate}
                            >
                                Save
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}

                    <button
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    {/* User Reviews Section */}
                    <div className="mt-8 text-left">
                        <h2 className="text-xl font-bold text-green-700 mb-2">Your Reviews</h2>
                        {userReviews.length === 0 ? (
                            <p className="text-gray-500">You haven't submitted any reviews yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {userReviews.map((r, idx) => (
                                    <li key={idx} className="bg-gray-100 rounded p-2">
                                        <span className="font-semibold text-black">{r.gameName}</span>
                                        <p className="text-gray-700">{r.review}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-96 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4">
                    {isRegister ? "Register" : "Login"}
                </h1>
                <form className="flex flex-col gap-3 w-full" onSubmit={handleEmailAuth}>
                    {isRegister && (
                        <>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="border p-2 rounded"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="border p-2 rounded"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </>
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        type="submit"
                    >
                        {isRegister ? "Register" : "Login"}
                    </button>
                    <button
                        type="button"
                        className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                        onClick={handleGoogle}
                    >
                        Sign in with Google
                    </button>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                </form>
                <button
                    className="mt-2 text-blue-600 underline text-sm"
                    onClick={() => setIsRegister((r) => !r)}
                >
                    {isRegister
                        ? "Already have an account? Login"
                        : "Don't have an account? Register"}
                </button>
            </div>
        </div>
    );
}
