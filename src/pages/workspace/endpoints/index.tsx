import { Slider } from "@/components/ui/slider";
import { fakerOptions } from "@/contants/faker-options";
import { useGetWorkspaceCollections } from "@/hooks/use-workspace";
import type { CollectionSchemaInterface, EndpointFieldInteface, EndpointResponseFieldInteface } from "@/interfaces";
import { destroyInputHSSelect } from "@/libs/utils";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { setResponseField, setSelectFields } from "@/states/slice/endpoint-slice";
import { endpointSelector } from "@/states/slice/selector/endpoint-selector";
import { workspaceSelector } from "@/states/slice/selector/workspace-selector";
import type { DocumentData } from "firebase/firestore";
import { Copy, Plus, Trash2 } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState, type BaseSyntheticEvent } from "react";
import { useParams } from "react-router-dom";

const InputFloating: React.FC<{ indexKey?: number }> = ({ indexKey = 0 }) => {
    return (
        <>
            <div className="input-floating w-full">
                <input type='text' placeholder='e.g. name, date, email, etc...'
                    defaultValue={`field_${indexKey}`}
                    onKeyUp={() => { }}
                    className="input border rounded-md" id={`fieldName_${indexKey}`}
                />
                <label htmlFor={`#fieldName_${indexKey}`} className="input-floating-label" >Field Name</label>
            </div>
        </>
    )
}
const SelectFloating: React.FC<{ selectOptions?: EndpointFieldInteface[] }> = ({ selectOptions = [] }) => {
    return (
        <>
            <div className="w-full">
                <div className="select-floating ">
                    <div className="skeleton skeleton-animated w-full h-9 absolute " />
                </div>
                <div className="select-floating ">
                    <select
                        onChange={() => { }}
                        data-select='{
                            "placeholder": "Field Data",
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
                        <option key={0} value=''>Select Data</option>
                        {
                            (selectOptions).map((item: DocumentData, iKey: number) => {
                                return (
                                    <option key={iKey} value={`${item.value}`}>{`${item.value}`}</option>
                                )
                            })
                        }
                    </select>
                    <label className="select-floating-label" htmlFor="select_method">Data</label>
                </div>
            </div>
        </>
    )
}
const DynamicWidthInput: React.FC<{ fieldKey?: string, index: number, handleOnKeyUp?: (value: string, index: number) => void }> = ({ index, handleOnKeyUp, fieldKey = 'name' }) => {
    const { responseFields } = useAppSelector(endpointSelector)
    const [value, setValue] = useState(fieldKey);

    useEffect(() => {
        setValue(responseFields[index].input || 'name')
    }, [setValue, responseFields, index])

    const onKeyPressUp = useCallback((e: BaseSyntheticEvent) => {
        setValue(e.target.value)
        if (handleOnKeyUp) handleOnKeyUp(e.target.value, index)
    }, [setValue, handleOnKeyUp, index])

    return (
        <input
            type="text"
            className="cursor-pointer"
            value={value}
            onChange={onKeyPressUp}
            size={value.length - 1 || 1}
        />
    );
}

const DynamicWidthSelect: React.FC<{ index: number, fieldValue?: string, options?: EndpointFieldInteface[], handleOnChange?: (value: string, index: number) => void }> = ({ fieldValue = 'Select Fields', options = [], index, handleOnChange }) => {
    const { responseFields } = useAppSelector(endpointSelector)
    const [selectedValue, setSelectedValue] = useState(fieldValue);
    const [calculateWidth, setCalculateWidth] = useState(fieldValue);

    options = [{ collection: '', name: 'Select Fields', type: 'Select Fields', value: 'Select Fields' }, ...options]

    useEffect(() => {
        setSelectedValue(responseFields[index].select || 'Select Fields')
    }, [setSelectedValue, responseFields, index])

    useEffect(() => {
        let value = selectedValue
        if (!options.map(item => item.collection + '.' + item.name).includes(selectedValue)) {
            value = 'Select Fields'
        }
        setCalculateWidth(`${value.length * 8 + 20}px`)
    }, [selectedValue, setCalculateWidth, options])

    const handleChange = (e: BaseSyntheticEvent) => {
        setSelectedValue(e.target.value);
        if (handleOnChange) handleOnChange(e.target.value, index)
    };

    return (
        <div className="p-0">
            <select
                id="dynamic-select"
                value={selectedValue}
                onChange={handleChange}
                style={{ width: calculateWidth }}
                className="border-none flex items-center bg-transparent p-0 cursor-pointer"
            >
                {options.map((option: DocumentData, key: number) => (
                    <option key={key} value={(key == 0 ? option.name : [option.collection, option.name].join('.').toLocaleLowerCase())} className="bg-black">
                        {key == 0 ? option.name : [option.collection, option.name].join('.').toLocaleLowerCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};

const EndpointResponseBody: React.FC = () => {
    const dispatch = useAppDispatch()
    const maxFields: number = 5
    const { selectFields, responseFields } = useAppSelector(endpointSelector)

    useEffect(() => {
        setTimeout(() => {
            dispatch(setResponseField([{ input: `field_${responseFields.length + 1}`, select: undefined }]))
        }, 100);
    }, [dispatch, responseFields])

    const onAddField = useCallback(() => {
        dispatch(setResponseField([...responseFields, { input: `field_${responseFields.length + 1}`, select: undefined }]))

        destroyInputHSSelect('select-faker-option')

    }, [dispatch, responseFields])

    const updateResponseField = useCallback((type: string, index: number, value: string) => {
        dispatch(setResponseField([...responseFields].map((item: EndpointResponseFieldInteface, iPos: number) => {
            if (iPos == index) return type == 'input' ? { input: value, select: item.select } : { input: item.input, select: value }
            return item
        })))
    }, [dispatch, responseFields])

    const onInputChange = useCallback((value: string, index: number) => {
        updateResponseField('input', index, value)
    }, [updateResponseField])

    const onSelectChange = useCallback((value: string, index: number) => {
        updateResponseField('select', index, value)
    }, [updateResponseField])

    const onDeleteField = useCallback((index: number) => {
        dispatch(setResponseField([...responseFields].filter((_, iPos: number) => {
            return iPos != index
        })))
    }, [dispatch, responseFields])

    return (
        <>
            {selectFields.length > 0 && <div className="w-full gap-3 flex flex-col">
                <div className="flex gap-4 items-center">
                    <h1>Success Response Body:</h1>
                </div>
                <div className="bg-black p-4 rounded-md overflow-auto ">
                    <pre><code className='text-sm text-white'>{`{`}</code></pre>
                    {responseFields.map((item: { input?: string, select?: string }, i: number) => (
                        <pre className="flex items-center mb-1" key={i}>
                            <code className='text-sm text-white flex items-center'>
                                <Trash2 size={12} className={`${i == 0 ? 'btn-disabled opacity-0' : 'cursor-pointer hover:text-error'} `} onClick={() => onDeleteField(i)} />
                                {` "`}
                                <DynamicWidthInput index={i} handleOnKeyUp={onInputChange} fieldKey={item.input} />
                                {`":`}
                                <div className="text-success flex items-center">
                                    {`"`}
                                    <DynamicWidthSelect index={i} handleOnChange={onSelectChange} fieldValue={item.select} options={selectFields} />
                                    {`"`}
                                </div>
                            </code>
                        </pre>
                    ))}
                    {(responseFields.length < maxFields)
                        && <pre><code className='text-sm text-white'>
                            <button className="ms-5 hover:border-white  hover:text-white border-secondary/90  text-secondary/90 border rounded-md flex items-center px-1"
                                onClick={onAddField}>
                                Add another field <Plus size={15} />
                            </button>
                        </code></pre>
                    }
                    <pre><code className='text-sm text-white'>{`}`}</code></pre>
                </div>
            </div>
            }
        </>
    )
}

const EndpointFields: React.FC = () => {
    const dispatch = useAppDispatch()
    const { selectFields, responseFields } = useAppSelector(endpointSelector)
    console.log('aasds', selectFields)

    useEffect(() => {
        setTimeout(() => {
            destroyInputHSSelect('select-faker-option')
        }, 100);
    }, [])

    const onAddField = useCallback(() => {
        dispatch(setResponseField([...responseFields, { input: `field_${responseFields.length + 1}`, select: undefined }]))

        destroyInputHSSelect('select-faker-option')

    }, [dispatch, responseFields])

    return (
        <>
            <div>
                <div className="flex gap-4 w-full flex-col">
                    <div className="grow w-full gap-3 flex flex-col">
                        <div className="flex gap-4 items-center">
                            <div>Fields</div>
                            <div onClick={onAddField} className={`btn btn-sm btn-primary`} >Add another field</div>
                        </div>
                        <div className="flex flex-col">
                            {
                                responseFields.map((item: { input?: string, select?: string }, i: number) => (
                                    <div className="my-2 flex w-full md:flex-nowrap flex-wrap gap-4 relative group" key={i}>
                                        <InputFloating indexKey={i} />
                                        <SelectFloating selectOptions={selectFields} />
                                    </div>)
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const EndpointCollectionSelect: React.FC = () => {
    const dispatch = useAppDispatch()
    const { workspaceId } = useParams()
    const onUseGetWorkspaceCollections = useGetWorkspaceCollections()
    const { collections } = useAppSelector(workspaceSelector)
    // const [schemaFields, setSchemaFields] = useState({})

    useEffect(() => {
        onUseGetWorkspaceCollections(workspaceId || '')
        let collectionSchemasFields: object = {}
        collections.map((item: DocumentData) => {
            const keyName = item.name.toLowerCase()
            const schema: object = {
                [keyName]: [...item.schemaFields]
            }
            collectionSchemasFields = { ...collectionSchemasFields, ...schema }
        })

        // setSchemaFields(collectionSchemasFields)


        const fakerFields = fakerOptions.map((item: { group: string, type: string }): EndpointFieldInteface => {
            return { collection: 'faker', name: `${item.group}.${item.type}`, type: `${item.group}.${item.type}`, value: `faker.${item.group}.${item.type}` }
        })

        dispatch(setSelectFields([...fakerFields]))
    }, [dispatch, onUseGetWorkspaceCollections, collections, workspaceId])

    const onCollectionDataChange = (e: BaseSyntheticEvent) => {
        let collectionSchema: CollectionSchemaInterface[] | null = null
        let selectFieldsOption: EndpointFieldInteface[] = []
        if (e.target.value != 'Faker.js') {
            collectionSchema = JSON.parse(e.target.value)
            const text = e.target.options[e.target.selectedIndex].text.toLowerCase()
            selectFieldsOption = collectionSchema ? collectionSchema.map((item: CollectionSchemaInterface): EndpointFieldInteface => {
                return { collection: text, name: item.name, type: item.type, value: `${text}.${item.name}` }
            }) : []
        } else {
            selectFieldsOption = fakerOptions.map((item: { group: string, type: string }): EndpointFieldInteface => {
                return { collection: 'faker', name: `${item.group}.${item.type}`, type: `${item.group}.${item.type}`, value: `faker.${item.group}.${item.type}` }
            })
        }

        // dispatch(setSelectFields([...selectedFields, ...fakerFields]))
        dispatch(setSelectFields([...selectFieldsOption]))

        destroyInputHSSelect('select-faker-option')
    }

    return (
        <div className="my-3 flex flex-col gap-4">
            <div className='flex gap-4 flex-wrap justify-between'>
                <div className="flex-1">
                    <div className="select-floating ">
                        <select className="select border-l border-secondary/80 h-10" aria-label="Select floating label" id="select_method" onChange={onCollectionDataChange}>
                            <option>Faker.js</option>
                            {collections.map((item: DocumentData, key: number) => {
                                return <option key={key} value={JSON.stringify(item.schemaFields)}>{item.name}</option>
                            })}
                        </select>
                        <label className="select-floating-label" htmlFor="select_method">Collection Data</label>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="input-floating w-full border-l border-secondary/80 flex items-center border p-4 rounded-md">
                        <label htmlFor={`#method`} className="input-floating-label" >Response delayed by <span>0sec</span></label>
                        <div className="w-full max-w-md bg-primary/20 rounded-md"><Slider defaultValue={[0]} min={0} max={60} step={2} id={`method`} /></div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="input-floating w-full border-l border-secondary/80 flex items-center border p-4 rounded-md">
                        <label htmlFor={`#method`} className="input-floating-label" >Response success rate <span>100%</span></label>
                        <div className="w-full max-w-md bg-primary/20 rounded-md"><Slider defaultValue={[100]} min={0} max={100} step={2} id={`method`} /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const EndpointMethodInputFields: React.FC = () => {
    const [customApi, setCustomApi] = useState<string>('')
    return (
        <>
            <div className="flex items-center gap-1">
                <div className="p-1 hover:bg-secondary hover:text-base-content cursor-pointer border-secondary/80 rounded-md flex items-center justify-center">
                    <Copy size={12} />
                </div>
                <div>
                    http://forgemockapi.com/api-endpoint/{customApi}
                </div>
            </div>
            <div className="flex border border-secondary/80 rounded-md ">
                <div className="select-floating w-30 ">
                    <select className="select border-none rounded-e-none" aria-label="Select floating label" id="select_method">
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                    </select>
                    <label className="select-floating-label" htmlFor="select_method">Method</label>
                </div>
                <div className="input-floating w-full border-l border-secondary/80">
                    <input type='text' placeholder='e.g. name, date, email, etc...' value={customApi}
                        onChange={(e: BaseSyntheticEvent) => setCustomApi(e.target.value)}
                        className="input border-none rounded-s-none" id={`method`} />
                    <label htmlFor={`#method`} className="input-floating-label" >Custom Path</label>
                </div>
            </div>

        </>
    )
}
const EndpointsForm: React.FC = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        return () => {
            dispatch(setSelectFields([]))
            dispatch(setResponseField([]))
        }
    }, [dispatch])
    return (
        <>
            <div className="p-6 flex gap-4 flex-col">
                EndpointsForm
                <EndpointMethodInputFields />
                <EndpointCollectionSelect />
                <EndpointFields />
                <div className="flex flex-wrap gap-4">
                    <EndpointResponseBody />{/* OK = 200, */}
                    {/*<EndpointResponseBody /> BAD_REQUEST = 400, */}
                    {/*<EndpointResponseBody /> NOT_FOUND = 404, */}
                    {/*<EndpointResponseBody /> INTERNAL_SERVER_ERROR = 500, */}
                </div>

                <div className="flex w-full md:justify-end justify-center">
                    <button type="submit" className={`w-50 btn btn-primary`}>
                        {/* <span className="loading loading-spinner"></span> */}
                        Save
                    </button>
                </div>
            </div>
        </>
    )
}


export default EndpointsForm;