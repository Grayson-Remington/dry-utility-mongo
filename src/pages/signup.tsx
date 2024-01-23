// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useState } from 'react';

// export default function Home() {
// 	const [email, setEmail] = useState('');
// 	const [password, setPassword] = useState('');
// 	const router = useRouter();
// 	const handleSubmit = async (e: any) => {
// 		e.preventDefault();
// 		console.log(email);
// 		console.log(password);
// 		try {
// 			const response = await fetch('/api/create-user', {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify({ email, password }),
// 			});

// 			if (response.ok) {
// 				const data = await response.json();
// 				console.log(data); // Handle success
// 				router.push('/api/auth/signin');
// 			} else {
// 				console.error('Failed to sign up');
// 			}
// 		} catch (error) {
// 			console.error('An error occurred:', error);
// 		}
// 	};
// 	const isPasswordValid = (password: any) => {
// 		// Check if the password has at least 8 characters
// 		if (password.length < 8) {
// 			return false;
// 		}

// 		// Check if the password contains a special character
// 		if (!/[\W_]/.test(password)) {
// 			return false;
// 		}

// 		// Check if the password contains a number
// 		if (!/\d/.test(password)) {
// 			return false;
// 		}

// 		// Check if the password contains an uppercase letter
// 		if (!/[A-Z]/.test(password)) {
// 			return false;
// 		}

// 		// Check if the password contains a lowercase letter
// 		if (!/[a-z]/.test(password)) {
// 			return false;
// 		}

// 		// If all conditions are satisfied, the password is valid
// 		return true;
// 	};
// 	return (
// 		<div className='flex flex-col h-screen bg-firstcolor'>
// 			<div className='grid place-items-center mx-2 my-20 sm:my-auto'>
// 				<div
// 					className='w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12
//             px-6 py-10 sm:px-10 sm:py-6
//             bg-white rounded-lg shadow-md lg:shadow-lg'
// 				>
// 					<h2 className='text-center font-semibold text-3xl lg:text-4xl text-gray-800'>
// 						Sign up
// 					</h2>

// 					<form
// 						className='mt-10'
// 						onSubmit={handleSubmit}
// 					>
// 						<label className='block text-xs font-semibold text-gray-600 uppercase'>
// 							E-mail
// 						</label>
// 						<input
// 							id='email'
// 							type='email'
// 							name='email'
// 							placeholder='e-mail address'
// 							autoComplete='email'
// 							onChange={(e) => setEmail(e.target.value)}
// 							className='block w-full py-3 px-1 mt-2
//                     text-gray-800 appearance-none
//                     border-b-2 border-gray-100
//                     focus:text-gray-500 focus:outline-none focus:border-gray-200'
// 							required
// 						/>

// 						<label className='block mt-2 text-xs font-semibold text-gray-600 uppercase'>
// 							Password
// 						</label>
// 						<input
// 							id='password'
// 							type='password'
// 							name='password'
// 							placeholder='password'
// 							autoComplete='current-password'
// 							onChange={(e) => setPassword(e.target.value)}
// 							className='block w-full py-3 px-1 mt-2 mb-4
//                     text-gray-800 appearance-none
//                     border-b-2 border-gray-100
//                     focus:text-gray-500 focus:outline-none focus:border-gray-200'
// 							required
// 						/>
// 						{password && !isPasswordValid(password) && (
// 							<p className='text-red-500'>
// 								Password must have at least 8 characters,
// 								contain a special character, a number, and an
// 								uppercase and lowercase letter.
// 							</p>
// 						)}
// 						<button
// 							type='submit'
// 							className='w-full py-3 mt-10 bg-black rounded-sm
//                     font-medium text-white uppercase
//                       '
// 						>
// 							Register
// 						</button>

// 						<div className='sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center items-center justify-center'>
// 							<p className='mx-2 flex-2'>
// 								Already have an account?{' '}
// 							</p>
// 							<Link
// 								href='/signin'
// 								className='flex-2 underline'
// 							>
// 								Login
// 							</Link>
// 						</div>
// 					</form>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
