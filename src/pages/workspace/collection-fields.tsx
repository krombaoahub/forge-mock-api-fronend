import { fakerOptions } from "@/contants/faker-options";
import { HSSelect } from "flyonui/flyonui";
import type React from "react";
import { useCallback, useEffect, useState, type BaseSyntheticEvent } from "react";
import { Slider } from "@/components/ui/slider"
import { destroyHSSelect, generateFakeData } from "@/libs/utils";
import { createCollection, updateCollection } from "@/services/workspace-service";
import { useParams } from "react-router-dom";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useAppSelector } from "@/states/hooks";
import { Trash2 } from "lucide-react";

interface SchemeFieldsInterface {
    fields: CollectionSchemeInterface,
    spaceCount?: number
    comma?: string
}

const SchemeFields: React.FC<SchemeFieldsInterface> = ({ fields, spaceCount = 2, comma = ',' }) => {
    const spaces = [...Array(spaceCount)].map(() => ' ').join(' ')
    return (
        <div className="text-sm flex">
            {
                (fields.name || fields.type) && <>
                    {`${spaces}"`}<div className="truncate max-w-24">{fields.name || ''}</div>{`"`}
                    <span>:</span>
                    {`"`}<div className="truncate max-w-[70dvh]">{fields.type || ''}</div>{`"${comma}`}
                </>
            }
        </div>
    )
}

interface CollectionSchemeInterface {
    name: string,
    type: string
}

const CollectionScheme: React.FC = () => {
    const {
        // handleGetCollections,
        handleGetCollectionById
    } = useWorkspaceContext()
    const selectedCollection = useAppSelector((state) => state.workspace.selectedCollection)

    const maxFieldCount = 5

    const { workspaceId } = useParams()
    const [schemeFields, setSchemeFields] = useState<CollectionSchemeInterface[]>([{ name: '', type: 'string.uuid' }])
    const [collectionId, setCollectionId] = useState<string>('')
    const [collectionName, setCollectionName] = useState<string>('')
    const [fieldsCount, setFieldsCount] = useState<number>(1)
    const [sliderCount, setSliderCount] = useState<number>(10)
    const [generatedData, setGeneratedData] = useState<any[] | null>(null)

    useEffect(() => {
        destroyHSSelect('select-faker-option')
        setCollectionId(selectedCollection.id || '')
        setCollectionName(selectedCollection.name || '')
        setSchemeFields(selectedCollection.schemeFields || [{ name: '', type: 'string.uuid' }])
        setSliderCount(selectedCollection.sliderCount || 10)
        setFieldsCount(selectedCollection.schemeFields?.length || 1)
        setGeneratedData(selectedCollection.data || null)
        setTimeout(() => {
            HSSelect.autoInit()
        }, 10);
    }, [selectedCollection])

    const onDuplicate = useCallback(
        () => {
            if (schemeFields.length < maxFieldCount) {
                destroyHSSelect('select-faker-option')
                const fields = [...schemeFields];
                fields.push({ name: '', type: 'string.uuid' })
                setSchemeFields(fields)
                setFieldsCount(fields.length)
            }
        }, [fieldsCount, schemeFields.length])

    const onFieldNameInput = useCallback((index: number, event: BaseSyntheticEvent) => {
        const fields = [...schemeFields];
        fields[index].name = event.target.value
        setSchemeFields(fields)
    }, [schemeFields])

    const onRemoveField = useCallback((index: number) => {
        const fields = schemeFields.filter((e, i) => { console.log(e); return i != index });
        setSchemeFields(fields)
    }, [schemeFields])

    const onFieldTypeChange = useCallback((index: number, event: BaseSyntheticEvent) => {
        const fields = [...schemeFields];
        fields[index].type = event.target.value
        setSchemeFields(fields)
    }, [schemeFields])

    const onSaveCollection = useCallback(async () => {
        const data = generateFakeData(schemeFields, sliderCount)
        if (workspaceId && collectionName != '' && data.length > 0) {
            const id = await createCollection({ collectionName, sliderCount, schemeFields, data, workspaceId })
            // handleGetCollections()
            handleGetCollectionById(id)
        }
    }, [schemeFields, sliderCount, collectionName])

    const onUpdateCollection = useCallback(async () => {
        const data = generateFakeData(schemeFields, sliderCount)
        if (workspaceId && collectionName != '' && data.length > 0) {
            await updateCollection({ collectionName, sliderCount, schemeFields, data, workspaceId, collectionId })
            // handleGetCollections()
            handleGetCollectionById(collectionId)
        }
    }, [schemeFields, sliderCount, collectionName])

    useEffect(() => { HSSelect.autoInit() }, [fieldsCount])

    return (
        <div className="w-full relative flex flex-col gap-4 p-6 border border-secondary/50 rounded-md">
            <div className="text-lg font-bold">{selectedCollection.id ? 'Collection' : 'New Collection'}</div>
            <div className="input-floating w-full">
                <input type='text' placeholder='e.g. users, posts, comments etc...' value={collectionName} onInput={(e: BaseSyntheticEvent) => { setCollectionName(e.target.value) }}
                    className={`input border-secondary border rounded-md`} />
                <label className="input-floating-label" >Collection Name</label>
            </div>
            <button className="btn btn-sm btn-primary w-36" disabled={schemeFields.length == maxFieldCount} onClick={() => onDuplicate()}>Add another fields</button>
            <div className="flex gap-4 w-full">
                <div className="grow w-full">
                    <h1>Fields</h1>
                    <div className="flex flex-col">
                        {
                            schemeFields.map((schemeField: CollectionSchemeInterface, index: number) => (
                                <div className="my-2 flex w-full gap-4 relative group" key={index}>
                                    <div className="input-floating w-full">
                                        <input type='text' placeholder='e.g. name, date, email, etc...' onInput={(e: BaseSyntheticEvent) => { onFieldNameInput(index, e) }}
                                            value={schemeField.name} className={`input border-secondary border rounded-md`} />
                                        <label className="input-floating-label" >Field Name</label>
                                    </div>

                                    <div className="w-full">
                                        <select
                                            defaultValue={schemeField.type.toLocaleLowerCase()}
                                            onChange={(e: BaseSyntheticEvent) => { onFieldTypeChange(index, e) }}
                                            name="select-faker-option"
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
                                    </div>
                                    {index > 0 && <div onClick={() => onRemoveField(index)} className="right-0 -top-4 group-hover:flex hidden absolute cursor-pointer hover:bg-red-500/50 hover:text-white text-red-500 p-2 rounded-full"><Trash2 size={16} /></div>}
                                </div>
                            ))
                        }
                    </div>
                </div>
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
            </div>

            <div className="w-full grow">
                <div className="flex gap-4 w-full grow items-center">
                    <div className="w-full grow">
                        <div className="text-sm">Data Count: {sliderCount}</div>
                        <div className="w-full my-2 max-w-md bg-primary/20 rounded-md">
                            <Slider defaultValue={[sliderCount]} value={[sliderCount]} min={0} max={100} step={1} onValueChange={(e) => setSliderCount(e[0])} />
                        </div>
                    </div>
                    <div className="w-full grow">
                        <button className="btn btn-sm btn-primary w-36" onClick={() => collectionId ? onUpdateCollection() : onSaveCollection()}>{collectionId ? 'Update' : 'Save'}</button>
                    </div>
                </div>
                <div className="text-sm">Sample Data:</div>
                <div className="bg-black p-4 rounded-md overflow-auto w-full max-h-80 text-sm">
                    {generatedData
                        ? <>
                            <pre><code className='text-sm text-white'>{`data:[`}</code></pre>
                            {
                                generatedData.map((schemeField: any, index: number) => {
                                    return (
                                        <div key={index}>
                                            <pre><code className='text-sm text-white'>{`  {`}</code></pre>
                                            <pre >
                                                <code className='text-sm text-secondary overflow-auto'>
                                                    {
                                                        Object.entries(schemeField).map((data: any, index: number) => {
                                                            const [name, type] = data
                                                            const countLenght = Object.keys(schemeField).length - 1;
                                                            return (
                                                                <SchemeFields key={index} fields={{ name, type }} spaceCount={3} comma={index < countLenght ? ',' : ''} />)
                                                        })}
                                                </code>
                                            </pre>
                                            <pre><code className='text-sm text-white'>{`  }${index < (generatedData.length - 1) ? ',' : ''}`}</code></pre>
                                        </div>
                                    )
                                })
                            }
                            <pre><code className='text-sm text-white'>{`]`}</code></pre>
                        </>
                        : <>
                            <pre><code className='text-sm text-white'>{`data:[]`}</code></pre>
                        </>}
                </div>
            </div>
        </div >
    )
}

export const CollectionFields: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <CollectionScheme />
        </div >)
}