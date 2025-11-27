import type { CollectionSchemeInterface } from "@/interfaces";
import type React from "react"
import type { CollectionFieldNameSelectType, CollectionFieldNameType } from "@/types";
import { collectionFormSchema, type CollectionFormFields } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAppSelector } from "@/states/hooks";
import { collectionSelector } from "@/states/slice/selector/collection-selector";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { buildFieldScheme, destroyHSSelect, parseFieldScheme } from "@/libs/utils";
import { useDispatch } from "react-redux";
import { setSchemeFields } from "@/states/slice/collection-slice";
import { HSSelect } from "flyonui/flyonui";
import SchemeFields from "./scheme-fields";
import FakerSelectOptions from "./faker-options";
import { useSaveCollectionMutation } from "@/services/api";
import { useParams } from "react-router-dom";

const CollectionForm: React.FC<{ refetch: () => void }> = ({ refetch }) => {
    const { workspaceId } = useParams()
    const { id, schemeFields, name: collectionName, dataCount } = useAppSelector(collectionSelector)
    const [saveCollection, { isLoading: saveLoading }] = useSaveCollectionMutation()
    const maxFieldCount: number = 5
    const dispatch = useDispatch()
    const dataCountRef = useRef<HTMLSpanElement>(null)
    const sliderRef = useRef<HTMLDivElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CollectionFormFields>({
        resolver: zodResolver(collectionFormSchema),
        defaultValues: {
            name: collectionName,
            ...parseFieldScheme(schemeFields)
        }
    });

    const onSubmit: SubmitHandler<CollectionFormFields> = async (data) => {
        let dataCount: number = 10
        if (dataCountRef.current) {
            const fieldsetCount = dataCountRef.current.querySelector('input')?.value ?? '10'
            dataCount = parseInt(fieldsetCount)
        }

        let schemeFields = buildFieldScheme(data, ['name'])

        try {
            await saveCollection({ schemeFields, name: data.name, dataCount, workspaceId }).unwrap()
            refetch()
        } catch (err) {
            console.error('Failed to save the collection:', err);
        }
    };

    const onDuplicate = useCallback(
        () => {
            if (schemeFields.length < maxFieldCount) {
                destroyHSSelect('select-faker-option')
                const fields = [...schemeFields];
                fields.push({ name: '', type: 'string.uuid' })
                dispatch(setSchemeFields(fields))
                setTimeout(() => {
                    HSSelect.autoInit()
                }, 10);
            }
        }, [schemeFields])

    const onRemoveField = useCallback((index: number) => {
        const fields = schemeFields.filter((e, i) => { return index !== i && e });
        reset({
            name: collectionName,
            ...parseFieldScheme(fields)
        });
        dispatch(setSchemeFields(fields))
    }, [schemeFields])

    useEffect(() => {
        reset({
            name: collectionName,
            ...parseFieldScheme(schemeFields)
        })
        return () => reset();
    }, [id]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-6`} >
                <div className="text-lg font-bold">{id ? 'Collection' : 'New Collection'}</div>
                <div className="input-floating w-full">
                    <input type="text" placeholder="e.g. Users, Posts, Commnet, etc..." className="input border rounded-md" id="collection_input_name"
                        {...register('name')} />
                    <label htmlFor={'#collection_input_name'} className="input-floating-label" >Collection Name</label>
                    {errors.name && <div className="text-sm mt-2 text-red-400 text-left"><>{errors.name.message}</></div>}
                </div>

                <div className="w-full grow flex gap-4 items-center">
                    <div className="grow">
                        <div className="text-sm flex gap-1">Data Count: <div ref={sliderRef}>{dataCount}</div></div>
                        <div className="w-full my-2 max-w-md bg-primary/20 rounded-md">
                            <Slider ref={dataCountRef} defaultValue={[dataCount]} min={0} max={100} step={2} onValueChange={(value) => { if (sliderRef.current) sliderRef.current.innerHTML = value[0].toString() }} />
                        </div>
                    </div>
                    <div className={`btn btn-sm btn-primary w-36 ${schemeFields.length >= maxFieldCount ? 'btn-disabled' : ''}`} onClick={onDuplicate}>Add another fields</div>
                </div>
                <div className="flex gap-4 w-full flex-col">
                    <div className="grow w-full">
                        <h1>Fields</h1>
                        <div className="flex flex-col">
                            {
                                schemeFields.map((schemeField: CollectionSchemeInterface, index: number) => {
                                    const fieldName = `field_${index + 1}` as CollectionFieldNameType
                                    const selectName = `select_${index + 1}` as CollectionFieldNameSelectType
                                    return (
                                        <div className="my-2 flex w-full gap-4 relative group" key={index}>
                                            <div className="input-floating w-full">
                                                <input type='text' placeholder='e.g. name, date, email, etc...' className="input border rounded-md" id={`${fieldName}`}
                                                    {...register(fieldName)} />
                                                <label htmlFor={`#${fieldName}`} className="input-floating-label" >Field Name</label>
                                                {errors[fieldName] && <div className="text-sm mt-2 text-red-400 text-left"><>{errors[fieldName].message}</></div>}
                                            </div>

                                            <FakerSelectOptions schemeField={schemeField} keyId={selectName} register={register} errors={errors} />

                                            {index > 0 && <div onClick={() => { onRemoveField(index) }} className="right-0 -top-4 group-hover:flex hidden absolute cursor-pointer hover:bg-red-500/50 hover:text-white text-red-500 p-2 rounded-full">
                                                <Trash2 size={16} />
                                            </div>}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {
                        (schemeFields.length > 1 && schemeFields[0].name != '') &&
                        <div className="grow w-full">
                            <h1>Scheme</h1>
                            <div className="bg-black p-4 rounded-md overflow-auto grow ">
                                <pre><code className='text-sm text-white'>{`{`}</code></pre>
                                {
                                    schemeFields.map((schemeField: CollectionSchemeInterface, index: number) => (
                                        <pre key={index}>
                                            <code className='text-sm text-secondary'>
                                                <SchemeFields fields={schemeField} comma={index < (schemeFields.length - 1) ? ',' : ''} />
                                            </code>
                                        </pre>
                                    ))
                                }
                                <pre><code className='text-sm text-white'>{`}`}</code></pre>
                            </div>
                        </div>
                    }
                </div>

                <div className="flex justify-center w-full">
                    <button type="submit" className={`w-full btn btn-primary ${saveLoading ? 'btn-disabled' : ''}`}>
                        {saveLoading && <span className="loading loading-spinner"></span>}
                        Save
                    </button>
                </div>
            </form>
        </>
    )
}
export default CollectionForm