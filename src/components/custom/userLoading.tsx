"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useRef, useEffect } from "react";

const UserLoading = () => {
    const { isLoaded: isOrgLoaded } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const ref = useRef<LoadingBarRef>(null);

    useEffect(() => {
        if (!isOrgLoaded || !isUserLoaded) {
            ref.current?.continuousStart(); // Start the loading bar
        } else {
            ref.current?.complete(); // Complete the loading bar
        }
    }, [isOrgLoaded, isUserLoaded]);

    return <LoadingBar color="#d97706" ref={ref} shadow={true} />;
};

export default UserLoading;
