import { useCallback, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Which collection the user tracks, saved in Firestore at users/{uid}
export const useTrackedCollection = (uid: string | null | undefined) => {
  const [tracked, setTracked] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(uid));

  useEffect(() => {
    if (!uid) {
      setTracked(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    return onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        setTracked(
          (snap.data()?.trackedCollection as string | undefined) ?? null,
        );
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, [uid]);

  const track = useCallback(
    async (collectionId: string) => {
      if (!uid) return;
      setTracked(collectionId); // show the change right away
      await setDoc(
        doc(db, "users", uid),
        { trackedCollection: collectionId },
        { merge: true },
      );
    },
    [uid],
  );

  return { tracked, trackedLoading: loading, track };
};
