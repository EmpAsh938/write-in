import { UserState } from "./authTypes";

export type ReplyType = {
	_id: string;
	comment: string;
	body: string;
	author: UserState;
	likes: [string];
	root: string;
	updatedAt: string;
	createdAt: string;
}
export type CommentType = {
	_id: string;
	post: string;
	body: string;
	author: UserState;
	likes: [string];
	reply: Array<ReplyType|string>;
	updatedAt: string;
	createdAt: string;
}