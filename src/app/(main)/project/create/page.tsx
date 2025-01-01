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

const CreateProject = () => {
    // hooks
    const { isLoaded: isOrgLoaded, membership } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();

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
    const onSubmit = async () => {
        console.log("Form Submit");
    };

    // effect
    useEffect(() => {
        if (isOrgLoaded && isUserLoaded && membership) {
            setAdmin(membership.role === "org:admin");
        }
    }, [isUserLoaded, isOrgLoaded, membership]);

    // early return
    if (!isOrgLoaded || !isUserLoaded) {
        return null;
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col gap-3 justify-center items-center mt-40">
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
                        <p className="text-xs mt-1 ml-1 text-red-400">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div>
                    <Input
                        id="key"
                        placeholder="Project key (eg: AKPY)"
                        {...register("key")}
                    />
                    {errors.key && (
                        <p className="text-xs mt-1 ml-1 text-red-400">
                            {errors.key.message}
                        </p>
                    )}
                </div>
                <div>
                    <Textarea
                        id="description"
                        placeholder="Project description (optional)"
                        className="h-32"
                        {...register("key")}
                    />
                    {errors.description && (
                        <p className="text-xs mt-1 ml-1 text-red-400">
                            {errors.description.message}
                        </p>
                    )}
                </div>
                <Button
                    type="submit"
                    variant="amber"
                    className="text-white w-full"
                >
                    Create Project
                </Button>
            </form>
        </div>
    );
};

export default CreateProject;
