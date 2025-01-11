"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * getOrganizations ->
 * Step:1 => Check if the user is unauthorized or not
 * Step:2 => Check if the user is present in db or not (user not found)
 * Step:3 => Get organization from "Clerk Client"
 * Step:4 => Check membership of the user for that organization
 * @param slug
 * @returns Organizations Data
 */
export const getOrganization = async (slug: string) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // check user is db
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if (!user) {
        throw new Error("User not found!");
    }

    // get organization
    const organization = (await clerkClient()).organizations.getOrganization({
        slug,
    });

    if (!organization) {
        return null;
    }

    // check membership for the current organization
    const userMembership = (await clerkClient()).organizations
        .getOrganizationMembershipList({
            organizationId: (await organization).id,
        })
        .then((memberShip) => {
            return memberShip.data.find(
                (member) => member.publicUserData?.userId === userId
            );
        });

    // if user is not a member of that organization then return null
    if (!userMembership) {
        return null;
    }

    return organization;
};

export const getOrganizationMembers = async (orgId: string) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // check user is db
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if (!user) {
        throw new Error("User not found!");
    }

    const userMembership = (
        await clerkClient()
    ).organizations.getOrganizationMembershipList({
        organizationId: orgId,
    });

    const userIds = (await userMembership).data.map(
        (membership) => membership.publicUserData?.userId
    );

    const members = await db.user.findMany({
        where: {
            clerkUserId: {
                in: userIds as string[],
            },
        },
    });

    return members;
};
