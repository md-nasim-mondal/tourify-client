import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className='flex min-h-svh w-full flex-col items-center justify-center p-6'>
      <h1 className='text-6xl font-bold text-gray-800 dark:text-gray-200'>
        404
      </h1>
      <p className='mt-4 text-xl text-gray-600 dark:text-gray-400'>
        Page Not Found
      </p>
      <p className='mt-2 text-gray-500 dark:text-gray-500'>
        The page you are looking for does not exist.
      </p>
      <Button asChild className='mt-6'>
        <Link href='/'>Go back home</Link>
      </Button>
    </div>
  );
}
