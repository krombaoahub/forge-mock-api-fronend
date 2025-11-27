import type { SchemeFieldsInterface } from "@/interfaces";

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

export default SchemeFields;