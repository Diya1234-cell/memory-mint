import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const FIREBASE_UNAVAILABLE_MESSAGE = 'Firebase is not configured in this environment.'

export const createSpace = async (
  spaceName: string,
  userId: string,
  relationshipType: string,
  details: Record<string, unknown> = {}
) => {
  if (!db) {
    return {
      success: false,
      error: { message: FIREBASE_UNAVAILABLE_MESSAGE },
    }
  }

  try {
    const docRef = await addDoc(collection(db, 'spaces'), {
      spaceName,
      relationshipType,
      createdBy: userId,
      members: [userId],
      inviteToken: crypto.randomUUID(),
      createdAt: Timestamp.now(),
      ...details,
    })

    return {
      success: true,
      id: docRef.id,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create space.'
    console.error(message)

    return {
      success: false,
      error: { message },
    }
  }
}
