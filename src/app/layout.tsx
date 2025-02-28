import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import Header from "@/components/custom/header";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "Scope",
    description: "A full stack next js based project management website.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html data-color-mode="light" lang="en" suppressHydrationWarning>
                <body
                    className={`${poppins.className} antialiased flex flex-col min-h-screen`}
                >
                    <Toaster richColors />
                    <Header />
                    <main className="flex-1 mt-16 px-3 md:px-0">
                        {children}
                    </main>
                    <footer className="py-6 px-3 text-center text-xs border-t border-gray-300 text-neutral-800">
                        © Copyright {new Date().getFullYear()} - Developed by
                        Arun Kumar. All right reserved.
                    </footer>
                </body>
            </html>
        </ClerkProvider>
    );
}
