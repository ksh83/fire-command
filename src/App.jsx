import { useState, useEffect } from 'react'
import RoleSelect from './screens/RoleSelect'
import Dashboard from './screens/Dashboard'

const ROLE_KEY = 'firecommand_role'

export default function App() {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(ROLE_KEY)
    if (saved) setRole(saved)
    setLoading(false)
  }, [])

  const handleSelect = (selectedRole) => {
    localStorage.setItem(ROLE_KEY, selectedRole)
    setRole(selectedRole)
  }

  if (loading) return null

  if (!role) return <RoleSelect onSelect={handleSelect} />

  return <Dashboard role={role} />
}
