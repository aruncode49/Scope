import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import UserMenu from "./userMenu";
import { checkUser } from "@/lib/checkUser";
import UserLoading from "./userLoading";

const Header = async () => {
    await checkUser();
    return (
        <>
            <UserLoading />
            <header className="fixed h-16 bg-[#f6f5f2]/60 border-b border-gray-300 z-10 w-full backdrop-blur-2xl flex items-center">
                <nav className="container mx-auto px-2 md:px-0 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-x-1">
                        <Image
                            src="/logo.png"
                            width={25}
                            height={50}
                            alt="logo"
                        />
                        <h1 className="font-bold text-gray-900 text-[1.3rem] tracking-tight">
                            SCOPE
                        </h1>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link href="/project/create/">
                            <Button>
                                <span>Create Project</span>
                            </Button>
                        </Link>
                        <SignedOut>
                            <SignInButton forceRedirectUrl="/onboarding/">
                                <Button variant="amber">
                                    <span>Sign In</span>
                                </Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserMenu />
                        </SignedIn>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;
