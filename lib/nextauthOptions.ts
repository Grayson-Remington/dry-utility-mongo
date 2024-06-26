import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import clientPromise from './mongodb';
import { AuthOptions } from 'next-auth';

export const nextauthOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			id: 'credentials',
			credentials: {
				email: {
					label: 'E-mail',
					type: 'text',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},
			async authorize(credentials, req) {
				const client = await clientPromise;
				const usersCollection = client.db('dryUdb').collection('users');
				const email = credentials?.email;
				const user = await usersCollection.findOne({ email });
				if (!user) {
					throw new Error('User not found');
				}
				console.log(credentials?.password);

				const passwordIsValid = await bcrypt.compare(
					credentials?.password!,
					user.password
				);

				if (!passwordIsValid) {
					throw new Error('Invalid password');
				}

				return {
					id: user._id.toString(),
					...user,
				};
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,

	pages: {
		signIn: '/signin',
	},
	session: {
		strategy: 'jwt',
	},
};
