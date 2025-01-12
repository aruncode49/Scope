"use client";

import OrgSwitcher from "@/components/custom/orgSwitcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, TProjectFormData } from "@/lib/zodSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { createProject } from "@/actions/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const CreateProject = () => {
    // hooks
    const { isLoaded: isOrgLoaded, membership } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const {
        data: resData,
        loading,
        makeRequest,
    } = useFetch({
        cb: createProject,
    });
    const router = useRouter();

    // state
    const [isAdmin, setAdmin] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TProjectFormData>({
        resolver: zodResolver(projectSchema),
    });

    // actions
    const onSubmit = async (data: TProjectFormData) => {
        await makeRequest(data);
    };

    // effect
    useEffect(() => {
        if (isOrgLoaded && isUserLoaded && membership) {
            setAdmin(membership.role === "org:admin");
        }
    }, [isUserLoaded, isOrgLoaded, membership]);

    useEffect(() => {
        if (resData) {
            toast.success("Project created successfully!");
            router.push(`/project/${resData.id}`);
        }
    }, [loading]);

    // early return
    if (!isOrgLoaded || !isUserLoaded) {
        return null;
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col gap-3 justify-center items-center py-20">
                <span className="text-center text-neutral-700 text-sm">
                    Oops! Only Admins can create projects.
                </span>
                <OrgSwitcher />
            </div>
        );
    }

    return (
        <div className="mt-7">
            <h1 className="text-center text-xl font-semibold">
                Create New Project
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 space-y-4 sm:max-w-[30rem] sm:mx-auto mb-10"
            >
                <div>
                    <Input
                        id="name"
                        placeholder="Project name"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-xs mt-1 ml-1 text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div>
                    <Input
                        id="key"
                        placeholder="Project key (eg: SCPY)"
                        {...register("key")}
                    />
                    {errors.key && (
                        <p className="text-xs mt-1 ml-1 text-red-600">
                            {errors.key.message}
                        </p>
                    )}
                </div>
                <div>
                    <Textarea
                        id="description"
                        placeholder="Project description (optional)"
                        className="h-32"
                        {...register("description")}
                    />
                    {errors.description && (
                        <p className="text-xs mt-1 ml-1 text-red-600">
                            {errors.description.message}
                        </p>
                    )}
                </div>
                <Button
                    disabled={loading}
                    type="submit"
                    variant="amber"
                    className="text-white w-full"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Create Project"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default CreateProject;
