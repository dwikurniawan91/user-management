import type { User } from "@/stores/userStore"

export interface FetchUsersClient {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
}

const DEFAULT_CLIENT: FetchUsersClient = {
  fetch: globalThis.fetch.bind(globalThis),
}

const API = import.meta.env.VITE_API_URL

export type UserWithoutAvatar = Omit<User, "avatar">

export async function fetchUsersFromApi(
  client: FetchUsersClient = DEFAULT_CLIENT,
  apiUrl: string = API,
): Promise<UserWithoutAvatar[]> {
  const response = await client.fetch(apiUrl)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  const data: UserWithoutAvatar[] = await response.json()
  return data
}

export function assignRandomAvatar(user: UserWithoutAvatar): User {
  const randomId = Math.floor(Math.random() * 70) + 1
  return {
    ...user,
    avatar: `https://i.pravatar.cc/150?img=${randomId}`,
  }
}
