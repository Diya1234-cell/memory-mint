import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { RelationshipSpace, Memory } from "@/types/models";

export function useFirestore(userId?: string | null, spaceId?: string | null) {
  const [spaces, setSpaces] = useState<RelationshipSpace[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setSpaces([]);
      return;
    }
    let loaded = false;
    const q = query(
      collection(db, "spaces"),
      where("members", "array-contains", userId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const result = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RelationshipSpace));
      setSpaces(result);
      if (!loaded) {
        loaded = true;
        setLoading(false);
      }
    });
    return unsub;
  }, [userId]);

  useEffect(() => {
    if (!spaceId) {
      setMemories([]);
      return;
    }
    let loaded = false;
    const q = query(
      collection(db, "memories"),
      where("spaceId", "==", spaceId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const result = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt:
            data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt,
          updatedAt:
            data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt,
        } as Memory;
      });
      setMemories(result);
      if (!loaded) {
        loaded = true;
        setLoading(false);
      }
    });
    return unsub;
  }, [spaceId]);

  return { spaces, memories, loading };
}
