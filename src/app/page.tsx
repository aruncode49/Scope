import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    Calendar,
    Layout,
    SquareArrowOutUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CompaniesCarousel from "@/components/custom/companiesCarousel";
import faqs from "@/constants/faqs.json";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// key features
const features = [
    {
        title: "Intuitive Kanban Boards",
        description:
            "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
        icon: Layout,
    },
    {
        title: "Powerful Sprint Planning",
        description:
            "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
        icon: Calendar,
    },
    {
        title: "Comprehensive Reporting",
        description:
            "Gain insights into your team's performance with detailed, customizable reports and analytics.",
        icon: BarChart,
    },
];

export default function Home() {
    return (
        <>
            <Hero />
            <Features />
            <CompaniesCarousel />
            <Faqs />
            <CTA />
        </>
    );
}

const Hero = () => {
    return (
        <section className="dotted-background flex items-center justify-center py-20">
            <div className="container mx-auto flex flex-col gap-7 justify-center items-center text-center">
                <h1 className="gradient-title text-center text-6xl sm:text-7xl lg:text-8xl font-bold md:font-extrabold gradient-title">
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

const Features = () => {
    return (
        <section id="features" className="py-20">
            <div className="container mx-auto">
                <h3 className="text-neutral-300 text-2xl sm:text-3xl font-bold mb-12 text-center">
                    Key Features
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-neutral-900">
                            <CardContent className="pt-6">
                                <feature.icon className="h-10 w-10 mb-4 text-neutral-300" />
                                <h4 className="text-xl font-semibold mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-300">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Faqs = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto">
                <h3 className="text-neutral-300 text-2xl sm:text-3xl font-bold mb-12 text-center">
                    Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible>
                    {faqs.map((data, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-lg font-semibold text-neutral-200">
                                {data.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-neutral-400">
                                {data.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

const CTA = () => {
    return (
        <section className="mb-10">
            <div className="container bg-neutral-900 py-20 rounded-xl mx-auto flex flex-col items-center gap-8 px-5 text-center">
                <h3 className="text-neutral-300 text-2xl sm:text-3xl font-bold">
                    Ready to Transform Your Workflow?
                </h3>
                <p className="text-neutral-300">
                    Join thousands of teams already using Scope to streamline
                    their projects and boost productivity.
                </p>
                <Link href="/onboarding/">
                    <Button variant="landing">
                        <span>Start for Free</span>
                        <SquareArrowOutUpRight />
                    </Button>
                </Link>
            </div>
        </section>
    );
};
