import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className='flex justify-center items-center w-full p-6 max-w-6xl'>
      <button
        className='absolute left-4 bg-white rounded-lg p-1 border'
        onClick={() => router.push("/")}>
        Home
      </button>
      <h1>Dry Utility Project Tracker</h1>
      <div></div>
    </div>
  );
}
