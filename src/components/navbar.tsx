import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Avatar } from "@mui/material";
export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  return (
    <div className='flex flex-col justify-center items-center w-full relative  max-w-4xl p-4'>
      <h1 className='text-2xl text-center font-bold'>
        Dry Utility Project Tracker
      </h1>
      <div className='flex gap-4 pt-4'>
        <Link
          href='/'
          className=' transition-transform transform hover:scale-110 hover:bg-gray-100 rounded-lg p-1 flex items-center text-center text-firstcolor font-extrabold'>
          Home
        </Link>
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
            <Avatar
              className=' text-sm h-8 w-8 mr-1 items-center justify-center flex'
              {...stringAvatar(`${session?.user?.name}`)}
            />

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className='transition-transform transform hover:scale-105 hover:bg-gray-100 rounded-lg h-full flex items-center self-center text-center font-extrabold'>
              Signout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
