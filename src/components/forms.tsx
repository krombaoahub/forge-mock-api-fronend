import type { FormInputInterface, FormInterface } from "@/interfaces";
import { cn } from "@/libs/utils";
import React from "react";
import { PasswordMeter } from "./password-meter";
import uuid from "react-uuid";
import type { FieldError } from "react-hook-form";

export const FormField: React.FC<FormInterface> = ({ handleSubmit, inputs, className, children, ...props }) => {
    return (
        <form onSubmit={handleSubmit} {...props} className={cn(`flex flex-col gap-6`, className)} >
            {inputs.map((input: FormInputInterface, key: number) => <FormInput key={key} {...input} />)}
            {children}
        </form>
    )
}

export const FormInput: React.FC<FormInputInterface> = ({ passwordMeter = false, className = '', register, errors, keyId = 'id-' + uuid().toString(), type = 'text', placeholder, label, field }) => {
    if (!field) { return <></> }

    const fieldError = errors?.[field] as FieldError | undefined;

    return (
        <div className="input-floating">
            <input type={type} placeholder={placeholder} id={keyId}
                {...register(field)}
                className={cn(`input`, className)} />
            <label htmlFor={keyId} className="input-floating-label" >{label}</label>
            {fieldError && fieldError.message && (
                <div className="text-sm mt-2 text-red-400 text-left">
                    {fieldError.message}
                </div>
            )}

            {(passwordMeter && type === 'password') && <PasswordMeter targetElement={keyId} />}
        </div>
    )
}