import Link from "next/link";
import { Button } from "../ui/button";
import { SquareArrowOutUpRight } from "lucide-react";

const Hero = () => {
    return (
        <section className="dotted-background">
            <div className="container mx-auto flex flex-col gap-7 justify-center items-center py-20 text-center">
                <h1 className="text-center text-6xl sm:text-7xl lg:text-8xl font-bold md:font-extrabold gradient-title">
                    Streamline Your Workflow <br />
                    <span className="flex justify-center">with Scope</span>
                </h1>
                <p className="text-xl text-gray-300">
                    Empower your team with our intuitive project management
                    solution.
                </p>
                <div className="flex items-center gap-3">
                    <Link href="/onboarding/">
                        <Button variant="landing">
                            <span>Get Started</span>
                            <SquareArrowOutUpRight />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button className="rounded-3xl" variant="outline">
                            <span>Learn More</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
