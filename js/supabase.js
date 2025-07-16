// js/supabase.js

// IMPORTANT: Replace with your actual Supabase Project URL and Anon Key
const SUPABASE_URL = 'https://ujzirkjogyiebbqqqsih.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemlya2pvZ3lpZWJicXFxc2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTY1NjYsImV4cCI6MjA2ODAzMjU2Nn0.klMILb_O5g0ZiH0DxMYZoYJIFLJnU8GUmk4I7A_lOhQ';

let supabase = null; // Supabase client instance

/**
 * Initializes the Supabase client.
 * @returns {boolean} True if initialized successfully, false otherwise.
 */
export function initializeSupabase() {
    try {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
            console.error("Supabase credentials missing or invalid. Please update SUPABASE_URL and SUPABASE_ANON_KEY in js/supabase.js.");
            return false;
        }

        if (typeof window.supabase === 'undefined') {
            console.error("Supabase library not loaded. Ensure <script src=\"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2\"></script> is in your HTML <head>.");
            return false;
        }

        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase client initialized successfully.");
        return true;
    } catch (error) {
        console.error("Error initializing Supabase client:", error);
        return false;
    }
}

/**
 * Fetches course materials from the specified table.
 * @param {string} tableName The name of the table to fetch from.
 * @returns {Array} An array of material objects, or an empty array on error.
 */
export async function getMaterialsFromSupabase(tableName = 'course_materials') {
    console.log(`Attempting to fetch materials from Supabase table: ${tableName}`);
    if (!supabase) {
        console.error("Supabase client not initialized. Cannot fetch materials.");
        return [];
    }

    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*');

        if (error) {
            console.error(`Error fetching materials from ${tableName}:`, error.message);
            return [];
        }

        console.log(`Materials fetched successfully from ${tableName}:`, data);
        return data || [];
    } catch (error) {
        console.error(`Unexpected error fetching materials from ${tableName}:`, error);
        return [];
    }
}

/**
 * Creates a signed URL for downloading a file from Supabase Storage.
 * @param {string} bucketName The storage bucket name.
 * @param {string} filePathInBucket The path to the file within the bucket.
 * @returns {string|null} The signed URL, or null if an error occurs.
 */
export async function getSupabaseDownloadUrl(bucketName, filePathInBucket) {
    console.log('--- Debugging getSupabaseDownloadUrl ---');
    console.log('Bucket:', bucketName);
    console.log('File Path:', filePathInBucket);
    console.log('Type of filePathInBucket:', typeof filePathInBucket);
    console.log('Is Supabase client initialized?', !!supabase);

    if (!supabase) {
        console.error("Supabase client is not initialized in getSupabaseDownloadUrl.");
        return null;
    }

    if (!bucketName || typeof bucketName !== 'string' || bucketName.trim() === '') {
        console.error("Invalid bucketName provided:", bucketName);
        return null;
    }

    if (!filePathInBucket || typeof filePathInBucket !== 'string' || filePathInBucket.trim() === '') {
        console.error("Invalid filePathInBucket provided: It is empty or not a string.", filePathInBucket);
        return null;
    }

    // Ensure the file path looks like a valid file (e.g., has an extension)
    if (!filePathInBucket.includes('.')) {
        console.error("Invalid filePathInBucket: Path does not appear to be a file (missing extension).", filePathInBucket);
        return null;
    }

    // Remove leading/trailing slashes and normalize path
    const normalizedPath = filePathInBucket.trim().replace(/^\//, '').replace(/\/$/, '');

    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(normalizedPath, 60, { download: true }); // 60-second expiration

        if (error) {
            console.error('Error creating signed download URL:', error.message);
            console.error('Failed path:', normalizedPath);
            return null;
        }

        if (data && data.signedUrl) {
            console.log('Successfully created signed URL for:', normalizedPath);
            return data.signedUrl;
        }

        console.warn('No signedUrl returned from Supabase for path:', normalizedPath);
        return null;
    } catch (error) {
        console.error('Unexpected error in getSupabaseDownloadUrl:', error);
        return null;
    }
}