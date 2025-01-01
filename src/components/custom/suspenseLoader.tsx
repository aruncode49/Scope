import { Loader2 } from "lucide-react";

const SuspenseLoader = () => {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin size-8 text-amber-600" />
        </div>
    );
};

export default SuspenseLoader;
