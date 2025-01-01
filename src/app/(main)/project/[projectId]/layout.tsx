import SuspenseLoader from "@/components/custom/suspenseLoader";
import { Suspense } from "react";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
    return <Suspense fallback={<SuspenseLoader />}>{children}</Suspense>;
};

export default ProjectLayout;
