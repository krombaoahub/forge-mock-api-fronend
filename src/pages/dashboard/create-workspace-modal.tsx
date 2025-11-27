import { FormField } from "@/components/forms";
import type { CreateWorkspaceModalInterface } from "@/interfaces";
import { getBySelector } from "@/libs/domUtils";
import { destroyInitModal } from "@/libs/utils";
import { useAddWorkspaceMutation } from "@/services/api";
import { isApiError } from "@/types";
import { createWorkspaceFormSchema, type CreateWorkspaceFormFields } from "@/zod/schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalInterface> = ({ children, refId, refetch, dataCount }) => {
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
        if (query) {
            destroyInitModal(query)
        }
        return () => reset(); // cleanup on unmount
    }, []);

    const onCreateWorkspace = async (data: any) => {
        try {
            await addWorkspace({
                ...data
            }).unwrap()

            if (dataCount == 0) {
                window.location.reload()
            }
            console.log({query})
            if (query) {
                setTimeout(() => {
                    refetch()
                }, 100);
                destroyInitModal(query)
                reset()
            }

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
                        <FormField handleSubmit={handleSubmit((data) => onCreateWorkspace(data))} className='w-full p-6 pt-0' inputs={[{
                            className: 'border-0 border-b-1 rounded-none rounded-t',
                            register,
                            placeholder: 'Example: App, Project, Todo, etc...',
                            errors,
                            field: 'name',
                            label: 'Name'
                        }]} >
                            <div className="flex justify-end gap-4 w-full">
                                <button type="button" className="btn btn-soft btn-secondary" data-overlay={`#${refId}`}>Cancel</button>
                                <button type="submit" className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}>
                                    {isLoading && <span className="loading loading-spinner"></span>}
                                    Create
                                </button>
                            </div>
                        </FormField>
                    </div>
                </div>
            </div>
        </div>)
}

export default CreateWorkspaceModal;