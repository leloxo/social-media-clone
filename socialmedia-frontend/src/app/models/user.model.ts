import { Post } from "./post.model";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    profileImageUrl?: string;
    biography?: string;
    createdAt: Date;
    updatedAt: Date;
    // followers: User[];
    // following: User[];
    // posts: Post[];
    // comments: Comment[];
}
  