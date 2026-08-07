import type { UserCollection } from '../types/userCollection'

const USER_COLLECTIONS_KEY = 'userCollections'

function readAll(): UserCollection[] {
  try {
    return JSON.parse(localStorage.getItem(USER_COLLECTIONS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeAll(collections: UserCollection[]): void {
  localStorage.setItem(USER_COLLECTIONS_KEY, JSON.stringify(collections))
}

export function getUserCollections(): UserCollection[] {
  return readAll().sort((a, b) => b.createdAt - a.createdAt)
}

export function getUserCollection(id: string): UserCollection | undefined {
  return readAll().find((c) => c.id === id)
}

export function createUserCollection(name: string): UserCollection {
  const collection: UserCollection = { id: crypto.randomUUID(), name, cakeIds: [], createdAt: Date.now() }
  writeAll([...readAll(), collection])
  return collection
}

export function renameUserCollection(id: string, name: string): void {
  writeAll(readAll().map((c) => (c.id === id ? { ...c, name } : c)))
}

export function updateUserCollectionNote(id: string, note: string): void {
  writeAll(readAll().map((c) => (c.id === id ? { ...c, note } : c)))
}

export function deleteUserCollection(id: string): void {
  writeAll(readAll().filter((c) => c.id !== id))
}

export function addCakeToCollection(collectionId: string, cakeId: string): void {
  writeAll(
    readAll().map((c) => (c.id === collectionId && !c.cakeIds.includes(cakeId) ? { ...c, cakeIds: [...c.cakeIds, cakeId] } : c)),
  )
}

export function removeCakeFromCollection(collectionId: string, cakeId: string): void {
  writeAll(readAll().map((c) => (c.id === collectionId ? { ...c, cakeIds: c.cakeIds.filter((id) => id !== cakeId) } : c)))
}
