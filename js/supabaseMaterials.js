// supabaseMaterials.js  — v2 (2025‑07‑14)
// -----------------------------------------------------------------------------
// Re‑implements the Supabase fetcher with three fixes:
//   1.  createClient declared before first use (avoids ReferenceError)
//   2.  auto‑discovers departments (no hard‑coded list)
//   3.  removes stray call to folderHasContent (now integrated directly)
// -----------------------------------------------------------------------------

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ‑‑‑ CONFIG ‑‑‑ -----------------------------------------------------------------
const supabaseUrl = 'https://ujzirkjogyiebbqqqsih.supabase.co';
// Note: replace the key below with your own Supabase project's anon key
const supabaseKey = '<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemlya2pvZ3lpZWJicXFxc2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MjI3MjksImV4cCI6MjA2Nzk5ODcyOX0.cqh9gOiu51F7pcyj1kl8SU9w4uAgllVnPKDziu2k1xQ';                             //  ← replace
const bucket      = 'resources';                                  //  public bucket
const supabase    = createClient(supabaseUrl, supabaseKey);
// ------------------------------------------------------------------------------

// Helpers -----------------------------------------------------------------------
function titleFromFileName(name) {
  return name
    .replace(/\.[^.]+$/, '')    // strip extension
    .replace(/^[A-Za-z]{3,}[0-9]{3,}-/, '') // drop leading course‑code prefix if present
    .replace(/-/g, ' ')          // dashes → spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalise words
}

function courseCodeFromFileName(name) {
  const match = /^[A-Za-z]{2,}[0-9]{3,}/.exec(name);
  return match ? match[0].toUpperCase() : '';
}

// Fetch all top‑level folders (departments) -------------------------------------
async function listDepartments() {
  const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1000 });
  if (error) throw error;
  return data.filter(i => i.name && i.metadata?.eTag === undefined).map(i => i.name);
}

// Fetch materials for a single department ---------------------------------------
async function listMaterialsForDept(dept) {
  const { data, error } = await supabase.storage.from(bucket).list(`${dept}`, { limit: 200, depth: 3 });
  if (error) throw error;

  const materials = [];
  for (const item of data) {
    if (item.metadata?.eTag) {                  // it is a file, not folder
      const publicUrl = supabase.storage.from(bucket).getPublicUrl(`${dept}/${item.name}`).data.publicUrl;
      const parts = item.name.split('/');       // e.g. 100/1/COURSE101-intro.pdf
      if (parts.length < 3) continue;           // need level/semester/file
      const [ level, semester, filename ] = parts;

      materials.push({
        department : dept,
        level,
        semester,
        courseCode : courseCodeFromFileName(filename),
        title      : titleFromFileName(filename),
        url        : publicUrl + '?download'
      });
    }
  }
  return materials;
}

// Initialise --------------------------------------------------------------------
(async function initSupabaseMaterials() {
  try {
    const departments  = await listDepartments();
    const allMaterials = [];

    // Collect materials per department
    for (const dept of departments) {
      const items = await listMaterialsForDept(dept);
      allMaterials.push(...items);
    }

    // Update global arrays for legacy scripts.js
    window.courseMaterials      = allMaterials;                // full list
    window.allDepartmentsData   = departments.map(d => ({ name: d }));

    // Render pages if functions exist
    if (typeof window.populateFilterOptions === 'function') window.populateFilterOptions();
    if (typeof window.renderHome            === 'function') window.renderHome();
    if (typeof window.renderLibrary         === 'function') window.renderLibrary();

  } catch (err) {
    console.error('Supabase integration failed:', err);
  }
})();
