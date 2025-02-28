import { useState } from "react";
import { toast } from "sonner";

interface IUseFetch<TArgs extends unknown[], TResponse> {
    cb: (...args: TArgs) => Promise<TResponse>;
}

export const useFetch = <TArgs extends unknown[], TResponse>({
    cb,
}: IUseFetch<TArgs, TResponse>) => {
    const [data, setData] = useState<TResponse | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const makeRequest = async (...args: TArgs) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args); // Spread the arguments into the callback
            setData(response);
            setError(null);
            return true;
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message ?? "An error occurred");
                toast.error(err.message);
            } else {
                setError(err as string);
                toast.error("An error occurred");
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, makeRequest, setData };
};
