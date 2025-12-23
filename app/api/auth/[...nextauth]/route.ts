//app/api/auth/[...nextauth].routes.ts

import { handlers } from "@/auth"
export const runtime = "nodejs"

export const { GET, POST } = handlers
