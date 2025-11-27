import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeDropdown from "./theme-dropdown";
import { useAppSelector } from "@/states/hooks";

interface UserAvatarInterface {
    displayInfo?: boolean
}

export function UserAvatar({ displayInfo }: UserAvatarInterface) {
    const currentUser = useAppSelector((state) => state.app.currentUser);
    // const { currentUser } = useAuthContext();
    const { email, displayName } = currentUser;
    return (
        <div className="flex gap-2 items-center">
            <div className="avatar avatar-placeholder">
                <div className={`w-10 rounded-full shadow-md ${!currentUser.photoURL ? 'border' : ''}`}>
                    {currentUser.photoURL
                        ? <img src={currentUser.photoURL} alt="avatar" />
                        : <span className="icon-[tabler--user] size-4"></span>
                    }
                </div>
            </div>

            {displayInfo && <div className="text-left ">
                <div className="text-base-content text-base font-semibold truncate w-40">{displayName}</div>
                <div className="text-base-content/50 text-sm font-normal truncate w-40">{email} {email}</div>
            </div>}
        </div>
    )
}
export function UserDropdownMenu({ mobile }: { mobile?: boolean }) {
    const loading = useAppSelector((state) => state.app.loading);
    const { handleLogout } = useAuthContext();
    const navigate = useNavigate();

    return (
        <div className="dropdown relative inline-flex">
            {mobile
                ? <div id="dropdown-avatar" className='link link-animated hover:text-base-content' aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">Profile</div>
                : <button id="dropdown-avatar" type="button" className="p-0 border-0 dropdown-toggle btn btn-outline btn-primary flex items-center gap-2 rounded-full" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                    <UserAvatar />
                </button>}
            <ul className="dropdown-menu dropdown-open:opacity-100 hidden min-w-60 max-w-65" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-avatar">
                <li className="dropdown-header gap-3">
                    <UserAvatar displayInfo />
                </li>
                <li>
                    <button onClick={() => handleLogout(navigate)} type="submit" className={`w-full btn btn-primary ${loading ? 'btn-disabled' : ''}`}>
                        {loading && <span className="loading loading-spinner"></span>}
                        Sign out
                    </button>
                </li>
                <li className="p-3">
                    <ThemeDropdown />
                </li>
            </ul>
        </div>
    )
}