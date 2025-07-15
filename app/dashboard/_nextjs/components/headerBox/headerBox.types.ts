type LoggedInUser = {
	firstName: string;
}
export type HeaderBoxProps = {
	type: string;
	title: string;
	loggedInUser: LoggedInUser;
	subtext: string;
}
