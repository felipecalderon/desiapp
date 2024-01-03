'use server'
import { url } from "@/config/constants"

export const fetchData = async (path: string) => {
    try {
      const response = await fetch(`${url.backend}/${path}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      if(data) return data
      return null
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  export const fetchPost = async (path: string, body: object) => {
    try {;
      const response = await fetch(`${url.backend}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store'
      })
      const data = await response.json()
      if(data) return data
      return null
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

export const fetchUpdate = async (path: string, body: object) => {
  try {;
    const response = await fetch(`${url.backend}/${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    })
    const data = await response.json()
    if(data) return data
    return null
  } catch (error) {
    console.error('Error fetching:', error)
  }
}

export const fetchDelete = async (path: string) => {
  try {;
    const response = await fetch(`${url.backend}/${path}`, {
      method: 'DELETE',
      cache: 'no-store'
    })
    const data = await response.json()
    if(data) return data
    return null
  } catch (error) {
    console.error('Error fetching:', error)
  }
}