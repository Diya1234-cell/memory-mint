import { Timestamp } from "firebase/firestore";

export interface Space {
    id?: string;
    spaceName: string;
    createdBy: string;
    members: string[];
    createdAt: Timestamp;
}