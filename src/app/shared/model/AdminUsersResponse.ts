export interface AdminUsersResponse {
	res: UserList[];
}

export interface UserList {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		teamCount: number
}