"use client";

import { useOrganization } from "@clerk/nextjs";
import { Loader2, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFetch } from "@/hooks/useFetch";
import { deleteProject } from "@/actions/projects";
import { useEffect } from "react";
// import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface IDeleteProject {
    projectId: string;
}

const DeleteProject = ({ projectId }: IDeleteProject) => {
    // hooks
    const router = useRouter();
    const { membership } = useOrganization();
    const { data, loading, makeRequest } = useFetch({
        cb: deleteProject,
    });

    // ref

    // vars
    const isAdmin = membership?.role === "org:admin";

    // actions
    const onDeleteProject = async () => {
        await makeRequest(projectId);
    };

    // effect
    useEffect(() => {
        if (data?.success) {
            toast.success("Project deleted successfully!");
            router.refresh();
        }
    }, [data]);

    // early return
    if (!isAdmin) {
        return null; // only admin can delete projects
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span className="p-2 border border-neutral-400 rounded-md hover:bg-neutral-200 cursor-pointer">
                    {loading ? (
                        <Loader2
                            size={18}
                            className="text-red-600 animate-spin"
                        />
                    ) : (
                        <Trash2 size={18} className="text-red-600" />
                    )}
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your project and remove your data from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDeleteProject}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteProject;
