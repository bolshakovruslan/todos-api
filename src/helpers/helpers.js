import jwt from 'jsonwebtoken'

export const jwtDecode = (headers) => {
    return jwt.decode(headers.authorization.split(' ')[1])
}