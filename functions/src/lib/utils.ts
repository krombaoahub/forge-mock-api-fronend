import { type DocumentData } from 'firebase/firestore';
import { admin } from '../imports';
import { WriteBatch } from 'firebase-admin/firestore';
import { FakeDataType, getFakeData } from './faker-utls';

export const isEmpty = (obj: object | undefined) => {
  if (!obj) return
  // Object.keys() returns an array of an object's own enumerable property names
  return Object.keys(obj).length === 0;
}
// collection data timestamp
export const timestamp = {
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  deletedAt: null,
}

export const timestampToMillis = (e: DocumentData) => {
  return {
    createdAt: e.data().createdAt?.toMillis(),
    updatedAt: e.data().updatedAt?.toMillis(),
    deletedAt: e.data().deletedAt?.toMillis(),
  }
}

export const timestampToDate = (e: DocumentData) => {
  return {
    createdAt: e.data().createdAt?.toDate(),
    updatedAt: e.data().updatedAt?.toDate(),
    deletedAt: e.data().deletedAt?.toDate(),
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateFakeData(schemas: { name: string, type: string }[], count: number): DocumentData[] {
  const generatedData: DocumentData[] = [];
  const array = [...Array(count)]
  array.map(() => {
    const data: DocumentData = {}
    schemas.forEach(schema => {
      const [module, field] = schema.type.split('.')

      const tempFakeData = getFakeData(module, field)
      if (schema.name != '') {
        if (typeof tempFakeData == 'object') {
          data[schema.name] = getFakeData(module, field) as FakeDataType
        } else {
          data[schema.name] = getFakeData(module, field) as FakeDataType
        }
      }
    });

    if (!isEmpty(data)) {
      generatedData.push(data)
    }
  })

  return generatedData
}

export async function batchCommit(batch: WriteBatch) {
  try {
    await batch.commit();
    console.log("Documents successfully written in a batch!");
  } catch (error) {
    console.error("Error writing documents: ", error);
  }
}

export const defaultRespose = (doc: DocumentData) => {
  return { id: doc.id, ...doc.data(), ...timestampToMillis(doc) }
}


// Function to "decrypt" (decode and remove salt)
export function decryptWithSalt(encodedData: string, salt: string) {
  // Decode with atob
  const decodedCombinedString = atob(encodedData);
  // Remove the salt from the beginning of the decoded string
  if (decodedCombinedString.startsWith(salt)) {
    return JSON.parse(decodedCombinedString.substring(salt.length));
  } else {
    console.error("Salt mismatch or data corruption.");
    return null;
  }
}

export function utf8ToBase64(str: string): string {
    // 1. Encode the string into UTF-8 using encodeURIComponent.
    // 2. Escape certain characters that get mistranslated by unescape (like '%')
    const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        // Convert URI escapes into their corresponding character codes
        return String.fromCharCode(parseInt(p1, 16));
    });

    // 3. Use the browser's native btoa function on the safe Latin1 string
    return btoa(utf8Bytes);
}