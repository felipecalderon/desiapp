import { JwtPayload, decode } from 'jsonwebtoken'

export const decodeJWT = (token: string) => {
    try {        
        const decodeToken = decode(token)
        return decodeToken as JwtPayload
    } catch (error) {
        console.error('Error decodificando el token', error);
        return null
    }
}

export const isTokenExpired = (token: string): boolean => {
    if(!token) return false
    const decodeToken = decodeJWT(token)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if(!decodeToken?.exp) return false
    return decodeToken?.exp < currentTimestamp
  }