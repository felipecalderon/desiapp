import { url } from "@/config/constants"

export const fetchData = async (path: string) => {
    try {
      const response = await fetch(`${url.backend}/${path}`)
      const data = await response.json()
      if(data) return data
      return null
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }