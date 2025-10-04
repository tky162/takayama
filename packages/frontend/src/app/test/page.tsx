import Link from 'next/link'

export default function TestPage() {
  return (
    <div style={{ padding: '20px', background: 'yellow', color: 'black' }}>
      <h1>🔧 Test Page - Version Check</h1>
      <p>Current time: {new Date().toISOString()}</p>
      <p>This is a simple test page to verify deployment</p>
      <Link href="/">← Back to Home</Link>
    </div>
  )
}
