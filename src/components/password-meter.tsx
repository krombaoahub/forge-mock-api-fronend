import type { PasswordMeterInterface } from "@/interfaces";
import type React from "react";

export const PasswordMeter: React.FC<PasswordMeterInterface> = ({ targetElement }) => {
    return (
        <div id={`${targetElement}-content`} className="card absolute z-10 w-full hidden p-4 shadow-lg">
            <div data-strong-password={`{
            "target": "#${targetElement}",
            "hints": "#${targetElement}-content",
            "minLength": "8",
            "stripClasses": "strong-password:bg-primary strong-password-accepted:bg-teal-500 h-1.5 flex-auto bg-neutral/20",
            "mode": "popover"
          }`} className="rounded-full overflow-hidden mt-2.5 flex gap-0.5">
            </div>
            <h6 className="text-base text-base-content my-2 font-semibold">Your password must contain:</h6>
            <ul className="text-base-content/80 space-y-1 text-sm">
                <li data-pw-strength-rule="min-length"
                    className="strong-password-active:text-success flex items-center gap-x-2">
                    <span className="icon-[tabler--circle-check] hidden size-5 shrink-0" data-check></span>
                    <span className="icon-[tabler--circle-x] hidden size-5 shrink-0" data-uncheck></span>
                    Minimum number of characters is 8.
                </li>
                <li data-pw-strength-rule="lowercase" className="strong-password-active:text-success flex items-center gap-x-2">
                    <span className="icon-[tabler--circle-check] hidden size-5 shrink-0" data-check></span>
                    <span className="icon-[tabler--circle-x] hidden size-5 shrink-0" data-uncheck></span>
                    Should contain lowercase.
                </li>
                <li data-pw-strength-rule="uppercase" className="strong-password-active:text-success flex items-center gap-x-2">
                    <span className="icon-[tabler--circle-check] hidden size-5 shrink-0" data-check></span>
                    <span className="icon-[tabler--circle-x] hidden size-5 shrink-0" data-uncheck></span>
                    Should contain uppercase.
                </li>
                <li data-pw-strength-rule="numbers" className="strong-password-active:text-success flex items-center gap-x-2">
                    <span className="icon-[tabler--circle-check] hidden size-5 shrink-0" data-check></span>
                    <span className="icon-[tabler--circle-x] hidden size-5 shrink-0" data-uncheck></span>
                    Should contain numbers.
                </li>
                <li data-pw-strength-rule="special-characters"
                    className="strong-password-active:text-success flex items-center gap-x-2">
                    <span className="icon-[tabler--circle-check] hidden size-5 shrink-0" data-check></span>
                    <span className="icon-[tabler--circle-x] hidden size-5 shrink-0" data-uncheck></span>
                    Should contain special characters.
                </li>
            </ul>
        </div>
    )
}