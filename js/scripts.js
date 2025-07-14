document.addEventListener('DOMContentLoaded', () => {

    // --- Data (kept global for access by all functions) ---
    const courseMaterials = [
        { id: 'CSCE201', title: 'Introduction to Computer Science', department: 'Computer Science', semester: '1st Semester', level: '200L', downloadLink: 'materials/CSCE201.pdf' },
        { id: 'MATH101', title: 'General Mathematics I', department: 'Mathematics', semester: '1st Semester', level: '100L', downloadLink: 'materials/MATH101.pdf' },
        { id: 'EENG201', title: 'Basic Electrical Engineering I', department: 'Electrical and Electronics Engineering', semester: '1st Semester', level: '200L', downloadLink: 'materials/EENG201.pdf' },
        { id: 'ARCH301', title: 'Architectural Design III', department: 'Architecture', semester: '2nd Semester', level: '300L', downloadLink: 'materials/ARCH301.pdf' },
        { id: 'AGR202', title: 'Introduction to Agricultural Economics', department: 'Agricultural Engineering', semester: '2nd Semester', level: '200L', downloadLink: 'materials/AGR202.pdf' },
        { id: 'GEOL101', title: 'Elements of Geology', department: 'Geology', semester: '1st Semester', level: '100L', downloadLink: 'materials/GEOL101.pdf' },
        { id: 'PHYS102', 'title': 'General Physics II', department: 'Physics', semester: '2nd Semester', level: '100L', downloadLink: 'materials/PHYS102.pdf' },
        { id: 'CYPE305', title: 'Cyber Security Principles', department: 'Computer Science', semester: '1st Semester', level: '300L', downloadLink: 'materials/CYPE305.pdf' },
        { id: 'MECH203', title: 'Engineering Drawing', department: 'Mechanical Engineering', semester: '1st Semester', level: '200L', downloadLink: 'materials/MECH203.pdf' },
        { id: 'URP401', title: 'Urban Planning Techniques', department: 'Urban and Regional Planning', semester: '2nd Semester', level: '400L', downloadLink: 'materials/URP401.pdf' },
        { id: 'BIO101', title: 'General Biology I', department: 'Biology', semester: '1st Semester', level: '100L', downloadLink: 'materials/BIO101.pdf' },
        { id: 'FST301', title: 'Food Chemistry', department: 'Food Science and Technology', semester: '1st Semester', level: '300L', downloadLink: 'materials/300L.pdf' },
        { id: 'MET301', title: 'Introduction to Materials Science', department: 'Metallurgical and Materials Engineering', semester: '1st Semester', level: '300L', downloadLink: 'materials/MET301.pdf' },
        { id: 'CHE401', title: 'Chemical Engineering Thermodynamics', department: 'Chemical Engineering', semester: '2nd Semester', level: '400L', downloadLink: 'materials/CHE401.pdf' },
    ];

    // --- Past Questions Data (for past-questions.html) ---
    const pastQuestionsData = [
        { id: 'CSCE201', title: 'Introduction to Computer Science', department: 'Computer Science', semester: '1st Semester', level: '200L', year: 2022, downloadLink: 'past-questions/CSCE201_2022_1st_Sem.pdf' },
        { id: 'MATH101', title: 'General Mathematics I', department: 'Mathematics', semester: '1st Semester', level: '100L', year: 2021, downloadLink: 'past-questions/MATH101_2021_1st_Sem.pdf' },
        { id: 'EENG201', title: 'Basic Electrical Engineering I', department: 'Electrical and Electronics Engineering', semester: '1st Semester', level: '200L', year: 2023, downloadLink: 'past-questions/EENG201_2023_1st_Sem.pdf' },
        { id: 'ARCH301', title: 'Architectural Design III', department: 'Architecture', semester: '2nd Semester', level: '300L', year: 2022, downloadLink: 'past-questions/ARCH301_2022_2nd_Sem.pdf' },
        { id: 'AGR202', title: 'Introduction to Agricultural Economics', department: 'Agricultural Engineering', semester: '2nd Semester', level: '200L', year: 2021, downloadLink: 'past-questions/AGR202_2021_2nd_Sem.pdf' },
        { id: 'GEOL101', title: 'Elements of Geology', department: 'Geology', semester: '1st Semester', level: '100L', year: 2020, downloadLink: 'past-questions/GEOL101_2020_1st_Sem.pdf' },
        { id: 'PHYS102', title: 'General Physics II', department: 'Physics', semester: '2nd Semester', level: '100L', year: 2023, downloadLink: 'past-questions/PHYS102_2023_2nd_Sem.pdf' },
        { id: 'CYPE305', title: 'Cyber Security Principles', department: 'Computer Science', semester: '1st Semester', level: '300L', year: 2022, downloadLink: 'past-questions/CYPE305_2022_1st_Sem.pdf' },
        { id: 'MECH203', title: 'Engineering Drawing', department: 'Mechanical Engineering', semester: '1st Semester', level: '200L', year: 2020, downloadLink: 'past-questions/MECH203_2020_1st_Sem.pdf' },
        { id: 'URP401', title: 'Urban Planning Techniques', department: 'Urban and Regional Planning', semester: '2nd Semester', level: '400L', year: 2021, downloadLink: 'past-questions/URP401_2021_2nd_Sem.pdf' },
        { id: 'BIO101', title: 'General Biology I', department: 'Biology', semester: '1st Semester', level: '100L', year: 2023, downloadLink: 'past-questions/BIO101_2023_1st_Sem.pdf' },
        { id: 'FST301', title: 'Food Chemistry', department: 'Food Science and Technology', semester: '1st Semester', level: '300L', year: 2022, downloadLink: 'past-questions/FST301_2022_1st_Sem.pdf' },
        { id: 'MET301', title: 'Introduction to Materials Science', department: 'Metallurgical and Materials Engineering', semester: '1st Semester', level: '300L', year: 2021, downloadLink: 'past-questions/MET301_2021_1st_Sem.pdf' },
        { id: 'CHE401', title: 'Chemical Engineering Thermodynamics', department: 'Chemical Engineering', semester: '2nd Semester', level: '400L', year: 2020, downloadLink: 'past-questions/CHE401_2020_2nd_Sem.pdf' },
        { id: 'CSCE201', title: 'Introduction to Computer Science', department: 'Computer Science', semester: '1st Semester', level: '200L', year: 2021, downloadLink: 'past-questions/CSCE201_2021_1st_Sem.pdf' },
        { id: 'MATH101', title: 'General Mathematics I', department: 'Mathematics', semester: '1st Semester', level: '100L', year: 2020, downloadLink: 'past-questions/MATH101_2020_1st_Sem.pdf' },
        { id: 'EENG201', title: 'Basic Electrical Engineering I', department: 'Electrical and Electronics Engineering', semester: '1st Semester', level: '200L', year: 2021, downloadLink: 'past-questions/EENG201_2021_1st_Sem.pdf' },
        { id: 'ARCH301', title: 'Architectural Design III', department: 'Architecture', semester: '2nd Semester', level: '300L', year: 2020, downloadLink: 'past-questions/ARCH301_2020_2nd_Sem.pdf' },
    ];
    console.log('pastQuestionsData loaded:', pastQuestionsData.length, 'items');


    const allDepartmentsData = [
        { name: 'Computer Science', description: 'Innovating with code and algorithms.', icon: 'fas fa-laptop-code' },
        { name: 'Electrical and Electronics Engineering', description: 'Shaping the future of energy and communication.', icon: 'fas fa-bolt' },
        { name: 'Metallurgical and Materials Engineering', description: 'Understanding and developing advanced materials.', icon: 'fas fa-flask' },
        { name: 'Architecture', description: 'Designing sustainable and innovative spaces.', icon: 'fas fa-city' },
        { name: 'Agricultural Engineering', description: 'Innovating for sustainable agriculture.', icon: 'fas fa-tractor' },
        { name: 'Chemical Engineering', description: 'Transforming raw materials into useful products.', icon: 'fas fa-industry' },
        { name: 'Mechanical Engineering', description: 'Driving innovation in design and machinery.', icon: 'fas fa-cogs' },
        { name: 'Civil Engineering', description: 'Building the infrastructure of tomorrow.', icon: 'fas fa-hard-hat' },
        { name: 'Applied Geophysics', description: 'Exploring the Earth beneath our feet.', icon: 'fas fa-globe-americas' },
        { name: 'Geology', description: 'Uncovering the secrets of Earth\'s history.', icon: 'fas fa-mountain' },
        { name: 'Mathematics', description: 'The foundation of all sciences and engineering.', icon: 'fas fa-calculator' },
        { name: 'Physics', description: 'Understanding the fundamental laws of the universe.', icon: 'fas fa-atom' },
        { name: 'Biology', description: 'Studying life in all its forms.', icon: 'fas fa-dna' },
        { name: 'Biochemistry', description: 'Exploring the chemistry of living organisms.', icon: 'fas fa-microscope' },
        { name: 'Urban and Regional Planning', description: 'Designing functional and sustainable communities.', icon: 'fas fa-map-marked-alt' },
        { name: 'Food Science and Technology', description: 'Innovating in food production and safety.', icon: 'fas fa-apple-alt' },
    ];

    // --- Core Initialization Function (to be called after partials are loaded) ---
    // This function sets up all event listeners and dynamic content that exist on all pages.
    const initializePageFeatures = () => {
        // --- Mobile Navigation Toggle ---
        const navToggle = document.querySelector('.nav-toggle'); // Corrected selector
        const mainNav = document.querySelector('.main-nav');

        if (navToggle && mainNav) {
            if (!navToggle.dataset.hasClickListener) {
                navToggle.addEventListener('click', () => {
                    mainNav.classList.toggle('open');
                    navToggle.classList.toggle('open');
                });
                navToggle.dataset.hasClickListener = 'true';
            }

            document.querySelectorAll('.main-nav a').forEach(link => {
                if (!link.dataset.hasClickListener) {
                    link.addEventListener('click', () => {
                        if (mainNav.classList.contains('open')) {
                            mainNav.classList.remove('open');
                            navToggle.classList.remove('open');
                        }
                    });
                    link.dataset.hasClickListener = 'true';
                }
            });
        } else {
            console.warn("Mobile navigation elements not found after partials load.");
        }

        // --- Dynamic Year in Footer ---
        const currentYearSpan = document.getElementById('current-year-footer');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        } else {
            console.warn("Footer year span element not found after partials load.");
        }

        // --- Scroll to Top Button ---
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (scrollToTopBtn && !window.__scrollHandlerInitialized) {
            const handleScroll = () => {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
            };
            window.addEventListener('scroll', handleScroll);
            window.__scrollHandlerInitialized = true;

            if (!scrollToTopBtn.dataset.hasClickListener) {
                 scrollToTopBtn.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
                scrollToTopBtn.dataset.hasClickListener = 'true';
            }
        } else if (!scrollToTopBtn) {
            console.warn("Scroll to top button not found after partials load.");
        }

        // --- Dynamic Header Hide/Show on Scroll ---
        const mainHeader = document.querySelector('.main-header');
        if (mainHeader && !window.__headerScrollHandlerInitialized) {
            let lastScrollTop = 0;
            const scrollThreshold = 100;

            const handleHeaderScroll = () => {
                let currentScroll = window.scrollY || document.documentElement.scrollTop;

                if (currentScroll > scrollThreshold) {
                    if (currentScroll > lastScrollTop) {
                        if (!mainHeader.classList.contains('header-hidden')) {
                            mainHeader.classList.add('header-hidden');
                        }
                    } else {
                        if (mainHeader.classList.contains('header-hidden')) {
                            mainHeader.classList.remove('header-hidden');
                        }
                    }
                } else {
                    if (mainHeader.classList.contains('header-hidden')) {
                        mainHeader.classList.remove('header-hidden');
                    }
                }
                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            };

            window.addEventListener('scroll', handleHeaderScroll, false);
            window.__headerScrollHandlerInitialized = true;
        } else if (!mainHeader) {
            console.error("Error: '.main-header' element not found for scroll hide/show feature after partials load.");
        }

        // --- Set Active Navigation Link ---
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');

            if (currentPath.includes('all-materials.html') && linkHref.includes('all-materials.html')) {
                link.classList.add('active');
            } else if (currentPath.includes('past-questions.html') && linkHref.includes('past-questions.html')) {
                link.classList.add('active');
            } else if (currentPath.includes('about.html') && linkHref.includes('about.html')) {
                link.classList.add('active');
            } else if (currentPath.includes('contact.html') && linkHref.includes('contact.html')) {
                link.classList.add('active');
            } else if (currentPath.includes('index.html') || currentPath === '/') {
                if (linkHref.includes('index.html')) {
                    if (linkHref === 'index.html#hero' && (!currentHash || currentHash === '#hero')) {
                        link.classList.add('active');
                    } else if (currentHash && linkHref.includes(currentHash)) {
                        link.classList.add('active');
                    }
                } else if (currentPath === '/' && link.dataset.navLink === 'home' && !currentHash) {
                    link.classList.add('active');
                }
            }
        });

        // --- Update Material Count Display in Footer (for course materials) ---
        const materialCountDisplay = document.getElementById('material-count-display');
        if (materialCountDisplay) {
            materialCountDisplay.textContent = courseMaterials.length + pastQuestionsData.length;
        }

        // --- Dynamically set body padding-top based on header height ---
        const body = document.body;
        if (mainHeader && body) {
            requestAnimationFrame(() => {
                const headerHeight = mainHeader.offsetHeight;
                body.style.paddingTop = `${headerHeight}px`;
                console.log(`Set body padding-top to: ${headerHeight}px`);
            });
        }

        // --- Download Popup Logic (shared for all download buttons) ---
        const downloadPopupOverlay = document.getElementById('download-popup-overlay');
        const downloadPopupCloseBtn = document.getElementById('download-popup-close');

        if (downloadPopupCloseBtn && downloadPopupOverlay) {
            if (!downloadPopupCloseBtn.dataset.hasClickListener) {
                downloadPopupCloseBtn.addEventListener('click', () => {
                    downloadPopupOverlay.classList.remove('show');
                });
                downloadPopupCloseBtn.dataset.hasClickListener = 'true'; // Flag on overlay
            }

            // Delegated event listener for all download buttons
            document.addEventListener('click', (event) => {
                const downloadButton = event.target.closest('.btn-download'); // Get the actual button
                if (downloadButton) {
                    event.preventDefault(); // Prevent default link behavior to allow loader + popup

                    const originalButtonText = downloadButton.innerHTML; // Store original content
                    downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...'; // Add spinner and text
                    downloadButton.disabled = true; // Disable button to prevent multiple clicks
                    downloadButton.classList.add('downloading'); // Add a class for styling

                    // Trigger the download by creating a temporary link and clicking it
                    const tempLink = document.createElement('a');
                    tempLink.href = downloadButton.href;
                    tempLink.download = downloadButton.download; // Ensure the 'download' attribute is used
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink); // Clean up the temporary link

                    if (downloadPopupOverlay) {
                        downloadPopupOverlay.classList.add('show');
                    }

                    // Reset button state after a short delay (e.g., 3 seconds)
                    setTimeout(() => {
                        downloadButton.innerHTML = originalButtonText; // Restore original content
                        downloadButton.disabled = false; // Re-enable button
                        downloadButton.classList.remove('downloading'); // Remove the styling class
                        downloadPopupOverlay.classList.remove('show'); // Hide popup if still visible
                    }, 3000); // Adjust delay as needed
                }
            });
        }
    };


    // --- Load Partials Function ---
    const loadPartials = async () => {
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        try {
            if (headerPlaceholder) {
                const headerResponse = await fetch('partials/header.html');
                if (!headerResponse.ok) throw new Error(`HTTP error! status: ${headerResponse.status}`);
                const headerHtml = await headerResponse.text();
                headerPlaceholder.innerHTML = headerHtml;
            }

            if (footerPlaceholder) {
                const footerResponse = await fetch('partials/footer.html');
                if (!footerResponse.ok) throw new Error(`HTTP error! status: ${footerResponse.status}`);
                const footerHtml = await footerResponse.text();
                footerPlaceholder.innerHTML = footerHtml;
            }

            initializePageFeatures(); // Initialize features after partials are loaded

        } catch (error) {
            console.error('Error loading partials:', error);
            if (headerPlaceholder) headerPlaceholder.innerHTML = '<header class="main-header" style="background-color:#eee; padding:20px;"><div class="container"><h1>Error Loading Header</h1></div></header>';
            if (footerPlaceholder) footerPlaceholder.innerHTML = '<footer class="main-footer" style="background-color:#eee; padding:20px;"><div class="container"><p>Error Loading Footer</p></div></footer>';
        }
    };


    // --- Homepage Specific Logic (only runs on index.html) ---
    const initializeHomepage = () => {
        const departmentGrid = document.querySelector('.department-grid');
        const loadMoreDepartmentsBtn = document.getElementById('load-more-departments');
        const departmentSearchInput = document.getElementById('department-search-input');

        const initialDepartmentsCount = 6;
        let departmentsCurrentlyDisplayed = 0;

        const renderDepartmentCard = (dept) => {
            if (!departmentGrid) return;
            const departmentCard = document.createElement('div');
            departmentCard.classList.add('department-card');
            departmentCard.innerHTML = `
                <div class="card-icon"><i class="${dept.icon}"></i></div>
                <h3>${dept.name}</h3>
                <p>${dept.description}</p>
                <a href="all-materials.html?department=${encodeURIComponent(dept.name)}" class="btn btn-outline-departments">View Materials</a>
            `;
            departmentGrid.appendChild(departmentCard);
        };

        const loadDepartments = (count) => {
            if (!departmentGrid) return;
            const startIndex = departmentsCurrentlyDisplayed;
            const endIndex = Math.min(startIndex + count, allDepartmentsData.length);

            if (startIndex >= endIndex) {
                if (loadMoreDepartmentsBtn) loadMoreDepartmentsBtn.style.display = 'none';
                return;
            }

            for (let i = startIndex; i < endIndex; i++) {
                renderDepartmentCard(allDepartmentsData[i]);
            }
            departmentsCurrentlyDisplayed = endIndex;

            if (departmentsCurrentlyDisplayed >= allDepartmentsData.length) {
                if (loadMoreDepartmentsBtn) loadMoreDepartmentsBtn.style.display = 'none';
            } else {
                if (loadMoreDepartmentsBtn) loadMoreDepartmentsBtn.style.display = 'inline-flex';
            }
        };

        if (departmentGrid) {
            departmentGrid.innerHTML = '';
            departmentsCurrentlyDisplayed = 0;
            loadDepartments(initialDepartmentsCount);
        } else {
            console.warn("'.department-grid' element not found on homepage. Department cards will not load.");
        }

        if (loadMoreDepartmentsBtn) {
            if (!loadMoreDepartmentsBtn.dataset.hasClickListener) {
                loadMoreDepartmentsBtn.addEventListener('click', () => {
                    loadDepartments(6);
                });
                loadMoreDepartmentsBtn.dataset.hasClickListener = 'true';
            }
        }

        if (departmentSearchInput) {
            if (!departmentSearchInput.dataset.hasKeyListener) {
                departmentSearchInput.addEventListener('keyup', () => {
                    const query = departmentSearchInput.value.toLowerCase().trim();
                    if (departmentGrid) departmentGrid.innerHTML = '';
                    if (loadMoreDepartmentsBtn) loadMoreDepartmentsBtn.style.display = 'none';

                    if (query === '') {
                        departmentsCurrentlyDisplayed = 0;
                        loadDepartments(initialDepartmentsCount);
                        return;
                    }

                    const filteredDepartments = allDepartmentsData.filter(dept =>
                        dept.name.toLowerCase().includes(query) ||
                        dept.description.toLowerCase().includes(query)
                    );

                    if (filteredDepartments.length > 0) {
                        if (departmentGrid) filteredDepartments.forEach(dept => renderDepartmentCard(dept));
                    } else {
                        if (departmentGrid) departmentGrid.innerHTML = '<p class="no-results" style="text-align: center; color: var(--text-light); padding: 20px;">No departments found matching your search.</p>';
                    }
                });
                departmentSearchInput.dataset.hasKeyListener = 'true';
            }
        }
    };

    // --- Course Materials Listing Page Logic (only runs on all-materials.html) ---
    const initializeAllMaterialsPage = () => {
        const materialsGrid = document.getElementById('materials-grid');
        const materialsSearchInput = document.getElementById('materials-search-input');
        const noMaterialsFound = document.getElementById('no-materials-found');
        const departmentFilterSelect = document.getElementById('department-filter');
        const levelFilterSelect = document.getElementById('level-filter');
        const semesterFilterSelect = document.getElementById('semester-filter');

        const renderMaterialCard = (material) => {
            if (!materialsGrid) return;
            const materialCard = document.createElement('div');
            materialCard.classList.add('material-card');
            materialCard.innerHTML = `
                <h3>${material.title} (${material.id})</h3>
                <p>${material.department} Department</p>
                <div class="material-meta">
                    <span><i class="fas fa-layer-group"></i> ${material.level}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${material.semester}</span>
                </div>
                <a href="${material.downloadLink}" class="btn-download" download>
                    <i class="fas fa-download"></i> Download
                </a>
            `;
            materialsGrid.appendChild(materialCard);
        };

        const populateDepartmentFilter = () => {
            if (!departmentFilterSelect) return;

            const uniqueDepartments = [...new Set(courseMaterials.map(material => material.department))].sort();

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

        const displayMaterials = () => {
            if (!materialsGrid) return;

            materialsGrid.innerHTML = '';
            const searchTerm = materialsSearchInput ? materialsSearchInput.value.toLowerCase().trim() : '';
            const selectedDepartment = departmentFilterSelect ? departmentFilterSelect.value : '';
            const selectedLevel = levelFilterSelect ? levelFilterSelect.value : '';
            const selectedSemester = semesterFilterSelect ? semesterFilterSelect.value : '';

            const filteredMaterials = courseMaterials.filter(material => {
                const matchesSearch = material.title.toLowerCase().includes(searchTerm) ||
                                      material.id.toLowerCase().includes(searchTerm) ||
                                      material.department.toLowerCase().includes(searchTerm);

                const matchesDepartment = selectedDepartment === '' || material.department === selectedDepartment;
                const matchesLevel = selectedLevel === '' || material.level === selectedLevel;
                const matchesSemester = selectedSemester === '' || material.semester === selectedSemester;

                return matchesSearch && matchesDepartment && matchesLevel && matchesSemester;
            });

            if (filteredMaterials.length > 0) {
                filteredMaterials.forEach(renderMaterialCard);
                if (noMaterialsFound) noMaterialsFound.style.display = 'none';
            } else {
                if (noMaterialsFound) noMaterialsFound.style.display = 'block';
            }
        };

        if (materialsGrid) {
            populateDepartmentFilter();

            const urlParams = new URLSearchParams(window.location.search);
            const departmentFromUrl = urlParams.get('department');
            if (departmentFromUrl && departmentFilterSelect) {
                departmentFilterSelect.value = departmentFromUrl;
            }

            if (materialsSearchInput && !materialsSearchInput.dataset.hasKeyListener) {
                materialsSearchInput.addEventListener('keyup', displayMaterials);
                materialsSearchInput.dataset.hasKeyListener = 'true';
            }
            if (departmentFilterSelect && !departmentFilterSelect.dataset.hasChangeListener) {
                departmentFilterSelect.addEventListener('change', displayMaterials);
                departmentFilterSelect.dataset.hasChangeListener = 'true';
            }
            if (levelFilterSelect && !levelFilterSelect.dataset.hasChangeListener) {
                levelFilterSelect.addEventListener('change', displayMaterials);
                levelFilterSelect.dataset.hasChangeListener = 'true';
            }
            if (semesterFilterSelect && !semesterFilterSelect.dataset.hasChangeListener) {
                semesterFilterSelect.addEventListener('change', displayMaterials);
                semesterFilterSelect.dataset.hasChangeListener = 'true';
            }

            displayMaterials();
        } else {
            console.warn("'.materials-grid' element not found on all-materials.html. Material cards will not load.");
        }
    };

    // --- Past Questions Listing Page Logic ---
    const initializePastQuestionsPage = () => {
        const pastQuestionsGrid = document.getElementById('past-questions-grid');
        console.log('pastQuestionsGrid element:', pastQuestionsGrid);

        const pqSearchInput = document.getElementById('past-questions-search-input');
        const noPastQuestionsFound = document.getElementById('no-past-questions-found');
        const pqDepartmentFilterSelect = document.getElementById('pq-department-filter');
        const pqLevelFilterSelect = document.getElementById('pq-level-filter');
        const pqSemesterFilterSelect = document.getElementById('pq-semester-filter');
        const pqYearFilterSelect = document.getElementById('pq-year-filter');

        const renderPastQuestionCard = (pq) => {
            if (!pastQuestionsGrid) return;
            console.log('Rendering card for:', pq.id);
            const pqCard = document.createElement('div');
            pqCard.classList.add('material-card'); // Re-using material-card style
            pqCard.innerHTML = `
                <h3>${pq.title} (${pq.id})</h3>
                <p>${pq.department} Department</p>
                <div class="material-meta">
                    <span><i class="fas fa-layer-group"></i> ${pq.level}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${pq.semester}</span>
                    <span><i class="fas fa-calendar-check"></i> ${pq.year}</span>
                </div>
                <a href="${pq.downloadLink}" class="btn-download" download>
                    <i class="fas fa-download"></i> Download
                </a>
            `;
            pastQuestionsGrid.appendChild(pqCard);
        };

        const populatePQFilters = () => {
            if (pqDepartmentFilterSelect) {
                const uniqueDepartments = [...new Set(pastQuestionsData.map(pq => pq.department))].sort();
                while (pqDepartmentFilterSelect.options.length > 1) {
                    pqDepartmentFilterSelect.remove(1);
                }
                uniqueDepartments.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept;
                    option.textContent = dept;
                    pqDepartmentFilterSelect.appendChild(option);
                });
            }

            if (pqYearFilterSelect) {
                const uniqueYears = [...new Set(pastQuestionsData.map(pq => pq.year))].sort((a, b) => b - a); // Sort descending
                while (pqYearFilterSelect.options.length > 1) {
                    pqYearFilterSelect.remove(1);
                }
                uniqueYears.forEach(year => {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = year;
                    pqYearFilterSelect.appendChild(option);
                });
            }
        };

        const displayPastQuestions = () => {
            if (!pastQuestionsGrid) return;

            pastQuestionsGrid.innerHTML = '';
            const searchTerm = pqSearchInput ? pqSearchInput.value.toLowerCase().trim() : '';
            const selectedDepartment = pqDepartmentFilterSelect ? pqDepartmentFilterSelect.value : '';
            const selectedLevel = pqLevelFilterSelect ? pqLevelFilterSelect.value : '';
            const selectedSemester = pqSemesterFilterSelect ? pqSemesterFilterSelect.value : '';

            const selectedYearStr = pqYearFilterSelect ? pqYearFilterSelect.value : '';
            const yearFilterValue = selectedYearStr === '' ? '' : parseInt(selectedYearStr);

            const filteredPastQuestions = pastQuestionsData.filter(pq => {
                const matchesSearch = pq.title.toLowerCase().includes(searchTerm) ||
                                      pq.id.toLowerCase().includes(searchTerm) ||
                                      pq.department.toLowerCase().includes(searchTerm) ||
                                      String(pq.year).includes(searchTerm);

                const matchesDepartment = selectedDepartment === '' || pq.department === selectedDepartment;
                const matchesLevel = selectedLevel === '' || pq.level === selectedLevel;
                const matchesSemester = selectedSemester === '' || pq.semester === selectedSemester;
                const matchesYear = yearFilterValue === '' || pq.year === yearFilterValue;

                return matchesSearch && matchesDepartment && matchesLevel && matchesSemester && matchesYear;
            });

            console.log('Filtered past questions:', filteredPastQuestions.length, 'items');


            if (filteredPastQuestions.length > 0) {
                filteredPastQuestions.forEach(renderPastQuestionCard);
                if (noPastQuestionsFound) noPastQuestionsFound.style.display = 'none';
            } else {
                if (noPastQuestionsFound) noPastQuestionsFound.style.display = 'block';
            }
        };

        if (pastQuestionsGrid) {
            populatePQFilters();

            const urlParams = new URLSearchParams(window.location.search);
            const departmentFromUrl = urlParams.get('department');
            if (departmentFromUrl && pqDepartmentFilterSelect) {
                pqDepartmentFilterSelect.value = departmentFromUrl;
            }

            // Event Listeners
            if (pqSearchInput && !pqSearchInput.dataset.hasKeyListener) {
                pqSearchInput.addEventListener('keyup', displayPastQuestions);
                pqSearchInput.dataset.hasKeyListener = 'true';
            }
            if (pqDepartmentFilterSelect && !pqDepartmentFilterSelect.dataset.hasChangeListener) {
                pqDepartmentFilterSelect.addEventListener('change', displayPastQuestions);
                pqDepartmentFilterSelect.dataset.hasChangeListener = 'true';
            }
            if (pqLevelFilterSelect && !pqLevelFilterSelect.dataset.hasChangeListener) {
                pqLevelFilterSelect.addEventListener('change', displayPastQuestions);
                pqLevelFilterSelect.dataset.hasChangeListener = 'true';
            }
            if (pqSemesterFilterSelect && !pqSemesterFilterSelect.dataset.hasChangeListener) {
                pqSemesterFilterSelect.addEventListener('change', displayPastQuestions);
                pqSemesterFilterSelect.dataset.hasChangeListener = 'true';
            }
            if (pqYearFilterSelect && !pqYearFilterSelect.dataset.hasChangeListener) {
                pqYearFilterSelect.addEventListener('change', displayPastQuestions);
                pqYearFilterSelect.dataset.hasChangeListener = 'true';
            }

            displayPastQuestions(); // Initial display
        } else {
            console.warn("'.past-questions-grid' element not found on past-questions.html. Past question cards will not load.");
        }
    };

    // --- Contact Page Specific Logic (only runs on contact.html) ---
    const initializeContactPage = () => {
        const contactForm = document.getElementById('contact-form');
        const messageSentPopupOverlay = document.getElementById('message-sent-popup-overlay');
        const messageSentPopupCloseBtn = document.getElementById('message-sent-popup-close');

        if (contactForm) {
            if (!contactForm.dataset.hasSubmitListener) { // Prevent multiple listeners
                contactForm.addEventListener('submit', (event) => {
                    event.preventDefault(); // Prevent default form submission

                    // Simulate form submission (e.g., an AJAX request to a backend)
                    // In a real application, you would send data to a server here using fetch() or XMLHttpRequest
                    console.log('Simulating form submission...');
                    const formData = new FormData(contactForm);
                    for (let [key, value] of formData.entries()) {
                        console.log(`${key}: ${value}`);
                    }

                    // Show a loader or disable button while submitting (optional)
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    const originalButtonText = submitButton.innerHTML;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    submitButton.disabled = true;

                    setTimeout(() => {
                        // After successful (simulated) submission:
                        contactForm.reset(); // Clear the form
                        if (messageSentPopupOverlay) {
                            messageSentPopupOverlay.classList.add('show'); // Show the success popup
                        }

                        // Restore button state
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;

                        console.log('Message sent successfully!');
                    }, 2000); // Simulate a 2-second delay for submission
                });
                contactForm.dataset.hasSubmitListener = 'true';
            }
        } else {
            console.warn("'#contact-form' element not found on contact.html. Form submission will not be handled by JS.");
        }

        if (messageSentPopupCloseBtn && messageSentPopupOverlay) {
            if (!messageSentPopupCloseBtn.dataset.hasClickListener) {
                messageSentPopupCloseBtn.addEventListener('click', () => {
                    messageSentPopupOverlay.classList.remove('show');
                });
                messageSentPopupCloseBtn.dataset.hasClickListener = 'true';
            }
        }
    };


    // --- Main execution flow ---
    // --- Main execution flow ---
    loadPartials().then(() => {
        const currentPath = window.location.pathname;

        if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
            initializeHomepage();
        } else if (currentPath.includes('all-materials.html')) {
            initializeAllMaterialsPage();
        } else if (currentPath.includes('past-questions.html')) {
            console.log('Initializing Past Questions Page');
            initializePastQuestionsPage();
        } else if (currentPath.includes('contact.html')) { // NEW LINE: Initialize Contact Page
            console.log('Initializing Contact Page');
            initializeContactPage();
        }
        // No specific initialization functions needed for about.html
        // as their content is static and general page features handle them.
    }).catch(error => {
        console.error("Failed to load partials or initialize page:", error);
    });

});