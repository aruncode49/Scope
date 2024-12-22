import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

/**
 * Checks if user exist in db then return that user else set user in db.
 * @returns Current Logged In User
 */
export const checkUser = async () => {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });

        if (loggedInUser) {
            return loggedInUser;
        }

        // set user in db
        const fullName = `${user.firstName} ${user.lastName}`;
        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: fullName,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
            },
        });

        return newUser;
    } catch (error) {
        console.error(error);
    }
};
