import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { UserAccountNav } from "./UserAccountNav";
import { buttonVariants } from "./ui/button";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed top-0 inset-x-0 h-fit border-b bg-white border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex gap-2 items-center">
          <Image alt="recipe" src="/cook-book.svg" width={50} height={50} />
          {/* <Icons.favicon className="h-8 w-8 sm:w-6 sm:h-6 justify-center items-center" /> */}
          <p className="hidden text-sm font-medium md:block">RecipeApp</p>
        </Link>
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
