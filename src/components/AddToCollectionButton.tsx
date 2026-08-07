import { useState } from 'react'
import { getUserCollections, createUserCollection, addCakeToCollection, removeCakeFromCollection } from '../lib/userCollections'
import './AddToCollectionButton.css'

export function AddToCollectionButton({ cakeId }: { cakeId: string }) {
  const [open, setOpen] = useState(false)
  const [collections, setCollections] = useState(() => getUserCollections())
  const [newName, setNewName] = useState('')

  function toggle(collectionId: string, currentlyIn: boolean) {
    if (currentlyIn) {
      removeCakeFromCollection(collectionId, cakeId)
    } else {
      addCakeToCollection(collectionId, cakeId)
    }
    setCollections(getUserCollections())
  }

  function handleCreate() {
    const name = newName.trim()
    if (!name) return
    const collection = createUserCollection(name)
    addCakeToCollection(collection.id, cakeId)
    setNewName('')
    setCollections(getUserCollections())
  }

  return (
    <div className="add-to-collection">
      <button className="btn btn-secondary" onClick={() => setOpen(!open)}>
        📁 Add to Collection
      </button>

      {open && (
        <div className="add-to-collection-menu card">
          {collections.length === 0 && <p className="add-to-collection-empty">No collections yet.</p>}
          {collections.map((c) => {
            const currentlyIn = c.cakeIds.includes(cakeId)
            return (
              <label key={c.id} className="add-to-collection-item">
                <input type="checkbox" checked={currentlyIn} onChange={() => toggle(c.id, currentlyIn)} />
                {c.name}
              </label>
            )
          })}
          <div className="add-to-collection-new">
            <input
              type="text"
              placeholder="New collection name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button className="btn" onClick={handleCreate} disabled={!newName.trim()}>
              + Create
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
