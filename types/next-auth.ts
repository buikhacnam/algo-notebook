import { User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

type UserId = string
type UserRole = 'admin' | 'user' | unknown
declare module 'next-auth/jwt' {
	interface JWT {
		id: UserId
	}
}

declare module 'next-auth' {
	interface Session {
		user: User & {
			id: UserId
			role: UserRole
		}
	}
}
