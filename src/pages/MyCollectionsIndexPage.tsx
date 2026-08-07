import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserCollections, createUserCollection, renameUserCollection, deleteUserCollection } from '../lib/userCollections'
import { getCake } from '../lib/data'
import { CakeHeroImage } from '../components/CakeHeroImage'
import './MyCollectionsIndexPage.css'

export function MyCollectionsIndexPage() {
  const [collections, setCollections] = useState(() => getUserCollections())
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  function handleCreate() {
    const name = newName.trim()
    if (!name) return
    createUserCollection(name)
    setNewName('')
    setCollections(getUserCollections())
  }

  function startEdit(id: string, currentName: string) {
    setEditingId(id)
    setEditingName(currentName)
  }

  function commitEdit() {
    if (editingId && editingName.trim()) {
      renameUserCollection(editingId, editingName.trim())
    }
    setEditingId(null)
    setCollections(getUserCollections())
  }

  function handleDelete(id: string) {
    deleteUserCollection(id)
    setCollections(getUserCollections())
  }

  return (
    <main className="page my-collections-index-page">
      <h1>My Collections</h1>
      <p>Organize your favorite cakes into your own named collections — stored right in your browser.</p>

      <div className="my-collections-create">
        <input
          type="text"
          placeholder="New collection name (e.g. Wedding Inspiration)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button className="btn" onClick={handleCreate} disabled={!newName.trim()}>
          + Create Collection
        </button>
      </div>

      {collections.length === 0 && (
        <p className="my-collections-empty">
          No collections yet — create one above, or add a cake to a collection from its encyclopedia entry.
        </p>
      )}

      <div className="my-collections-grid">
        {collections.map((c) => {
          const coverCake = c.cakeIds[0] ? getCake(c.cakeIds[0]) : undefined
          return (
            <div key={c.id} className="card my-collections-card">
              {coverCake && <CakeHeroImage cakeId={coverCake.id} variant="thumbnail" alt={c.name} />}
              {editingId === c.id ? (
                <input
                  className="my-collections-rename-input"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
                  onBlur={commitEdit}
                  autoFocus
                />
              ) : (
                <h3 onClick={() => startEdit(c.id, c.name)} className="my-collections-name">
                  {c.name}
                </h3>
              )}
              <p>
                {c.cakeIds.length} {c.cakeIds.length === 1 ? 'cake' : 'cakes'}
              </p>
              <div className="my-collections-card-actions">
                <Link to={`/my-collections/${c.id}`} className="btn btn-secondary">
                  Open
                </Link>
                <button className="btn btn-secondary my-collections-delete" onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
