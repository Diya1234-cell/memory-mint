import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import type { Memory } from "@/types/models";

export async function getSpace(spaceId: string) {
  try {
    const snap = await getDoc(doc(db, "spaces", spaceId));
    if (!snap.exists()) {
      return { success: false, error: "Space not found" } as const;
    }
    return { success: true, data: { id: snap.id, ...snap.data() } } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function getSpacesForUser(userId: string) {
  try {
    const q = query(
      collection(db, "spaces"),
      where("members", "array-contains", userId)
    );
    const snap = await getDocs(q);
    const spaces = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { success: true, data: spaces } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function joinSpace(spaceId: string, userId: string) {
  try {
    await updateDoc(doc(db, "spaces", spaceId), {
      members: arrayUnion(userId),
    });
    return { success: true } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function addMemory(
  memory: Omit<Memory, "id" | "createdAt">
) {
  try {
    const docRef = await addDoc(collection(db, "memories"), {
      ...memory,
      createdAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function getMemories(spaceId: string) {
  try {
    const q = query(
      collection(db, "memories"),
      where("spaceId", "==", spaceId)
    );
    const snap = await getDocs(q);
    const memories = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt,
        updatedAt:
          data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt,
      } as Memory;
    });
    return { success: true, data: memories } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function getLetterState(spaceId: string, userId: string) {
  try {
    const snap = await getDoc(doc(db, "spaces", spaceId, "letterStates", userId));
    return { success: true, data: snap.exists() ? snap.data() : null } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function saveLetterState(spaceId: string, userId: string, state: Record<string, unknown>) {
  try {
    await setDoc(doc(db, "spaces", spaceId, "letterStates", userId), {
      ...state,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    return { success: true } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}
