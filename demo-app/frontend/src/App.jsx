import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [info, setInfo]     = useState(null)
  const [todos, setTodos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, todosRes] = await Promise.all([
          fetch(`${API_URL}/api/info`),
          fetch(`${API_URL}/api/todos`),
        ])
        const infoData  = await infoRes.json()
        const todosData = await todosRes.json()
        setInfo(infoData)
        setTodos(todosData)
      } catch (err) {
        setError('Cannot connect to backend. Is it running?')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000) // refresh every 5s
    return () => clearInterval(interval)
  }, [])

  const done  = todos.filter(t => t.done).length
  const total = todos.length
  const pct   = total ? Math.round((done / total) * 100) : 0

  return (
    <div className="app">
      <header className="header">
        <div className="logo">⎈ K8S DEMO</div>
        <div className="badge">MINIKUBE · DEV</div>
      </header>

      <main className="main">
        {/* Hero */}
        <section className="hero">
          <h1 className="hero-title">
            Kubernetes<br />
            <span className="accent">Deployment</span><br />
            Workflow
          </h1>
          <p className="hero-sub">React + Node + Docker + Minikube</p>
        </section>

        {/* Backend Info Card */}
        <section className="card">
          <div className="card-header">
            <span className="dot green" />
            BACKEND CONNECTION
          </div>
          {loading && <div className="status-row"><span className="spinner" /> Connecting...</div>}
          {error   && <div className="status-row error">⚠ {error}</div>}
          {info && (
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">POD / HOSTNAME</div>
                <div className="info-value accent">{info.hostname}</div>
              </div>
              <div className="info-item">
                <div className="info-label">ENVIRONMENT</div>
                <div className="info-value">{info.environment}</div>
              </div>
              <div className="info-item">
                <div className="info-label">NODE VERSION</div>
                <div className="info-value">{info.nodeVersion}</div>
              </div>
              <div className="info-item">
                <div className="info-label">UPTIME</div>
                <div className="info-value">{info.uptime}s</div>
              </div>
              <div className="info-item full">
                <div className="info-label">LAST SEEN</div>
                <div className="info-value small">{info.timestamp}</div>
              </div>
            </div>
          )}
        </section>

        {/* Progress */}
        <section className="card">
          <div className="card-header">
            <span className="dot yellow" />
            DEPLOYMENT CHECKLIST — {done}/{total} DONE
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-label">{pct}% COMPLETE</div>
          <ul className="todo-list">
            {todos.map(t => (
              <li key={t.id} className={`todo-item ${t.done ? 'done' : ''}`}>
                <span className="todo-icon">{t.done ? '✓' : '○'}</span>
                {t.task}
              </li>
            ))}
          </ul>
        </section>

        {/* Architecture */}
        <section className="card">
          <div className="card-header">
            <span className="dot blue" />
            CLUSTER ARCHITECTURE
          </div>
          <div className="arch">
            <div className="arch-box control">Control Plane</div>
            <div className="arch-line">↕</div>
            <div className="arch-row">
              <div className="arch-box worker">
                Worker Node
                <div className="arch-pods">
                  <div className="pod">frontend pod</div>
                  <div className="pod">backend pod</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        Auto-refreshes every 5s · Pod: {info?.hostname || '—'}
      </footer>
    </div>
  )
}

export default App
