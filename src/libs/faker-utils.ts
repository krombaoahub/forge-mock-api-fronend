import { faker } from "@faker-js/faker";

type FakeDataType = string | object | null

export function getFakeData(modules: string, field: string, asData: boolean = true): FakeDataType {
    let data: FakeDataType = null

    const fake = Object.entries(faker).filter((item) => item[0] == modules)
    if (fake.length > 0) {
        if (Object.keys(fake[0][1]).filter(item => item == field)) {
            data = asData ? fake[0][1][field]() : fake[0][1][field]
        }
    }

    return data as FakeDataType
}