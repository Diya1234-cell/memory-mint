import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export async function uploadImage(file: File, spaceId: string) {
  try {
    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const storageRef = ref(storage, `spaces/${spaceId}/images/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadUrl, path: snapshot.ref.fullPath } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function uploadVideo(file: File, spaceId: string) {
  try {
    const ext = file.name.split(".").pop() ?? "mp4";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const storageRef = ref(storage, `spaces/${spaceId}/videos/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadUrl, path: snapshot.ref.fullPath } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}

export async function deleteFile(filePath: string) {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    return { success: true } as const;
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
}
