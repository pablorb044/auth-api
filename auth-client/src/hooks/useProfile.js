import { useEffect, useRef, useState } from 'react'
import { updateProfile } from '../services/auth.api'

export function useProfile(updateUser) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const successTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  const update = async (data) => {
    if (saving) return false

    try {
      setError('')
      setSuccess('')
      setSaving(true)

      const updatedUser = await updateProfile(data)

      updateUser(updatedUser)
      setSuccess('Profile updated successfully')

      successTimeoutRef.current = setTimeout(() => {
        setSuccess('')
      }, 3000)

      return true
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Error al actualizar el perfil'
      )

      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    update,
    saving,
    error,
    success
  }
}