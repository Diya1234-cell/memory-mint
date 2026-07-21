export const createSpace = async (
    spaceName: string,
    userId: string,
    relationshipType: string
) => {
    try {
        const docRef = await addDoc(collection(db, "spaces"), {
            spaceName,
            relationshipType,
            createdBy: userId,
            members: [userId],
            inviteToken: crypto.randomUUID(),
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