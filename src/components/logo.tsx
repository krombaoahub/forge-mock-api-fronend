import type { AppLogoInterface } from "@/interfaces";
import { cn } from "@/libs/utils";
import { CodeXml } from "lucide-react";
import { Link } from "react-router-dom";

export default function AppLogo({ className, logoOnly, logoSize }: AppLogoInterface) {
    return (<Link to="/" className={cn('flex gap-2 items-center', className)}>
        <div className="rounded-md size-10 items-center flex justify-center btn btn-primary p-0">
            <CodeXml size={logoSize || 25} />
        </div>
        {!logoOnly && <h1 className='font-bold text-xl link link-animated hover:text-base-content'>ForgeMockAPI</h1>}
    </Link>)
}