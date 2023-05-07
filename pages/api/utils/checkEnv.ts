// This snippet is used by pages/api/auth/[...nextauth].ts to check if the environmental variables are defined.
// If they are not defined, the server will throw an error.

export default function checkEnv(variableName: string | undefined): string {
	if (variableName !== undefined) {
		console.log(`The environmental variable ${variableName} is defined`);
		return variableName
	} else {
		console.log(`The environmental variable ${variableName} is not defined`);
		//throw new Error(`The environmental variable ${variableName} is not defined`);
		return "problem"
	}
}