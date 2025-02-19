import { Post } from "./post.model";
import { User } from "./user.model";

export interface Comment {
    id: number;
    content: string;
    createdAt: Date;
    author: User;
    post: Post;
}
  