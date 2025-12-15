// app/handler/[...stack]/page.tsx
import { StackHandler } from "@stackframe/stack"

export default function Page(props: {
  params: { stack: string[] }
}) {
  return <StackHandler {...props} fullPage />
}
