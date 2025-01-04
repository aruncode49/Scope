"use client";

import { sprintSchema, TSprintFormData } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, PlusCircleIcon, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { addDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useFetch } from "@/hooks/useFetch";
import { createSprint } from "@/actions/sprints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ISprintForm {
    projectTitle: string;
    projectId: string;
    projectKey: string;
    sprintKey: number;
}

const SprintForm = ({
    projectTitle,
    projectId,
    projectKey,
    sprintKey,
}: ISprintForm) => {
    // hooks
    const { loading, makeRequest } = useFetch({
        cb: createSprint,
    });
    const router = useRouter();

    // states
    const [isFormVisible, setFormVisible] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: addDays(new Date(), 14),
    });

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm<TSprintFormData>({
        resolver: zodResolver(sprintSchema),
        defaultValues: {
            name: `${projectKey}-${sprintKey}`,
            startDate: dateRange.from,
            endDate: dateRange.to,
        },
    });

    const onSubmit = async (data: TSprintFormData) => {
        const isSuccess = await makeRequest(projectId, {
            ...data,
            startDate: dateRange.from,
            endDate: dateRange.to,
        });
        setFormVisible(false);
        if (isSuccess) {
            toast.success("Sprint created successfully!");
            router.refresh();
        }
    };

    return (
        <>
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <h1 className="sm:text-xl font-medium text-gray-800">
                    {projectTitle}
                </h1>
                {!isFormVisible && (
                    <Button
                        onClick={() => setFormVisible(true)}
                        variant="amber"
                        size="sm"
                    >
                        <PlusCircleIcon />
                        Sprint
                    </Button>
                )}
            </div>

            {/* Sprint Details Section */}
            {isFormVisible && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 bg-white p-4 rounded-lg mt-4 shadow-sm border"
                >
                    <div className="space-y-2">
                        <div className="relative">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Sprint Name
                            </label>
                            <Button
                                className="p-1 w-6 h-6 absolute right-0 bottom-0"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFormVisible(false)}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                        <Input
                            id="name"
                            readOnly
                            className=" text-gray-600 text-xs"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-xs mt-1 ml-1 text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Sprint Duration
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs p-2 bg-white rounded-lg shadow">
                                {`${format(
                                    dateRange.from,
                                    "LLL dd, yyyy"
                                )} - ${format(dateRange.to, "LLL dd, yyyy")}`}
                            </span>
                            <Controller
                                control={control}
                                name="startDate"
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger className="flex items-center gap-2 bg-white p-2 rounded-md border hover:bg-gray-100 cursor-pointer">
                                            <CalendarIcon size={15} />
                                        </PopoverTrigger>
                                        <PopoverContent
                                            align="start"
                                            className="bg-white p-4 shadow-lg border rounded-lg text-sm mx-5 mt-2"
                                        >
                                            <DayPicker
                                                mode="range"
                                                selected={dateRange}
                                                disabled={[
                                                    { before: new Date() },
                                                ]}
                                                onSelect={(range) => {
                                                    if (
                                                        range?.from &&
                                                        range?.to
                                                    ) {
                                                        setDateRange({
                                                            from: range.from,
                                                            to: range.to,
                                                        });
                                                        field.onChange(
                                                            range.from
                                                        );
                                                    }
                                                }}
                                                classNames={{
                                                    chevron:
                                                        "fill-blue-400 size-4",
                                                    month_caption:
                                                        "font-semibold flex item-center",
                                                    button_next:
                                                        "p-1 flex -mt-6",
                                                    button_previous:
                                                        "p-1 flex -mt-6",
                                                    day: "w-3 h-3 text-sm text-center",
                                                    weekday:
                                                        "w-3 h-10 text-sm font-medium",
                                                    day_button: "p-1",
                                                    selected:
                                                        "text-sm font-semibold",
                                                    range_start:
                                                        "font-semibold bg-blue-400 rounded-md text-white",
                                                    range_end:
                                                        "font-semibold bg-blue-400 rounded-md text-white",
                                                    today: "",
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        </div>
                    </div>

                    {/* Create button */}
                    <Button
                        variant="amber"
                        size="sm"
                        className="w-full sm:w-auto"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Create Sprint"
                        )}
                    </Button>
                </form>
            )}
        </>
    );
};

export default SprintForm;
