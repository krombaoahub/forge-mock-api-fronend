import { faker } from "@faker-js/faker";

export type FakeDataType = string | object | number | boolean | null

function isNumericString(inputString: string): boolean {
  // The unary plus operator (+) attempts to convert the string to a number.
  // Number.isFinite() then checks if the result is a valid, non-infinite number.
  return Number.isFinite(+inputString);
}

export function getFakeData(modules: string, field: string, asData: boolean = true): FakeDataType {
    let data: FakeDataType = null

    const fake = Object.entries(faker).filter((item) => item[0] == modules)
    if (fake.length > 0) {
        if (Object.keys(fake[0][1]).filter(item => item == field)) {
            data = asData ? fake[0][1][field]() : fake[0][1][field]
            if (isNumericString(data as string)) {
                const tempData = parseFloat(data as string);
                data = Number.isInteger(tempData) ? parseInt(data as string) : parseFloat(data as string);
            }
        }
    }

    return data as FakeDataType
}