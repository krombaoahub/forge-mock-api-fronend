import { faker } from '@faker-js/faker';
import { clsx, type ClassValue } from 'clsx';
import { serverTimestamp, type DocumentData } from 'firebase/firestore';
import { HSOverlay, HSSelect, type ICollectionItem } from 'flyonui/flyonui';
import { twMerge } from 'tailwind-merge';
import { getAllByAttribute } from './domUtils';

export const isEmpty = (obj: object | undefined) => {
  if (!obj) return
  // Object.keys() returns an array of an object's own enumerable property names
  return Object.keys(obj).length === 0;
}

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const env = import.meta.env

export function destroyInitModal(query: HTMLElement) {
  const modal = new HSOverlay(query)
  modal.close()
  setTimeout(() => {
    if (query) {
      const { element } = HSOverlay.getInstance(query, true) as ICollectionItem<HSOverlay>
      element.destroy()
    }
  }, 100);
}

// collection data timestamp
export const timestamp = {
  createdAt: serverTimestamp(),
  updatedAt: null,
  deletedAt: null,
}

export const timestampToMillis = (e: DocumentData) => {
  return {
    createdAt: e.data().createdAt?.toMillis(),
    updatedAt: e.data().updatedAt?.toMillis(),
    deletedAt: e.data().deletedAt?.toMillis(),
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateFakeData(schemes: { name: string, type: string }[], count: number): any[] {
  const generatedData: any[] = [];
  const array = [...Array(count)]
  array.map(() => {
    let data: Record<string, any> = {}
    schemes.forEach(scheme => {
      const [base, fakeData] = scheme.type.split('.')
      const tempFakeData = (faker as any)[base][fakeData]()
      if (scheme.name != '') {
        if (typeof tempFakeData == 'object') {
          data[scheme.name] = JSON.stringify((faker as any)[base][fakeData]())
        } else {
          data[scheme.name] = (faker as any)[base][fakeData]()
        }
      }
    });

    if (!isEmpty(data)) {
      generatedData.push(data)
    }
  })

  return generatedData
}

export async function batchCommit(batch: any) {
  try {
    await batch.commit();
    console.log("Documents successfully written in a batch!");
  } catch (error) {
    console.error("Error writing documents: ", error);
  }
}

export function destroyHSSelect(name: string) {
  const options = getAllByAttribute('name', name)

  Array.from(options).map((el: any) => {
    const selectEl = HSSelect.getInstance(el)
    if (selectEl && 'destroy' in selectEl) {
      selectEl.destroy()
    }
  })
}

export function buildFieldScheme(data: any, excludeKey: any[]) {
  let fields: { name: string, type: string }[] = []
  Object.entries(data).map((item: any) => {
    const [key, value] = item
    const [type, num] = key.split('_')

    if (!excludeKey.includes(key)) {
      let temp = fields[(parseInt(num) - 1)]

      if (!temp) {
        temp = { name: '', type: '' }
      }

      if (type == 'field') { temp.name = value }
      if (type == 'select') { temp.type = value }

      fields[(parseInt(num) - 1)] = temp
    }
  })

  return fields
}

export function parseFieldScheme(fields: any, setEmpty: boolean = false) {
  let temp: any = {}
  fields.forEach((item: any, index: number) => {
    temp[`field_${(index + 1)}`] = setEmpty ? '' : item.name
    temp[`select_${(index + 1)}`] = setEmpty ? '' : item.type
  });
  return temp
}
// Function to generate a simple random salt
export function generateSalt(length = 16) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to "encrypt" (encode with salt)
export function encryptWithSalt(data: string, salt: string) {
  // Concatenate salt and data, then encode with btoa
  const combinedString = salt + data;
  return btoa(combinedString);
}

// Function to "decrypt" (decode and remove salt)
export function decryptWithSalt(encodedData: string, salt: string) {
  // Decode with atob
  const decodedCombinedString = atob(encodedData);
  // Remove the salt from the beginning of the decoded string
  if (decodedCombinedString.startsWith(salt)) {
    return decodedCombinedString.substring(salt.length);
  } else {
    console.error("Salt mismatch or data corruption.");
    return null;
  }
}

export function buildPostPayload(url: string, data: any, exHeaders: { [key: string]: any } = {}) {
  const gSalt = generateSalt(10)
  return {
    url,
    method: 'POST',
    body: { data: encryptWithSalt(JSON.stringify(data), gSalt) },
    headers: {
      'X-g-salt': gSalt, // Set the dynamic header
      ...exHeaders
    }
  }
}

export function buildPayload(url: string, data: any, method: string = 'POST', exHeaders: { [key: string]: any } = {}) {
  const gSalt = generateSalt(10)
  return {
    url,
    method,
    body: { data: encryptWithSalt(JSON.stringify(data), gSalt) },
    headers: {
      'X-g-salt': gSalt, // Set the dynamic header
      ...exHeaders
    }
  }
}