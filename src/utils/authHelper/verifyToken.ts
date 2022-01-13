import { getAuth, signInWithCustomToken } from "firebase/auth";

export const verifyToken = async (token: string) => {
	const auth = getAuth();
	token = token.substring(7);
	const userCredential = await signInWithCustomToken(auth, token);
	return userCredential.user.uid;
};
