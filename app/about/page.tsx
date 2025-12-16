import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4 text-sm leading-relaxed">
      
      {/* Back to home */}
      <Link
        href="/"
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ← Back to home
      </Link>

      <h1 className="text-xl font-semibold">About This App</h1>

      <p>
        This app was built to solve a real, everyday problem.
      </p>

      <p>
        While participating in field ministry, time was recorded manually using
        a notebook. Calculating hours from multiple start and end times each
        month became difficult and time-consuming.
      </p>

      <p>
        The goal was never to compete with existing apps, but to build something
        that:
      </p>

      <ul className="list-disc pl-5 space-y-1">
        <li>Solves one clear problem well</li>
        <li>Matches the real workflow of field ministry</li>
        <li>Stays simple, distraction-free, and respectful</li>
      </ul>

      <p>
        After proving useful in daily use, it was shared publicly so others with
        the same need could benefit from it freely.
      </p>

      <h2 className="text-base font-medium pt-4">Why it exists</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>To calculate time accurately</li>
        <li>To keep records organized</li>
        <li>To generate clear monthly reports</li>
        <li>To stay focused and uncomplicated</li>
      </ul>

      <p className="pt-4">
        Created and maintained by <strong>Evans Munsha</strong>.
      </p>
    </div>
  )
}
