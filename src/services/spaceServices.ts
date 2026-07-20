import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const createSpace = async (
    spaceName: string,
    userId: string
) => {
    try {
        const docRef = await addDoc(collection(db, "spaces"), {
            spaceName,
            createdBy: userId,
            members: [userId],
            createdAt: Timestamp.now(),
        });

        return {
            success: true,
            id: docRef.id,
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            error,
        };
    }
};