import type { InputFormInterface, CreateWorkspaceModalInterface, TInputTypes } from "@/interfaces";
import type { CreateWorkspaceInterface } from "@/interfaces/api";
import { getBySelector } from "@/libs/domUtils";
import { useAddWorkspaceMutation } from "@/services/api";
import { isApiError } from "@/types";
import { createWorkspaceFormSchema, type CreateWorkspaceFormFields } from "@/zod/schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from "react";
import { useForm, type FieldError } from "react-hook-form";

interface CreateWorkspaceForm extends InputFormInterface {
    field: keyof CreateWorkspaceFormFields
}

const inputFields = [{
    placeholder: 'Example: App, Project, Todo, etc...',
    field: 'name' as keyof CreateWorkspaceFormFields,
    type: 'text' as TInputTypes,
    label: 'Name'
}]


const CreateWorkspaceModal: React.FC<CreateWorkspaceModalInterface> = ({ children, refId, refetch }) => {
    const [addWorkspace, { isLoading, error, isError }] = useAddWorkspaceMutation()
    const query = getBySelector(`#${refId}`, document)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateWorkspaceFormFields>({
        resolver: zodResolver(createWorkspaceFormSchema),
    });

    useEffect(() => {
        return () => reset(); // cleanup on unmount
    }, [query, reset]);

    const onCreateWorkspace = async (data: CreateWorkspaceInterface) => {
        try {

            const closeButton = getBySelector('#create-workspace button[aria-label="Close"]') as HTMLButtonElement
            await addWorkspace({
                ...data
            }).unwrap().then(() => {
                console.log('Workspace created successfully');
                refetch()
                if (closeButton) closeButton.click()
                reset()
            })

        } catch (err) {
            console.error('Failed to save the workspace:', err);
        }
    }

    return (
        <div>
            <div aria-haspopup="dialog" aria-expanded="false" data-overlay={`#${refId}`} data-modal-btn={`#${refId}`}>
                {children}
            </div>

            <div id={`${refId}`} className="overlay modal overlay-open:opacity-100 overlay-open:duration-300 modal-middle hidden" role="dialog" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">New Workspace</h3>
                            <button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" data-overlay={`#${refId}`}><span className="icon-[tabler--x] size-4"></span></button>
                        </div>
                        <div className={`${errors.root?.message || isError ? 'rounded border p-5 alert-error alert-soft w-full alert' : 'hidden'}`}>
                            {errors.root?.message && (
                                <small className="font-medium">{errors.root.message}</small>
                            )}
                            {isApiError(error) && <small className='text-red-500'>An error occurred: {error.status} {JSON.stringify(error.data)}</small>}
                        </div>

                        <form onSubmit={handleSubmit((data) => onCreateWorkspace(data))} className={`flex flex-col gap-6 w-full p-6 pt-0`} >
                            {inputFields.map((input: CreateWorkspaceForm, key) => {
                                const { field, placeholder, label, type } = input
                                const fieldError = errors[field] as FieldError | undefined;
                                const keyId = 'id-' + key
                                return (
                                    <div className="input-floating" key={key}>
                                        <input type={type} placeholder={placeholder} id={keyId}
                                            {...register(field)}
                                            className={`input border-0 border-b rounded-none rounded-t`} />
                                        <label htmlFor={keyId} className="input-floating-label" >{label}</label>
                                        {fieldError && fieldError.message && (
                                            <div className="text-sm mt-2 text-red-400 text-left">
                                                {fieldError.message}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            <div className="flex justify-end gap-4 w-full">
                                <button type="button" className="btn btn-secondary" data-overlay={`#${refId}`}>Cancel</button>
                                <button type="submit" className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}>
                                    {isLoading && <span className="loading loading-spinner"></span>}
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>)
}

export default CreateWorkspaceModal;