import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../services/api";
import type { Game } from "../interfaces/Game";

type UserGameLists = {
  playedGames: number[];
  queuedGames: number[];
  wishlist: number[];
};

type UserGameListsContextType = {
  lists: UserGameLists;
  addToList: (list: keyof UserGameLists, gameId: number) => Promise<void>;
  removeFromList: (list: keyof UserGameLists, gameId: number) => Promise<void>;
  isInList: (list: keyof UserGameLists, gameId: number) => boolean;
  refresh: () => Promise<void>;
};

const UserGameListsContext = createContext<UserGameListsContextType | undefined>(undefined);

export function UserGameListsProvider({ children }: { children: React.ReactNode }) {
  const auth = getAuth();
  const [lists, setLists] = useState<UserGameLists>({
    playedGames: [],
    queuedGames: [],
    wishlist: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLists({
          playedGames: [],
          queuedGames: [],
          wishlist: [],
        });
      } else {
        fetchLists();
      }
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  const fetchLists = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLists({
        playedGames: [],
        queuedGames: [],
        wishlist: [],
      });
      return;
    }
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setLists({
        playedGames: data.playedGames || [],
        queuedGames: data.queuedGames || [],
        wishlist: data.wishlist || [],
      });
    }
  };

  useEffect(() => {
    fetchLists();
    // eslint-disable-next-line
  }, [auth.currentUser]);

  const addToList = async (list: keyof UserGameLists, gameId: number) => {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      [list]: arrayUnion(gameId),
    });
    await fetchLists();
  };

  const removeFromList = async (list: keyof UserGameLists, gameId: number) => {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      [list]: arrayRemove(gameId),
    });
    await fetchLists();
  };

  const isInList = (list: keyof UserGameLists, gameId: number) => {
    return lists[list].includes(gameId);
  };

  return (
    <UserGameListsContext.Provider value={{ lists, addToList, removeFromList, isInList, refresh: fetchLists }}>
      {children}
    </UserGameListsContext.Provider>
  );
}

export function useUserGameLists() {
  const ctx = useContext(UserGameListsContext);
  if (!ctx) throw new Error("useUserGameLists must be used within UserGameListsProvider");
  return ctx;
}