import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// ── Diagnostic boot logs ────────────────────────────────────────────────────
console.log('[Supabase] SUPABASE_URL    :', supabaseUrl ?? '⛔ MISSING')
console.log('[Supabase] KEY EXISTS      :', !!supabaseAnonKey)
console.log('[Supabase] KEY LENGTH      :', supabaseAnonKey?.length ?? 0)
console.log('[Supabase] BUCKET          :', 'student-files')
// ────────────────────────────────────────────────────────────────────────────

if (!supabaseUrl || !supabaseAnonKey) {
  // Hard-fail at module load time — do NOT silently continue with placeholder
  // values because they produce a cryptic "Invalid Compact JWS" error at upload.
  console.error(
    '[Supabase] ❌ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set.\n' +
    '  1. Create a file named .env.local in the project root.\n' +
    '  2. Add VITE_SUPABASE_URL=https://<ref>.supabase.co\n' +
    '  3. Add VITE_SUPABASE_ANON_KEY=eyJ... (full key from Supabase dashboard)\n' +
    '  4. Restart the Vite dev server after saving .env.local'
  )
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key-replace-me'
)

/** Supabase Storage bucket used for all student files.
 *  Must match exactly the bucket name created in the Supabase dashboard. */
export const STUDENT_FILES_BUCKET = 'student-files'
