import { IUser } from "@/lib/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IUserAvatar {
    user?: IUser;
}

const UserAvatar = ({ user }: IUserAvatar) => {
    return (
        <div className="flex items-center space-x-2 w-full">
            <Avatar className="h-6 w-6">
                <AvatarImage src={user?.imageUrl} alt={user?.name} />
                <AvatarFallback className="capitalize text-neutral-500">
                    {user && user.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-700">
                {user ? user.name : "Unassigned"}
            </span>
        </div>
    );
};

export default UserAvatar;
