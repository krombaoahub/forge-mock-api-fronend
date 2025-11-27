import { faker } from '@faker-js/faker';
import { type DocumentData } from 'firebase/firestore';
import { admin } from '../imports';

export const isEmpty = (obj: object | undefined) => {
  if (!obj) return
  // Object.keys() returns an array of an object's own enumerable property names
  return Object.keys(obj).length === 0;
}
// collection data timestamp
export const timestamp = {
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
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

