import type { SchemaFieldsInterface } from "@/interfaces";
import { getFakeData } from "@/libs/faker-utils";
import { isIsoDateFormatValid } from "@/libs/utils";

interface FieldProps {
    fields: {
        name?: string;
        value: string; // Value can be string, number, boolean, object, or null
    };
    spaceCount: number;
    comma: string;
}

const renderValue = (value: string | null) => {
    let displayValue: string | number | boolean | null = value;
    let colorClass = 'text-white'; // Default color

    if (value === null) {
        colorClass = 'text-error';
        displayValue = 'null';
    } else if (typeof value === 'number') {
        colorClass = 'text-secondary';
    } else if (typeof value === 'boolean') {
        colorClass = 'text-info';
    } else if (typeof value === 'object') {
        colorClass = 'text-warning';
        displayValue = JSON.stringify(value);
    } else if (typeof value === 'string') {
        if (isIsoDateFormatValid(value)) {
            colorClass = 'text-green-200';
        } else {
            colorClass = 'text-primary';
        }
        displayValue = `"${displayValue}"`;
    }

    const baseClasses = 'truncate max-w-[25rem] flex items-center';
    return <span className={`${baseClasses} ${colorClass}`}>{displayValue}</span>;
};


export const SchemaFields: React.FC<SchemaFieldsInterface> = ({ fields, spaceCount = 2, comma = ',' }) => {
    const spaces = [...Array(spaceCount)].map(() => ' ').join(' ')
    const [module, field] = fields.type.split('.')
    return (
        <div className="text-sm flex flex-wrap text-white">
            {
                (fields.name || fields.type) && <>
                    {`${spaces}"`}<div className="truncate  max-w-24">{fields.name || ''}</div>{`"`}
                    <span>:</span>
                    {typeof fields.type === 'string' && <span className='text-green-400'>"{fields.type}"</span>}
                    {`${comma}`}
                    <em className="ms-2 flex items-center text-[10px] italic text-gray-400">
                        (<small>e.g.</small> 
                        {renderValue(getFakeData(module, field) as string | null)}
                        )
                    </em>
                </>
            }
        </div>
    )
}
export const JsonField: React.FC<FieldProps> = ({ fields, spaceCount, comma }) => {
    const spaces = [...Array(spaceCount)].map(() => ' ').join('\u00A0');

    return (
        <div className="text-sm flex flex-wrap text-white">
            {(fields.name || fields.value) && (
                <>
                    {`${spaces}`}
                    <span className='text-white'>"{fields.name}": </span>
                    {renderValue(fields.value)}
                    {`${comma}`}
                </>
            )}
        </div>
    );
};
