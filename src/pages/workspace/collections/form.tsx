import type { CollectionSchemaInterface, FakerInterface } from "@/interfaces";
import type React from "react"
import type { CollectionFieldNameSelectType, CollectionFieldNameType } from "@/types";
import { collectionFormSchema, type CollectionFormFields } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAppSelector } from "@/states/hooks";
import { collectionSelector } from "@/states/slice/selector/collection-selector";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { buildFieldSchema, destroyInputHSSelect, parseFieldSchema } from "@/libs/utils";
import { useDispatch } from "react-redux";
import { setSchemaFields, setName, setData, setId } from "@/states/slice/collection-slice";
import { SchemaFields, JsonField } from "./schema-fields";
import { useSaveCollectionMutation, useGetCollectionDataMutation } from "@/services/api";
import { useParams } from "react-router-dom";
import { fakerOptions } from "@/contants/faker-options";
import type { DocumentData } from "firebase/firestore";

const CollectionForm: React.FC<{ refetch: () => void }> = ({ refetch }) => {
    const { workspaceId } = useParams()
    const maxFieldCount: number = 5
    const { id, schemaFields, name: collectionName, dataCount, data: collectionData } = useAppSelector(collectionSelector)
    const [saveCollection, { isLoading: saveLoading }] = useSaveCollectionMutation()
    const [getCollectionData, { isLoading: fetching }] = useGetCollectionDataMutation()
    const [schemaFieldPreview, setSchemaFieldPreview] = useState<CollectionSchemaInterface[] | []>(schemaFields);
    const dispatch = useDispatch()
    const dataCountRef = useRef<HTMLSpanElement>(null)
    const sliderRef = useRef<HTMLDivElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue,
        trigger
    } = useForm<CollectionFormFields>({
        resolver: zodResolver(collectionFormSchema),
        defaultValues: {
            name: collectionName,
            ...parseFieldSchema(schemaFields)
        }
    });

    const onSubmit: SubmitHandler<CollectionFormFields> = async (data: CollectionFormFields) => {
        let dataCount: number = 10
        if (dataCountRef.current) {
            const fieldsetCount = dataCountRef.current.querySelector('input')?.value ?? '10'
            dataCount = parseInt(fieldsetCount)
        }
        const schemaFields = buildFieldSchema(data, ['name'])

        try {
            await saveCollection({ schemaFields, name: data.name, dataCount, workspaceId, id }).unwrap().then(async (collection) => {
                refetch()
                getCollectionData({ workspaceId: workspaceId || '', collectionId: collection.id }).then(res => dispatch(setData(res.data)))
                dispatch(setId(collection.id))
            })
        } catch (err) {
            console.error('Failed to save the collection:', err);
        }
    };

    const onDuplicate = useCallback(
        () => {
            if (schemaFields.length < maxFieldCount) {
                const values = getValues();
                if (values.name) dispatch(setName(values.name));
                destroyInputHSSelect('select-faker-option')
                const fields = [...buildFieldSchema(values, ['name'])];
                fields.push({ name: '', type: 'string.uuid' })
                dispatch(setSchemaFields(fields))
            }
        }, [schemaFields, dispatch, getValues])

    const onRemoveField = useCallback((index: number) => {
        const fields = schemaFields.filter((e, i) => { return index !== i && e });
        reset({
            name: collectionName,
            ...parseFieldSchema(fields)
        });
        dispatch(setSchemaFields(fields))
    }, [schemaFields, dispatch, collectionName, reset])

    const onSchemaFieldUpdate = useCallback(() => {
        const values = getValues();
        const result = collectionFormSchema.safeParse(values);
        if (result.success) {
            setSchemaFieldPreview(buildFieldSchema(result.data, ['name']));
        }
    }, [getValues])

    const onSchemaSelectUpdate = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        const selectSchema = event.target.dataset.selectSchema as keyof CollectionFormFields;
        setValue(selectSchema, newValue);
        trigger(selectSchema);
        onSchemaFieldUpdate()
    }, [setValue, trigger, onSchemaFieldUpdate]);

    useEffect(() => {
        reset({ name: collectionName, ...parseFieldSchema(schemaFields) })
        getCollectionData({ workspaceId: workspaceId || '', collectionId: id }).then(res => dispatch(setData(res.data)))
        return () => reset();
    }, [id, collectionName, reset, schemaFields, workspaceId, dispatch, getCollectionData]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-wrap gap-4`} >
                <div className="text-lg font-bold">{id ? 'Collection' : 'New Collection'}</div>
                <div className="flex w-full md:flex-nowrap flex-wrap gap-4 ">
                    <div className="input-floating w-full">
                        <input type="text" placeholder="e.g. Users, Posts, Commnet, etc..." className="input border rounded-md" id="collection_input_name"
                            {...register('name')} />
                        <label htmlFor={'#collection_input_name'} className="input-floating-label" >Collection Name</label>
                        {errors.name && <div className="text-sm mt-2 text-red-400 text-left"><>{errors.name.message}</></div>}
                    </div>

                    <div className="w-full grow flex gap-4 items-center">
                        <div className="grow">
                            <div className="input-floating w-full border-l border-secondary/80 flex items-center border p-4 rounded-md">
                                <label htmlFor={`#method`} className="input-floating-label" >Data Count: <span ref={sliderRef}>{dataCount}</span></label>
                                <div className="w-full max-w-md bg-primary/20 rounded-md">
                                    <Slider ref={dataCountRef} defaultValue={[dataCount]} min={0} max={100} step={2} onValueChange={(value) => { if (sliderRef.current) sliderRef.current.innerHTML = value[0].toString() }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 w-full flex-col">
                    <div className="grow w-full gap-3 flex flex-col">
                        <div className="flex gap-4 items-center"><div>Fields</div><div className={`btn btn-sm btn-primary ${schemaFields.length >= maxFieldCount ? 'btn-disabled' : ''}`} onClick={onDuplicate}>Add another field</div></div>
                        <div className="flex flex-col">
                            {
                                schemaFields.map((_: CollectionSchemaInterface, index: number) => {
                                    const fieldName = `field_${index + 1}` as CollectionFieldNameType
                                    const selectName = `select_${index + 1}` as CollectionFieldNameSelectType
                                    return (
                                        <div className="my-2 flex w-full md:flex-nowrap flex-wrap gap-4 relative group" key={index}>
                                            <div className="input-floating w-full">
                                                <input type='text' placeholder='e.g. name, date, email, etc...'
                                                    onKeyUp={() => { onSchemaFieldUpdate() }}
                                                    className="input border rounded-md" id={`${fieldName}`}
                                                    {...register(fieldName)} />
                                                <label htmlFor={`#${fieldName}`} className="input-floating-label" >Field Name</label>
                                                {errors[fieldName] && <div className="text-sm mt-2 text-red-400 text-left"><>{errors[fieldName].message}</></div>}
                                            </div>

                                            <div className="w-full">
                                                <div className="select-floating ">
                                                    <div className="skeleton skeleton-animated w-full h-9 absolute " />
                                                </div>
                                                <div className="select-floating ">
                                                    <select
                                                        {...register(selectName)}
                                                        data-select-schema={selectName}
                                                        onChange={onSchemaSelectUpdate}
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
                                                        name="select-faker-option"
                                                    >
                                                        <option key={0} value=''></option>
                                                        {
                                                            (fakerOptions).map((item: FakerInterface, iKey: number) => {
                                                                return (
                                                                    <option key={iKey} value={`${item.group}.${item.type}`}>{`${item.group}.${item.type}`}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>

                                                    <label className="select-floating-label" htmlFor="select_method">Faker.js</label>
                                                    {errors[selectName] && <div className="text-sm mt-2 text-red-400 text-left"><>{errors[selectName].message}</></div>}
                                                </div>
                                            </div>

                                            {index > 0 && <div onClick={() => { onRemoveField(index) }} className="right-1 top-[3px] bg-secondary/80 absolute cursor-pointer text-white  p-2 rounded-full">
                                                <Trash2 size={16} />
                                            </div>}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {

                        <div className="w-full gap-3 flex flex-col">
                            <h1>Schema</h1>
                            <div className="bg-black p-4 rounded-md overflow-auto ">
                                <pre><code className='text-sm text-white'>{`{`}</code></pre>
                                {
                                    schemaFieldPreview.map((schemaField: CollectionSchemaInterface, index: number) => (
                                        <pre key={index}>
                                            <code className='text-sm text-secondary'>
                                                <SchemaFields fields={schemaField} comma={index < (schemaFieldPreview.length - 1) ? ',' : ''} />
                                            </code>
                                        </pre>
                                    ))
                                }
                                <pre><code className='text-sm text-white'>{`}`}</code></pre>
                            </div>
                        </div>
                    }
                    {id && (fetching
                        ? <>
                            <div className="grow w-full gap-3 flex flex-col ">
                                <h1 className="skeleton skeleton-animated w-24 h-7"></h1>
                                <div className="bg-black p-4 rounded-md overflow-auto grow max-h-64 min-h-24 skeleton-striped">
                                </div>
                            </div>
                        </>
                        : <>
                            {(collectionData) &&
                                <div className="grow w-full gap-3 flex flex-col ">
                                    <h1>Data</h1>
                                    <div className="bg-black p-4 rounded-md overflow-auto grow max-h-64 ">
                                        <pre><code className='text-sm text-white'>{`[`}</code></pre>
                                        {
                                            collectionData.map((data: DocumentData, index: number) => (
                                                <pre key={index}>
                                                    <code className='text-sm text-white'>
                                                        {"  {"}
                                                        {Object.entries(data).map(([key, value], iIndex, arr) => (
                                                            <JsonField fields={{ name: key, value: value as string }} comma={iIndex < (arr.length - 1) ? ',' : ''} spaceCount={3} />
                                                        ))}
                                                        {"  }"}{index < collectionData.length - 1 ? ',' : ''}
                                                    </code>
                                                </pre>
                                            ))
                                        }
                                        <pre><code className='text-sm text-white'>{`]`}</code></pre>
                                    </div>
                                </div>
                            }
                        </>)}
                </div>


                <div className="flex w-full md:justify-end justify-center">
                    <button type="submit" className={`w-50 btn btn-primary ${saveLoading ? 'btn-disabled' : ''}`}>
                        {saveLoading && <span className="loading loading-spinner"></span>}
                        Save
                    </button>
                </div>
            </form >
        </>
    )
}
export default CollectionForm