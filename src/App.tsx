import { useMemo, useState } from 'react'
import './App.css'

type WorkItem = {
  id: number
  title: string
  project: string
  owner: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Open' | 'Done'
  updated: string
}

type StatusFilter = 'All' | 'Open' | 'Done'

const initialItems: WorkItem[] = [
  { id: 1, title: 'Audit refresh-token rotation flow', project: 'Identity platform', owner: 'Maya Chen', priority: 'High', status: 'Open', updated: '12 min ago' },
  { id: 2, title: 'Add pagination to audit event endpoint', project: 'Developer API', owner: 'Noah Williams', priority: 'Medium', status: 'Open', updated: '48 min ago' },
  { id: 3, title: 'Document local environment variables', project: 'Web console', owner: 'Ari Patel', priority: 'Low', status: 'Done', updated: '2 hours ago' },
  { id: 4, title: 'Investigate elevated p95 on search', project: 'Search service', owner: 'Jordan Lee', priority: 'High', status: 'Open', updated: '3 hours ago' },
  { id: 5, title: 'Remove deprecated feature flag', project: 'Web console', owner: 'Maya Chen', priority: 'Low', status: 'Done', updated: 'Yesterday' },
]

function App() {
  const [items, setItems] = useState(initialItems)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newProject, setNewProject] = useState('Web console')

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return items.filter((item) => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      const matchesQuery = `${item.title} ${item.project} ${item.owner}`
        .toLowerCase()
        .includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [items, query, statusFilter])

  const openCount = items.filter((item) => item.status === 'Open').length
  const doneCount = items.length - openCount

  function toggleStatus(id: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Open' ? 'Done' : 'Open' }
          : item,
      ),
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#queue" aria-label="Waypoint home">
          <span className="brand-mark" aria-hidden="true">W</span>
          <span>WAYPOINT</span>
        </a>
        <div className="topbar-context">
          <span className="workspace-dot" />
          <span>Platform team</span>
          <span className="context-divider">/</span>
          <span className="muted">Engineering</span>
        </div>
        <button className="avatar" type="button" aria-label="Account: Sam Rivera">SR</button>
      </header>

      <div className="page-content" id="queue">
        <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>Work queue</strong></div>

        <section className="page-heading">
          <div>
            <p className="eyebrow">MONDAY, OCTOBER 12, 2026</p>
            <h1>Work queue</h1>
            <p className="subtitle">A clear view of what the team is moving forward.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setIsCreateDialogOpen(true)}>
            <span aria-hidden="true">+</span> New work item
          </button>
        </section>

        <section className="metrics" aria-label="Work item summary">
          <div className="metric metric-open">
            <span className="metric-label">OPEN ITEMS</span>
            <strong>{openCount.toString().padStart(2, '0')}</strong>
            <span className="metric-note"><span className="metric-dot" /> Needs attention</span>
          </div>
          <div className="metric metric-done">
            <span className="metric-label">COMPLETED</span>
            <strong>{doneCount.toString().padStart(2, '0')}</strong>
            <span className="metric-note">This week</span>
          </div>
          <div className="metric metric-total">
            <span className="metric-label">TOTAL TRACKED</span>
            <strong>{items.length.toString().padStart(2, '0')}</strong>
            <span className="metric-note">Across 3 projects</span>
          </div>
        </section>

        <section className="queue-panel" aria-labelledby="queue-title">
          <div className="queue-header">
            <div>
              <h2 id="queue-title">Team items</h2>
              <p>{visibleItems.length} items shown</p>
            </div>
            <label className="search-field">
              <span className="search-icon" aria-hidden="true" />
              <span className="visually-hidden">Search work items</span>
              <input
                type="search"
                placeholder="Search work items"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd>/</kbd>
            </label>
          </div>

          <div className="filter-row">
            <div className="filter-tabs" role="group" aria-label="Filter by status">
              {(['All', 'Open', 'Done'] as const).map((filter) => (
                <button
                  className={statusFilter === filter ? 'filter-tab active' : 'filter-tab'}
                  type="button"
                  key={filter}
                  aria-pressed={statusFilter === filter}
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter}
                  <span className="filter-count">
                    {filter === 'All' ? items.length : items.filter((item) => item.status === filter).length}
                  </span>
                </button>
              ))}
            </div>
            <span className="sort-label">Sorted by <strong>recently updated</strong></span>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th className="status-column"><span className="visually-hidden">Status</span></th>
                  <th>WORK ITEM</th>
                  <th>PROJECT</th>
                  <th>OWNER</th>
                  <th>PRIORITY</th>
                  <th>UPDATED</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr className={item.status === 'Done' ? 'is-done' : ''} key={item.id}>
                    <td className="status-column">
                      <button
                        className={item.status === 'Done' ? 'status-toggle checked' : 'status-toggle'}
                        type="button"
                        aria-label={`${item.status === 'Done' ? 'Reopen' : 'Complete'} ${item.title}`}
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.status === 'Done' && <span aria-hidden="true">✓</span>}
                      </button>
                    </td>
                    <td className="item-title">{item.title}</td>
                    <td className="project-name">{item.project}</td>
                    <td><span className="owner-avatar">{item.owner.split(' ').map((part) => part[0]).join('')}</span>{item.owner}</td>
                    <td><span className={`priority priority-${item.priority.toLowerCase()}`}><span />{item.priority}</span></td>
                    <td className="updated-cell">{item.updated}</td>
                  </tr>
                ))}
                {visibleItems.length === 0 && (
                  <tr>
                    <td className="empty-state" colSpan={6}>No work items match this view.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <footer className="queue-footer">
            <span>Showing <strong>{visibleItems.length}</strong> of <strong>{items.length}</strong> work items</span>
            <span className="sync-status"><span /> All changes saved</span>
          </footer>
        </section>
        {isCreateDialogOpen && (
          <div className="dialog-backdrop">
            <section className="create-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
              <div className="dialog-heading">
                <div>
                  <p className="eyebrow">TEAM WORK QUEUE</p>
                  <h2 id="dialog-title">New work item</h2>
                </div>
                <button className="dialog-close" type="button" aria-label="Close dialog" onClick={() => setIsCreateDialogOpen(false)}>×</button>
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  setItems((currentItems) => [...currentItems, {
                    id: Date.now(),
                    title: newTitle,
                    project: newProject,
                    owner: 'Sam Rivera',
                    priority: 'Medium',
                    status: 'Open',
                    updated: 'Just now',
                  }])
                  setNewTitle('')
                  setNewProject('Web console')
                  setIsCreateDialogOpen(false)
                }}
              >
                <label className="form-field">
                  <span>Title</span>
                  <input autoFocus required value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="What needs to get done?" />
                </label>
                <label className="form-field">
                  <span>Project</span>
                  <select value={newProject} onChange={(event) => setNewProject(event.target.value)}>
                    <option>Web console</option>
                    <option>Developer API</option>
                    <option>Identity platform</option>
                    <option>Search service</option>
                  </select>
                </label>
                <div className="dialog-actions">
                  <button className="secondary-button" type="button" onClick={() => setIsCreateDialogOpen(false)}>Cancel</button>
                  <button className="primary-button" type="submit">Create item</button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
      <footer className="app-footer"><span>WAYPOINT</span><span>Internal tools · v1.8.2</span></footer>
    </main>
  )
}

export default App
