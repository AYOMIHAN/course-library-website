// js/scripts.js

// --- Supabase Imports ---
import { initializeSupabase, getMaterialsFromSupabase, getSupabaseDownloadUrl } from './supabase.js';

// --- Global Supabase Constants ---
const SUPABASE_MATERIALS_TABLE = 'course_materials';
const SUPABASE_PAST_QUESTIONS_TABLE = 'past_questions';
const SUPABASE_STORAGE_BUCKET = 'materials';

// --- Supabase Client Initialization ---
let isSupabaseInitialized = initializeSupabase();

if (!isSupabaseInitialized) {
    console.error("Supabase client failed to initialize. Data will not load. Ensure your keys are correct in 'js/supabase.js'.");
}






// --- Access Gatekeeping (Basic JS Check) ---
// This function checks if the user has "authenticated" via the login-check.js
// It uses sessionStorage for simplicity; it's cleared when the session ends or browser closes.
function checkAccessStatus() {
    const ACCESS_GRANTED_FLAG = 'access_granted_idd235500';
    const REQUIRED_MATRIC_NO = 'IDD/23/5500'; // Must match the one in login-check.js

    // If the access flag is NOT set, or if it doesn't match our required matric, redirect to login
    if (sessionStorage.getItem(ACCESS_GRANTED_FLAG) !== REQUIRED_MATRIC_NO) {
        // Redirect to the login page
        window.location.href = 'login.html';
        return false; // Indicate that access was denied
    }
    return true; // Indicate that access was granted
}

// In your login-check.js, you need to set this flag on successful login:
// AFTER line `window.location.href = 'all-materials.html';` in login-check.js
// Add: sessionStorage.setItem('access_granted_idd235500', REQUIRED_MATRIC_NO);


// --- Main Entry Point ---
document.addEventListener('DOMContentLoaded', () => {
    // !!! IMPORTANT: Perform the access check BEFORE loading any content !!!
    if (!checkAccessStatus()) {
        console.log("Access denied. Redirecting to login page.");
        return; // Stop further execution of this script if access is denied
    }

    // If access is granted, then proceed with loading partials and page setup
    loadPartials().then(() => {
        const currentPath = window.location.pathname;

        setMainContentPadding();
        setupHamburgerMenu();

        if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
            console.log('Running setupDepartmentsPage for index.html.');
            setupDepartmentsPage();
        } else if (currentPath.includes('all-materials.html')) {
            console.log('Running setupMaterialsPage for all-materials.html.');
            setupMaterialsPage();
        } else if (currentPath.includes('past-questions.html')) {
            console.log('Running setupPastQuestionsPage for past-questions.html.');
            setupPastQuestionsPage();
        } else if (currentPath.includes('contact.html')) {
            console.log('Running setupContactPage for contact.html.');
            setupContactPage();
        }
    }).catch(error => {
        console.error("Failed to load partials or initialize page:", error);
    });
});






// --- Common UI Elements and Functions ---

// Dynamically set main content padding-top based on header height
const setMainContentPadding = () => {
    const mainHeader = document.querySelector('.main-header');
    const mainContent = document.querySelector('main');
    if (mainHeader && mainContent) {
        const headerHeight = mainHeader.offsetHeight;
        mainContent.style.paddingTop = `${headerHeight}px`;
        console.log(`Main content padding set to ${headerHeight}px.`);
    } else {
        console.warn('Main header or main content element not found for padding adjustment.');
    }
};


// --- Partial Loading Functions ---
async function loadPartials() {
    try {
        const headerContainer = document.getElementById('header-placeholder');
        if (headerContainer) {
            const headerResponse = await fetch('partials/header.html');
            if (headerResponse.ok) {
                const headerHtml = await headerResponse.text();
                headerContainer.innerHTML = headerHtml;
                console.log('Header loaded successfully into #header-placeholder.');
            } else {
                console.error('Failed to load header.html:', headerResponse.status, headerResponse.statusText);
            }
        } else {
            console.warn('Header placeholder (#header-placeholder) not found in HTML. Header will not be loaded by JS.');
        }

        const footerContainer = document.getElementById('footer-placeholder');
        if (footerContainer) {
            const footerResponse = await fetch('partials/footer.html');
            if (footerResponse.ok) {
                const footerHtml = await footerResponse.text();
                footerContainer.innerHTML = footerHtml;
                console.log('Footer loaded successfully into #footer-placeholder.');
            } else {
                console.error('Failed to load footer.html:', footerResponse.status, footerResponse.statusText);
            }
        } else {
            console.warn('Footer placeholder (#footer-placeholder) not found in HTML. Footer will not be loaded by JS.');
        }
    } catch (error) {
        console.error("An error occurred during partials loading:", error);
    }
}

// --- Hamburger Menu Toggle Logic ---
function setupHamburgerMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.main-nav');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
        console.log('Hamburger menu setup with .nav-toggle and toggling "open" class.');
    } else {
        console.warn('Hamburger menu elements not found. Make sure you have .nav-toggle and .main-nav in your header.html.');
    }
}

// --- Download Popup Logic ---
document.addEventListener('click', async (event) => {
    const downloadButton = event.target.closest('.btn-download');
    if (downloadButton) {
        event.preventDefault();
        
        // Get popup elements
        const popupOverlay = document.getElementById('download-popup-overlay');
        const popupTitle = document.getElementById('popup-title');
        const popupMessage = document.getElementById('popup-message');
        const closeBtn = document.getElementById('download-popup-close');
        const retryBtn = document.getElementById('download-popup-retry');
        
        if (downloadButton.classList.contains('disabled')) {
            // Show error popup for disabled buttons
            popupTitle.textContent = "Download Unavailable";
            popupMessage.textContent = "This file cannot be downloaded due to an invalid file path.";
            retryBtn.style.display = 'none';
            popupOverlay.classList.add('show');
            return;
        }

        const filePath = downloadButton.dataset.filePath;
        const filename = downloadButton.dataset.filename || 'download';
        
        if (!filePath || !filePath.includes('.')) {
            // Show error popup for invalid paths
            popupTitle.textContent = "Invalid File";
            popupMessage.textContent = "The file path is invalid or missing.";
            retryBtn.style.display = 'none';
            popupOverlay.classList.add('show');
            return;
        }

        // Show loading state
        const originalButtonHTML = downloadButton.innerHTML;
        downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating URL...';
        downloadButton.disabled = true;
        downloadButton.classList.add('downloading');

        try {
            const downloadLink = await getSupabaseDownloadUrl(SUPABASE_STORAGE_BUCKET, filePath);
            
            if (!downloadLink) {
                // Show error popup
                popupTitle.textContent = "Download Failed";
                popupMessage.textContent = "Could not generate download URL. Please try again.";
                retryBtn.style.display = 'inline-block';
                popupOverlay.classList.add('show');
                return;
            }

            // Success case - attempt download
            const tempLink = document.createElement('a');
            tempLink.href = downloadLink;
            tempLink.download = filename;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            // Show success popup
            popupTitle.textContent = "Download Started";
            popupMessage.textContent = "Your download should start shortly. If it doesn't, check your browser's download settings.";
            retryBtn.style.display = 'none';
            popupOverlay.classList.add('show');

        } catch (error) {
            console.error('Error generating download URL:', error);
            // Show error popup
            popupTitle.textContent = "Download Error";
            popupMessage.textContent = `An error occurred: ${error.message}`;
            retryBtn.style.display = 'inline-block';
            popupOverlay.classList.add('show');
        } finally {
            setTimeout(() => {
                downloadButton.innerHTML = originalButtonHTML;
                downloadButton.disabled = false;
                downloadButton.classList.remove('downloading');
            }, 3000);
        }
    }
});

// Add retry button functionality
const retryBtn = document.getElementById('download-popup-retry');
if (retryBtn) {
    retryBtn.addEventListener('click', () => {
        document.getElementById('download-popup-overlay').classList.remove('show');
        // You could add auto-retry logic here if needed
    });

    // Close popup when clicking close button
document.getElementById('download-popup-close')?.addEventListener('click', () => {
    document.getElementById('download-popup-overlay').classList.remove('show');
});

// Close popup when clicking outside content
document.getElementById('download-popup-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('download-popup-overlay')) {
        document.getElementById('download-popup-overlay').classList.remove('show');
    }
});
}

// --- Homepage Departments Logic ---
async function setupDepartmentsPage() {
    const departmentGrid = document.querySelector('.department-grid');
    const loadingIndicator = document.getElementById('departments-loading-indicator');
    const noDepartmentsFound = document.getElementById('no-departments-found');
    const departmentSearchInput = document.getElementById('department-search-input');

    if (!departmentGrid) {
        console.warn('Department grid element not found for setupDepartmentsPage. This script expects an element with class "department-grid".');
        return;
    }

    let allDepartments = [];

    const renderDepartments = (departmentsToRender) => {
        departmentGrid.innerHTML = '';
        if (departmentsToRender.length > 0) {
            departmentsToRender.forEach(departmentName => {
                const departmentCard = document.createElement('div');
                departmentCard.classList.add('department-card');
                departmentCard.innerHTML = `
                    <div class="card-icon"><i class="fas fa-book"></i></div>
                    <h3>${departmentName}</h3>
                    <p>Explore course materials and past questions for ${departmentName}.</p>
                    <a href="all-materials.html?department=${encodeURIComponent(departmentName)}"
                       class="btn btn-outline-departments">View Materials</a>
                `;
                departmentGrid.appendChild(departmentCard);
            });
            if (noDepartmentsFound) noDepartmentsFound.style.display = 'none';
        } else {
            if (noDepartmentsFound) {
                noDepartmentsFound.textContent = "No departments found matching your search.";
                noDepartmentsFound.style.display = 'block';
            }
        }
    };

    const filterDepartments = () => {
        const searchTerm = departmentSearchInput.value.toLowerCase().trim();
        const filtered = allDepartments.filter(dept => dept.toLowerCase().includes(searchTerm));
        renderDepartments(filtered);
    };

    try {
        if (isSupabaseInitialized) {
            if (loadingIndicator) loadingIndicator.style.display = 'block';

            const allMaterials = await getMaterialsFromSupabase(SUPABASE_MATERIALS_TABLE);
            console.log('Result from getMaterialsFromSupabase (departments page):', allMaterials);

            if (allMaterials && allMaterials.length > 0) {
                const uniqueDepartments = [...new Set(allMaterials.map(material => material.department))].sort();
                allDepartments = uniqueDepartments;
                console.log('Unique departments from Supabase:', uniqueDepartments);
                renderDepartments(allDepartments);
            } else {
                console.warn("Bucket is empty or failed to fetch materials.");
                if (noDepartmentsFound) noDepartmentsFound.style.display = 'block';
                if (noDepartmentsFound) noDepartmentsFound.textContent = "Bucket is empty or failed to fetch materials.";
            }
        } else {
            console.warn("Supabase not initialized for departments page. Please ensure keys are correct in 'js/supabase.js'.");
            if (noDepartmentsFound) {
                noDepartmentsFound.textContent = "Data not loaded: Supabase initialization failed. Check console for details.";
                noDepartmentsFound.style.display = 'block';
            }
        }
    } catch (error) {
        console.error("Error setting up departments page:", error);
        if (noDepartmentsFound) {
            noDepartmentsFound.textContent = `An error occurred loading departments: ${error.message}`;
            noDepartmentsFound.style.display = 'block';
        }
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }

    if (departmentSearchInput) {
        departmentSearchInput.addEventListener('keyup', filterDepartments);
    }
}

// --- All Materials Listing Logic ---
let allCourseMaterials = [];

async function setupMaterialsPage() {
    const materialsGrid = document.getElementById('materials-grid');
    const materialsSearchInput = document.getElementById('materials-search-input');
    const noMaterialsFound = document.getElementById('no-materials-found');
    const departmentFilterSelect = document.getElementById('department-filter');
    const levelFilterSelect = document.getElementById('level-filter');
    const semesterFilterSelect = document.getElementById('semester-filter');
    const loadingIndicator = document.getElementById('materials-loading-indicator');

    if (!materialsGrid) return;

    const populateDepartmentFilter = (materials) => {
        if (!departmentFilterSelect) return;
        const uniqueDepartments = [...new Set(materials.map(material => material.department))].sort();
        while (departmentFilterSelect.options.length > 1) {
            departmentFilterSelect.remove(1);
        }
        uniqueDepartments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            departmentFilterSelect.appendChild(option);
        });
    };

    const renderMaterialCard = (material) => {
        if (!materialsGrid) return;
        const materialCard = document.createElement('div');
        materialCard.classList.add('material-card');
        const disabledClass = !material.download_path || !material.download_path.includes('.') ? 'disabled' : '';
        materialCard.innerHTML = `
            <h3>${material.title} (${material.course_code})</h3>
            <p>${material.department} Department</p>
            <div class="material-meta">
                <span><i class="fas fa-layer-group"></i> ${material.level}</span>
                <span><i class="fas fa-calendar-alt"></i> ${material.semester}</span>
            </div>
            <a href="#" class="btn-download ${disabledClass}" 
               data-file-path="${material.download_path || ''}" 
               data-filename="${material.id}_${material.title}.pdf"
               ${disabledClass ? 'onclick="alert(\'Download unavailable: Invalid file path.\'); return false;"' : ''}>
                <i class="fas fa-download"></i> Download
            </a>
        `;
        materialsGrid.appendChild(materialCard);
    };

    const displayMaterials = () => {
        if (!materialsGrid) return;
        materialsGrid.innerHTML = '';
        const searchTerm = materialsSearchInput ? materialsSearchInput.value.toLowerCase().trim() : '';
        const selectedDepartment = departmentFilterSelect ? departmentFilterSelect.value : '';
        const selectedLevel = levelFilterSelect ? levelFilterSelect.value : '';
        const selectedSemester = semesterFilterSelect ? semesterFilterSelect.value : '';

        const filteredMaterials = allCourseMaterials.filter(material => {
            const matchesSearch = material.title.toLowerCase().includes(searchTerm) ||
                                 material.course_code.toLowerCase().includes(searchTerm) ||
                                 material.id.toLowerCase().includes(searchTerm) ||
                                 material.department.toLowerCase().includes(searchTerm);
            const matchesDepartment = selectedDepartment === '' || material.department === selectedDepartment;
            const matchesLevel = selectedLevel === '' || material.level === selectedLevel;
            const matchesSemester = selectedSemester === '' || (material.semester && material.semester.toLowerCase().trim() === selectedSemester.toLowerCase().trim());
            return matchesSearch && matchesDepartment && matchesLevel && matchesSemester;
        });

        if (filteredMaterials.length > 0) {
            filteredMaterials.forEach(renderMaterialCard);
            if (noMaterialsFound) noMaterialsFound.style.display = 'none';
        } else {
            if (noMaterialsFound) noMaterialsFound.style.display = 'block';
        }
    };

    try {
        if (isSupabaseInitialized) {
            if (loadingIndicator) loadingIndicator.style.display = 'block';
            const fetchedMaterials = await getMaterialsFromSupabase(SUPABASE_MATERIALS_TABLE);
            console.log('Fetched materials:', fetchedMaterials);
            if (fetchedMaterials && fetchedMaterials.length > 0) {
                fetchedMaterials.forEach((material, index) => {
                    console.log(`Material ${index + 1}:`, {
                        id: material.id,
                        title: material.title,
                        download_path: material.download_path
                    });
                });
                allCourseMaterials = fetchedMaterials.map(material => ({
                    ...material,
                    download_path: material.download_path || ''
                }));
                console.log('Processed course materials:', allCourseMaterials);
            } else {
                console.warn("No materials found in Supabase or failed to fetch.");
                allCourseMaterials = [];
                if (noMaterialsFound) {
                    noMaterialsFound.textContent = "No materials found from Supabase. Check your table and RLS policies.";
                    noMaterialsFound.style.display = 'block';
                }
            }
        } else {
            console.warn("Supabase not initialized for materials page. Please ensure keys are correct.");
            allCourseMaterials = [];
            if (noMaterialsFound) {
                noMaterialsFound.textContent = "Data not loaded: Supabase initialization failed. Check console for details.";
                noMaterialsFound.style.display = 'block';
            }
        }
    } catch (error) {
        console.error("Error setting up materials page:", error);
        allCourseMaterials = [];
        if (noMaterialsFound) {
            noMaterialsFound.textContent = "An error occurred loading materials.";
            noMaterialsFound.style.display = 'block';
        }
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }

    populateDepartmentFilter(allCourseMaterials);

    const urlParams = new URLSearchParams(window.location.search);
    const initialDepartment = urlParams.get('department');
    if (initialDepartment && departmentFilterSelect) {
        departmentFilterSelect.value = initialDepartment;
    }

    if (materialsSearchInput) materialsSearchInput.addEventListener('keyup', displayMaterials);
    if (departmentFilterSelect) departmentFilterSelect.addEventListener('change', displayMaterials);
    if (levelFilterSelect) levelFilterSelect.addEventListener('change', displayMaterials);
    if (semesterFilterSelect) semesterFilterSelect.addEventListener('change', displayMaterials);

    displayMaterials();
}

// --- Past Questions Listing Logic ---
let allPastQuestions = [];

async function setupPastQuestionsPage() {
    const pastQuestionsGrid = document.getElementById('past-questions-grid');
    const pqSearchInput = document.getElementById('past-questions-search-input');
    const noPastQuestionsFound = document.getElementById('no-past-questions-found');
    const pqDepartmentFilter = document.getElementById('pq-department-filter');
    const pqLevelFilter = document.getElementById('pq-level-filter');
    const pqSemesterFilter = document.getElementById('pq-semester-filter');
    const pqYearFilter = document.getElementById('pq-year-filter');
    const loadingIndicator = document.getElementById('past-questions-loading-indicator');

    if (!pastQuestionsGrid) return;

    const populateFilters = (materials) => {
        const uniqueDepartments = [...new Set(materials.map(m => m.department))].sort();
        const uniqueYears = [...new Set(materials.map(m => m.year))].sort((a, b) => b - a);
        
        if (pqDepartmentFilter) {
            while (pqDepartmentFilter.options.length > 1) pqDepartmentFilter.remove(1);
            uniqueDepartments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                pqDepartmentFilter.appendChild(option);
            });
        }
        if (pqYearFilter) {
            while (pqYearFilter.options.length > 1) pqYearFilter.remove(1);
            uniqueYears.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                pqYearFilter.appendChild(option);
            });
        }
    };

    const renderPastQuestionCard = (pq) => {
        if (!pastQuestionsGrid) return;
        const pqCard = document.createElement('div');
        pqCard.classList.add('past-question-card');
        const disabledClass = !pq.download_path || !pq.download_path.includes('.') ? 'disabled' : '';
        pqCard.innerHTML = `
            <h3>${pq.title} (${pq.id})</h3>
            <p>${pq.department} Department</p>
            <div class="pq-meta">
                <span><i class="fas fa-layer-group"></i> ${pq.level}</span>
                <span><i class="fas fa-calendar-alt"></i> ${pq.semester}</span>
                <span><i class="fas fa-hourglass-half"></i> ${pq.year || 'N/A'}</span>
            </div>
            <a href="#" class="btn-download ${disabledClass}" 
               data-file-path="${pq.download_path || ''}" 
               data-filename="${pq.id}_${pq.title}_PQ.pdf"
               ${disabledClass ? 'onclick="alert(\'Download unavailable: Invalid file path.\'); return false;"' : ''}>
                <i class="fas fa-download"></i> Download Past Question
            </a>
        `;
        pastQuestionsGrid.appendChild(pqCard);
    };

    const displayPastQuestions = () => {
        if (!pastQuestionsGrid) return;
        pastQuestionsGrid.innerHTML = '';
        const searchTerm = pqSearchInput ? pqSearchInput.value.toLowerCase().trim() : '';
        const selectedDepartment = pqDepartmentFilter ? pqDepartmentFilter.value : '';
        const selectedLevel = pqLevelFilter ? pqLevelFilter.value : '';
        const selectedSemester = pqSemesterFilter ? pqSemesterFilter.value : '';
        const selectedYear = pqYearFilter ? pqYearFilter.value : '';

        const filteredPQs = allPastQuestions.filter(pq => {
            const matchesSearch = pq.title.toLowerCase().includes(searchTerm) ||
                                 (pq.course_code && pq.course_code.toLowerCase().includes(searchTerm)) ||
                                 pq.id.toLowerCase().includes(searchTerm) ||
                                 pq.department.toLowerCase().includes(searchTerm);
            const matchesDepartment = selectedDepartment === '' || pq.department === selectedDepartment;
            const matchesLevel = selectedLevel === '' || pq.level === selectedLevel;
            const matchesSemester = selectedSemester === '' || pq.semester === selectedSemester;
            const matchesYear = selectedYear === '' || pq.year == selectedYear;
            return matchesSearch && matchesDepartment && matchesLevel && matchesSemester && matchesYear;
        });

        if (filteredPQs.length > 0) {
            filteredPQs.forEach(renderPastQuestionCard);
            if (noPastQuestionsFound) noPastQuestionsFound.style.display = 'none';
        } else {
            if (noPastQuestionsFound) noPastQuestionsFound.style.display = 'block';
        }
    };

    try {
        if (isSupabaseInitialized) {
            if (loadingIndicator) loadingIndicator.style.display = 'block';
            const fetchedPQs = await getMaterialsFromSupabase(SUPABASE_PAST_QUESTIONS_TABLE);
            console.log('Fetched past questions:', fetchedPQs);
            if (fetchedPQs && fetchedPQs.length > 0) {
                fetchedPQs.forEach((pq, index) => {
                    console.log(`Past Question ${index + 1}:`, {
                        id: pq.id,
                        title: pq.title,
                        download_path: pq.download_path
                    });
                });
                allPastQuestions = fetchedPQs.map(pq => ({
                    ...pq,
                    download_path: pq.download_path || ''
                }));
                console.log('Processed past questions:', allPastQuestions);
            } else {
                console.warn("Bucket is empty or failed to fetch past questions.");
                allPastQuestions = [];
                if (noPastQuestionsFound) {
                    noPastQuestionsFound.textContent = "Bucket is empty or failed to fetch past questions.";
                    noPastQuestionsFound.style.display = 'block';
                }
            }
        } else {
            console.warn("Supabase not initialized for past questions page. Please ensure keys are correct.");
            allPastQuestions = [];
            if (noPastQuestionsFound) {
                noPastQuestionsFound.textContent = "Data not loaded: Supabase initialization failed. Check console for details.";
                noPastQuestionsFound.style.display = 'block';
            }
        }
    } catch (error) {
        console.error("Error setting up past questions page:", error);
        allPastQuestions = [];
        if (noPastQuestionsFound) {
            noPastQuestionsFound.textContent = "An error occurred loading past questions.";
            noPastQuestionsFound.style.display = 'block';
        }
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }

    populateFilters(allPastQuestions);
    if (pqSearchInput) pqSearchInput.addEventListener('keyup', displayPastQuestions);
    if (pqDepartmentFilter) pqDepartmentFilter.addEventListener('change', displayPastQuestions);
    if (pqLevelFilter) pqLevelFilter.addEventListener('change', displayPastQuestions);
    if (pqSemesterFilter) pqSemesterFilter.addEventListener('change', displayPastQuestions);
    if (pqYearFilter) pqYearFilter.addEventListener('change', displayPastQuestions);

    displayPastQuestions();
}




// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Add viewport meta tag if missing
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(meta);
    }
    
  
});

// --- Main Entry Point ---
document.addEventListener('DOMContentLoaded', () => {
    loadPartials().then(() => {
        const currentPath = window.location.pathname;

        setMainContentPadding();
        setupHamburgerMenu();

        if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
            console.log('Running setupDepartmentsPage for index.html.');
            setupDepartmentsPage();
        } else if (currentPath.includes('all-materials.html')) {
            console.log('Running setupMaterialsPage for all-materials.html.');
            setupMaterialsPage();
        } else if (currentPath.includes('past-questions.html')) {
            console.log('Running setupPastQuestionsPage for past-questions.html.');
            setupPastQuestionsPage();
        
        }
    }).catch(error => {
        console.error("Failed to load partials or initialize page:", error);
    });

    
});