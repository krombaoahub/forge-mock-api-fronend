import { fakerOptions } from "@/contants/faker-options";
import type { CollectionSchemeInterface } from "@/interfaces";
import type { CollectionFieldNameSelectType } from "@/types";
import type React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

const FakerSelectOptions: React.FC<{
    schemeField: CollectionSchemeInterface,
    keyId: CollectionFieldNameSelectType,
    register: UseFormRegister<any>,
    errors?: FieldErrors<any>
}> = ({ schemeField, errors, register, keyId }) => {
    const hasError = (errors && keyId) ? errors[keyId] : false
    return (
        <>
            <div className="w-full">
                <select
                    defaultValue={schemeField.type}
                    {...register(keyId)}
                    data-select='{
                                    "placeholder": "Field Type",
                                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                                    "toggleClasses": "capitalize advance-select-toggle select-disabled:pointer-events-none select-disabled:opacity-40",
                                    "hasSearch": true,
                                    "dropdownClasses": "capitalize advance-select-menu max-h-52 pt-0 overflow-y-auto",
                                    "optionClasses": "capitalize advance-select-option selected:select-active",
                                    "optionTemplate": "<div className=\"capitalize flex justify-between items-center w-full\"><span data-title></span><span className=\"icon-[tabler--check] shrink-0 size-4 text-primary hidden selected:block \"></span></div>",
                                    "extraMarkup": "<span className=\"capitalize icon-[tabler--caret-up-down] shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
                                }'
                    className="hidden"
                >
                    <option key={0} value=''></option>
                    {
                        (fakerOptions).map((item: any, iKey: any) => {
                            return (
                                <option key={iKey} value={`${item.group}.${item.type}`}>{`${item.group}.${item.type}`}</option>
                            )
                        })
                    }
                </select>
                {hasError && <div className="text-sm mt-2 text-red-400 text-left"><>{hasError.message}</></div>}
            </div>
        </>
    )
}

export default FakerSelectOptions;