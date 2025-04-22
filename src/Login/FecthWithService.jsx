// src/pages/SomeProtectedPage.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export default function SomeProtectedPage() {
  const { authFetch, loading } = useAuth()
  const [data, setData]        = useState(null)

  useEffect(() => {
    if (loading) return
    (async () => {
      try {
        const res = await authFetch('http://localhost/api/protected/data')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [loading, authFetch])

  if (loading) return <div>Loading auth…</div>
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
