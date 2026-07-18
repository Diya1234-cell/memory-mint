import type { MemoryType, RelationshipType, MemberRole } from "@/types/enums";

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  lastActiveAt?: string;
}

export interface Member {
  id: string;
  userId: string;
  displayName: string;
  role: MemberRole;
  joinedAt: string;
  avatarUrl?: string;
}

export interface RelationshipSpace {
  id: string;
  name: string;
  description?: string;
  type: RelationshipType;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Memory {
  id: string;
  spaceId: string;
  ownerId: string;
  type: MemoryType;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  mediaUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface Invite {
  id: string;
  spaceId: string;
  inviterId: string;
  inviteeEmail: string;
  role: MemberRole;
  expiresAt?: string;
  createdAt: string;
  acceptedAt?: string;
  status: "pending" | "accepted" | "revoked";
}
