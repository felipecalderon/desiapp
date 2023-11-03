import { decode } from 'jsonwebtoken'

export const decodeJWT = (token: string) => {
    const decodeToken = decode(token)
    return decodeToken
}

export const isTokenExpired = (exp: number): boolean => {
    const currentTimestamp = Math.floor(Date.now() / 1000) // Convierte la fecha actual a Unix timestamp en segundos.
    return exp < currentTimestamp
  }