// supabaseMaterials.js
// -----------------------------------------------------------------------------
// This module fetches course‑material objects stored in Supabase Storage and
// then patches the existing UI (rendered by scripts.js) so that only
// departments/courses that actually have files are displayed.
// -----------------------------------------------------------------------------

// 1️⃣  Replace these two constants with **your** project credentials
const SUPABASE_URL = 'https://ujzirkjogyiebbqqqsih.supabase.co';
const SUPABASE_PUBLIC_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemlya2pvZ3lpZWJicXFxc2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MjI3MjksImV4cCI6MjA2Nzk5ODcyOX0.cqh9gOiu51F7pcyj1kl8SU9w4uAgllVnPKDziu2k1xQ';

// 2️⃣  Name of the bucket where you upload PDFs (must be PUBLIC)
const BUCKET = 'resources';
//     ⚠️ Make sure this matches the bucket name in your Supabase project.

// 3️⃣  List every department folder *exactly* as you create them in Supabase.
//     ⚠️ Do NOT change the casing later – folder names are case‑sensitive.
//     If you want to drive the list entirely from Supabase later, you can
//     query for prefixes, but keeping an explicit list means you still get
//     nice icons & descriptions from scripts.js.
// NEW: grab every top‑level folder automatically
const { data: rootFolders } = await supabase
  .storage
  .from(bucket)
  .list('', { limit: 1000 });

const DEPARTMENTS = rootFolders
  .filter(item => item.name && item.metadata?.eTag === undefined) // keep folders only
  .map(item => item.name);                                        // ["Industrial Design", "Ceramics", ...]


// -----------------------------------------------------------------------------
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_ANON_KEY);

/**
 * Returns true if the folder contains at least one object (file or subfolder).
 */
async function folderHasContent(folder) {
  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .list(folder, { limit: 1 }); // only need to know if there is *something*

  if (error) {
    console.warn(`Supabase list error for ${folder}:`, error.message);
    return false;
  }
  return Array.isArray(data) && data.length > 0;
}

/**
 * Initialise the homepage: keeps only those department cards that have files.
 * Assumes scripts.js has already built the grid.
 */
async function pruneEmptyDepartmentCards() {
  const grid = document.querySelector('.department-grid');
  if (!grid) return;

  // Wait for the existing cards to be injected by scripts.js
  await new Promise(r => setTimeout(r, 0));

  const cards = Array.from(grid.children);
  await Promise.all(cards.map(async card => {
    const deptName = card.querySelector('h3')?.textContent?.trim();
    if (!deptName) return;
    const has = await folderHasContent(deptName);
    if (!has) card.remove();
  }));

  // Hide the "Load More" button if nothing left to load
  const loadMoreBtn = document.getElementById('load-more-departments');
  if (loadMoreBtn && grid.children.length <= 6) loadMoreBtn.style.display = 'none';
}

/**
 * Builds the courseMaterials array from Supabase instead of hard‑coded data.
 * Each object matches the interface used in scripts.js.
 */
async function fetchCourseMaterials() {
  const result = [];
  for (const dept of DEPARTMENTS) {
    const { data, error } = await supabase
      .storage
      .from(BUCKET)
      .list(dept, { limit: 1000 });

    if (error) {
      console.error(`Error listing ${dept}:`, error.message);
      continue;
    }

    for (const item of data) {
      if (item.name.endsWith('.pdf')) {
        const id = item.name.replace(/\.pdf$/i, '').toUpperCase();
        result.push({
          id,
          title: id, // You can improve this by naming files nicer or storing metadata
          department: dept,
          semester: 'Unknown Semester', // change if you encode in filename
          level: 'Unknown Level',
          downloadLink: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(dept)}/${encodeURIComponent(item.name)}`
        });
      }
    }
  }
  return result;
}

/**
 * Replaces the global courseMaterials array (defined in scripts.js) with live
 * data, then refreshes the grid & filters on all‑materials.html.
 */
async function hydrateMaterialsPage() {
  if (!window.location.pathname.includes('all-materials.html')) return;

  const materials = await fetchCourseMaterials();
  window.courseMaterials = materials; // expose to scripts.js filters

  // Scripts.js hooks the display logic to the change listeners; simply fire
  // an artificial event to trigger re‑render.
  const searchInput = document.getElementById('materials-search-input');
  if (searchInput) searchInput.dispatchEvent(new Event('keyup'));
}

// -----------------------------------------------------------------------------
// Kick off once DOM & scripts.js have loaded.
// We poll for the presence of initializePageFeatures() flag to guarantee order.
// -----------------------------------------------------------------------------
(async () => {
  // Wait until scripts.js has run and window.__scrollHandlerInitialized exists
  while (typeof window.__scrollHandlerInitialized === 'undefined') {
    await new Promise(r => setTimeout(r, 50));
  }

  try {
    await pruneEmptyDepartmentCards();
    await hydrateMaterialsPage();
  } catch (err) {
    console.error('Supabase integration failed:', err);
  }
})();
