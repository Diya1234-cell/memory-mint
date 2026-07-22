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
import { db } from "@/lib/firebase";

const FIREBASE_UNAVAILABLE_MESSAGE = "Firebase is not configured in this environment.";

const unavailable = () => ({ success: false, error: new Error(FIREBASE_UNAVAILABLE_MESSAGE) } as const);

export async function getSpace(spaceId: string) {
  if (!db) {
    return unavailable();
  }

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
  if (!db) {
    return unavailable();
  }

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

export async function hasUserSpace(userId: string): Promise<boolean> {
  if (!db) {
    return false;
  }

  try {
    const result = await getSpacesForUser(userId);
    if (result.success) {
      return result.data.length > 0;
    }
    return false;
  } catch {
    return false;
  }
}

export async function joinSpace(spaceId: string, userId: string) {
  if (!db) {
    return unavailable();
  }

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
  if (!db) {
    return unavailable();
  }

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
  if (!db) {
    return unavailable();
  }

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

export async function getStoryBookChapters(spaceId: string) {
  if (!db) {
    return unavailable();
  }

  try {
    const q = query(
      collection(db, "spaces", spaceId, "storybook"),
      where("__deleted", "!=", true)
    );
    const snap = await getDocs(q);
    const chapters = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { success: true, data: chapters } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function saveStoryBookChapter(
  spaceId: string,
  chapterId: string | null,
  data: Record<string, unknown>
) {
  if (!db) {
    return unavailable();
  }

  try {
    if (chapterId) {
      await setDoc(doc(db, "spaces", spaceId, "storybook", chapterId), data, { merge: true });
      return { success: true, id: chapterId } as const;
    }
    const docRef = await addDoc(collection(db, "spaces", spaceId, "storybook"), data);
    return { success: true, id: docRef.id } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function deleteStoryBookChapter(spaceId: string, chapterId: string) {
  if (!db) {
    return unavailable();
  }

  try {
    await setDoc(doc(db, "spaces", spaceId, "storybook", chapterId), { __deleted: true }, { merge: true });
    return { success: true } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function createInvite(
  spaceId: string,
  inviterId: string,
  inviteeEmail: string
) {
  if (!db) {
    return unavailable();
  }

  try {
    const inviteToken = crypto.randomUUID();
    const docRef = await addDoc(collection(db, "invites"), {
      spaceId,
      inviterId,
      inviteeEmail,
      status: "pending",
      inviteToken,
      createdAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id, inviteToken } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function getInviteByToken(token: string) {
  if (!db) {
    return unavailable();
  }

  try {
    const q = query(collection(db, "invites"), where("inviteToken", "==", token));
    const snap = await getDocs(q);
    if (snap.empty) return { success: false, error: "Invite not found" } as const;
    const doc = snap.docs[0];
    return { success: true, data: { id: doc.id, ...doc.data() } } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function acceptInvite(inviteId: string, userId: string) {
  if (!db) {
    return unavailable();
  }

  try {
    await updateDoc(doc(db, "invites", inviteId), {
      status: "accepted",
      acceptedBy: userId,
      acceptedAt: Timestamp.now(),
    });
    return { success: true } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function getLetterState(spaceId: string, userId: string) {
  if (!db) {
    return unavailable();
  }

  try {
    const snap = await getDoc(doc(db, "spaces", spaceId, "letterStates", userId));
    return { success: true, data: snap.exists() ? snap.data() : null } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function saveLetterState(spaceId: string, userId: string, state: Record<string, unknown>) {
  if (!db) {
    return unavailable();
  }

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
