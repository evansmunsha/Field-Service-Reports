import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4 text-sm leading-relaxed">
      
      {/* Back to home */}
      <Link
        href="/"
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ← Back to home
      </Link>
      
      <h1 className="text-xl font-semibold">Privacy Policy</h1>

      <p>
        This application was created by <strong>Evans Munsha</strong> as a simple
        tool for tracking field service time and Bible studies.
      </p>

      <p>
        The goal of this app was never to compete with existing tools, but to
        build something that:
      </p>

      <ul className="list-disc pl-5 space-y-1">
        <li>Solves one clear problem well</li>
        <li>Matches the real workflow of field ministry</li>
        <li>Stays simple, distraction-free, and respectful</li>
      </ul>

      <p>
        After proving useful personally, it was shared publicly so others with
        the same need could benefit from it freely. Your privacy matters, and
        all data collected is only used to support the core features of the app.
      </p>

      <h2 className="text-base font-medium pt-4">Why data is collected</h2>
      <p>
        The app uses data solely to:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Calculate time accurately</li>
        <li>Keep personal ministry records organized</li>
        <li>Generate monthly summaries for reporting</li>
      </ul>

      <h2 className="text-base font-medium pt-4">What we don’t do</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>No ads</li>
        <li>No tracking across other websites</li>
        <li>No selling or sharing of personal data</li>
        <li>No marketing or profiling</li>
      </ul>

      <p>
        All your data stays with you. It exists only to support the app’s core
        features.
      </p>

      <p className="text-muted-foreground pt-6 text-base">
        This project is provided freely and in good faith.
      </p>
    </div>
  )
}
