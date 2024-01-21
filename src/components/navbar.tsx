import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  return (
    <div className='flex justify-center items-center w-full relative  max-w-4xl p-4'>
      <Link
        href='/'
        className='absolute left-5 transition-transform transform hover:scale-110 hover:bg-gray-100 rounded-lg p-1 flex items-center text-center text-firstcolor font-extrabold'>
        Home
      </Link>
      <h1 className='text-2xl font-bold'>Dry Utility Project Tracker</h1>
      <div className='flex gap-2 absolute right-5'>
        {status === "unauthenticated" && (
          <>
            <Link
              href='/api/auth/signin'
              className='transition-transform transform hover:scale-105 hover:bg-gray-100 rounded-lg p-1 h-full flex items-center text-center font-extrabold'>
              Sign In
            </Link>
            <Link
              href='/signup'
              className='transition-transform transform hover:scale-105 hover:bg-gray-100 rounded-lg p-1 h-full flex items-center text-center font-extrabold'>
              Sign Up
            </Link>
          </>
        )}
        {status === "authenticated" && (
          <>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className='transition-transform transform hover:scale-105 hover:bg-gray-100 rounded-lg p-1 h-full flex items-center text-center font-extrabold'>
              Signout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
