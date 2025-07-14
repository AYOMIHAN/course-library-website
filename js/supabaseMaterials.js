// supabaseMaterials.js — final stable version
// -----------------------------------------------------------------------------
// 1. createClient FIRST, then everything runs *after* that inside an async init()
// 2. exposes window.supabase for debugging, remove later if desired
// 3. auto‑discovers departments and populates global arrays expected by scripts.js
// -----------------------------------------------------------------------------

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// === CONFIG ==================================================================
const supabaseUrl = 'https://ujzirkjogyiebbqqqsih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemlya2pvZ3lpZWJicXFxc2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTY1NjYsImV4cCI6MjA2ODAzMjU2Nn0.klMILb_O5g0ZiH0DxMYZoYJIFLJnU8GUmk4I7A_lOhQ';  // <<< REPLACE, keep on one line
const bucket      = 'resources';

// === CLIENT (must exist before any use) ======================================
const supabase = createClient(supabaseUrl, supabaseKey);
window.supabase = supabase;  // comment out when done debugging

// === MAIN ====================================================================
(async function initMaterials () {
  try {
    // 1. List ALL top‑level folders (departments)
    const { data: rootFolders, error: listErr } = await supabase
      .storage
      .from(bucket)
      .list('', { limit: 1000 });

    if (listErr) throw listErr;
    if (!rootFolders.length) {
      console.warn('[Supabase] No folders found in bucket');
      return;
    }

    // Filter to folder objects only (skip files in root if any)
    const departments = rootFolders
      .filter(obj => obj.id === undefined && obj.name)  // name present, no id => folder
      .map(obj => obj.name);

    // 2. Build array of material objects
    const materials = [];

    for (const dept of departments) {
      // Depth‑first: level/semester folders
      const { data: levelFolders } = await supabase
        .storage
        .from(bucket)
        .list(`${dept}`, { limit: 20 });

      for (const lvl of levelFolders.filter(f => f.name)) {
        const { data: semFolders } = await supabase
          .storage
          .from(bucket)
          .list(`${dept}/${lvl.name}`, { limit: 10 });

        for (const sem of semFolders.filter(f => f.name)) {
          const { data: files } = await supabase
            .storage
            .from(bucket)
            .list(`${dept}/${lvl.name}/${sem.name}`, { limit: 5000 });

          for (const file of files.filter(f => f.name.endsWith('.pdf'))) {
            const path = `${dept}/${lvl.name}/${sem.name}/${file.name}`;
            const { data: urlObj } = supabase
              .storage
              .from(bucket)
              .getPublicUrl(path);

            const [courseCode, ...titleParts] = file.name.replace('.pdf','').split('-');
            materials.push({
              department : dept,
              level      : lvl.name,
              semester   : sem.name,
              courseCode,
              title      : titleParts.join(' ').replace(/-/g,' '),
              url        : urlObj.publicUrl + '?download'
            });
          }
        }
      }
    }

    // 3. Overwrite globals for scripts.js
    window.courseMaterials    = materials;
    window.allDepartmentsData = departments.map(d => ({ name: d }));

    console.log(`[Supabase] Loaded ${materials.length} materials across ${departments.length} departments`);

    // 4. Fire render functions if present
    if (window.renderHome)    window.renderHome();
    if (window.renderLibrary) window.renderLibrary();
  }
  catch (err) {
    console.error('[Supabase] integration failed:', err);
  }
})();
