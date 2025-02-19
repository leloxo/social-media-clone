import { User } from "./user.model";

export interface Post {
    id: number;
    imageUrl: string;
    createdAt: Date;
    author: User;
    // comments: Comment[];

    likeCount: number;
    commentCount: number;
}
  