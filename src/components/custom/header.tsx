import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./userMenu";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
    await checkUser();
    return (
        <header className="fixed h-16 border-b z-10 w-full bg-black/50 backdrop-blur-md shadow-lg flex items-center">
            <nav className="container mx-auto px-5 md:px-0 flex justify-between items-center">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Scope Logo"
                        width={100}
                        height={60}
                    />
                </Link>

                <div className="flex items-center gap-3">
                    <Link href="/project/create/">
                        <Button
                            variant="ghost"
                            className="text-xs px-2 sm:h-9 sm:px-4 sm:py-2 sm:text-base rounded-3xl"
                        >
                            <PenBox />
                            <span>Create Project</span>
                        </Button>
                    </Link>
                    <SignedOut>
                        <SignInButton forceRedirectUrl="/onboarding/">
                            <Button
                                variant="landing"
                                className="text-xs sm:text-base"
                            >
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
    );
};

export default Header;
