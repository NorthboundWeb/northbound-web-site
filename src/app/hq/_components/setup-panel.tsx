import { Panel } from './ui'

/** Shown wherever a feature needs the register's database and it is not set up yet. */
export function StorageSetup() {
  return (
    <Panel title="Connect storage">
      <p className="mb-4 text-sm text-chalk-muted">
        The register keeps its data in a Supabase project of its own. It is a few minutes of setup, once:
      </p>
      <ol className="list-decimal space-y-3 pl-5 text-sm text-chalk-muted">
        <li>
          Create a new Supabase project for Northbound (keep it separate from any other project).
        </li>
        <li>
          Open <strong className="text-chalk">SQL Editor</strong>, paste in the contents of{' '}
          <code>supabase/migrations/20261018000000_hq_clients.sql</code> from the repo, and run it.
        </li>
        <li>
          In Vercel, open <strong className="text-chalk">Project → Settings → Environment Variables</strong> and
          add <code>HQ_SUPABASE_URL</code> (Supabase → Project Settings → API → Project URL) and{' '}
          <code>HQ_SUPABASE_SERVICE_KEY</code> (the <em>service_role</em> key from the same page).
        </li>
        <li>Redeploy so the new variables are picked up.</li>
      </ol>
      <p className="mt-4 text-sm text-chalk-faint">
        The service key stays on the server and is never sent to the browser. The table has Row Level
        Security on with no public access, so the public key cannot read it.
      </p>
    </Panel>
  )
}
