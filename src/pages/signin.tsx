import {
	getProviders,
	signIn,
	getSession,
	getCsrfToken,
} from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function Signin({ providers }: any) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const response = await signIn('credentials', {
			email: email,
			password: password,
			redirect: false,
		});

		if (response?.error) {
			if (response.error == 'User not found') {
				toast('User Not Found');
			}
			if (response.error == 'Invalid password') {
				toast('Invalid Password');
			}
		} else {
			router.push('/');
		}
	};

	return (
		<div>
			{Object.values(providers).map((provider, index) => {
				return (
					<div
						className='flex flex-col h-screen bg-firstcolor'
						key={index}
					>
						<div className='grid place-items-center mx-2 my-20 sm:my-auto'>
							<div
								className='w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
            px-6 py-10 sm:px-10 sm:py-6 
            bg-white rounded-lg shadow-md lg:shadow-lg'
							>
								<h2 className='text-center font-semibold text-3xl lg:text-4xl text-gray-800'>
									Sign In
								</h2>
								<div className='text-center pt-2 text-xs'>
									<div>
										<span className='font-bold'>
											Guest Email:
										</span>{' '}
										test@email.com
									</div>
									<div>
										<span className='font-bold'>
											Guest Password:
										</span>{' '}
										Password123!
									</div>
								</div>

								<form
									className='mt-10'
									onSubmit={handleSubmit}
								>
									<label className='block text-xs font-semibold text-gray-600 uppercase'>
										E-mail
									</label>
									<input
										id='email'
										type='email'
										name='email'
										placeholder='e-mail address'
										autoComplete='email'
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className='block w-full py-3 px-1 mt-2 
                    text-gray-800 appearance-none 
                    border-b-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200'
										required
									/>

									<label className='block mt-2 text-xs font-semibold text-gray-600 uppercase'>
										Password
									</label>
									<input
										id='password'
										type='password'
										name='password'
										placeholder='password'
										autoComplete='current-password'
										onChange={(e) =>
											setPassword(e.target.value)
										}
										className='block w-full py-3 px-1 mt-2 mb-4
                    text-gray-800 appearance-none 
                    border-b-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200'
										required
									/>

									<button
										type='submit'
										className='w-full py-3 mt-10 bg-black rounded-sm
                    font-medium text-white uppercase
                      '
									>
										Sign-In
									</button>

									<div className='sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center items-center justify-center'>
										<p className='mx-2 flex-2'>
											Need to make an account?{' '}
										</p>
										<Link
											href='/signup'
											className='flex-2 underline'
										>
											Register
										</Link>
									</div>
								</form>
							</div>
						</div>
					</div>
				);
			})}
			<Toaster />
		</div>
	);
}

export default Signin;

export async function getServerSideProps(context: any) {
	const { req } = context;
	const session = await getSession({ req });

	if (session) {
		return {
			redirect: { destination: '/' },
		};
	}

	return {
		props: {
			providers: await getProviders(),
			csrfToken: await getCsrfToken(context),
		},
	};
}
