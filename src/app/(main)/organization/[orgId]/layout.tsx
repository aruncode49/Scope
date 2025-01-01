import SuspenseLoader from "@/components/custom/suspenseLoader";
import { Suspense } from "react";

const OrgLayout = ({ children }: { children: React.ReactNode }) => {
    return <Suspense fallback={<SuspenseLoader />}>{children}</Suspense>;
};

export default OrgLayout;
