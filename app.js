// =================================================================================
// Application State
// =================================================================================
let sections = [];
let editingSectionId = null;
let editingAppId = null;
let deferredPrompt = null;
let confirmCallback = null;

// =================================================================================
// Default Data
// =================================================================================
const defaultSections = [
    {
        id: 1,
               title: "BIZELIA AI Prompt Generation Tools",
        apps: [
            { id: 101, name: 'LLMs', url: 'https://graphtec.fr/bizelia-en/#expressLLMLauncher', icon: '✨', description: 'Type your prompt in selected LLM' },
            { id: 102, name: 'New Prompt', url:'https://graphtec.fr/bizelia-en/bizelia_prompt_creation.html?templateId=default_express_template_v1', icon: '📝', description: 'Select LLM and Template and Type your Prompt' },
            { id: 103, name: 'Template/System Prompts', url:'https://graphtec.fr/bizelia-en/bizelia_modeles_prompts.html', icon: '🏥', description: 'Improve your prompts' },
            { id: 104, name: 'AI Forms', url:'https://graphtec.fr/bizelia-en/app-server.html', icon: '📚', description: 'Use formatted Forms to create Prompt' },
            { id: 105, name: 'Create new AI Form', url:'https://graphtec.fr/bizelia-en/bizelia_prompt_creation.html?templateId=AI%20HTML%20Form%20Generator', icon: '🧾', description: 'Create a new AI Form Template and add it to AI Forms' }
         ]
    },
    {
        id: 2,
        title: "Shared Docs, YouTube, Apps",
        apps: [

        ]
    }
];

// =================================================================================
// Initialization
// =================================================================================
function init() {
    loadTheme();
    loadSections();
    render();
    setupEventListeners();
    setupPWA();
}

// =================================================================================
// Data Persistence (LocalStorage)
// =================================================================================
function loadSections() {
    try {
        const stored = localStorage.getItem('myPopAI_sections');
        sections = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(defaultSections));
        if (!stored) saveSections();
    } catch (e) {
        sections = JSON.parse(JSON.stringify(defaultSections));
    }
}

function saveSections() {
    try {
        localStorage.setItem('myPopAI_sections', JSON.stringify(sections));
    } catch (e) {
        console.error('Storage not available');
    }
}

// =================================================================================
// Main Rendering
// =================================================================================
function render(sectionsToRender = sections) {
    const sectionsContainer = document.getElementById('sectionsContainer');
    const emptyState = document.getElementById('emptyState');

    // Check if the filtered sections are empty OR if all sections are empty
    // If the search yields no results AND there are existing sections,
    // we should display a specific "no results" message, not the general "no sections yet"
    if (sectionsToRender.length === 0) {
        if (sections.length > 0) { // If there are sections but no filter match
            sectionsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search-minus"></i>
                    <h3>No results found</h3>
                    <p>Try a different search term.</p>
                </div>
            `;
            emptyState.style.display = 'none'; // Hide default empty state
        } else { // No sections at all (initial state)
            sectionsContainer.innerHTML = '';
            emptyState.style.display = 'block';
        }
        addRenderEventListeners(); // still need to add listeners for any remaining interactive elements, like section titles
        return;
    }

    emptyState.style.display = 'none';
    sectionsContainer.innerHTML = sectionsToRender.map(section => renderSection(section)).join('');
    addRenderEventListeners();
}

function renderSection(section) {
    return `
        <div class="app-section" data-section-id="${section.id}">
            <div class="section-header">
                <h2 class="section-title" data-section-id="${section.id}">${section.title}</h2>
                <div class="section-actions">
                    <button class="icon-btn add-app" title="Add Shared doc, PDF, YT, App" data-section-id="${section.id}"><i class="fas fa-plus"></i></button>
                    <button class="icon-btn edit-section-title" title="Edit Section Title" data-section-id="${section.id}"><i class="fas fa-pen"></i></button>
                    <button class="icon-btn delete-section" title="Delete Section" data-section-id="${section.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="app-grid">
                ${section.apps.map(app => renderAppCard(app, section.id)).join('')}
            </div>
        </div>
    `;
}

function getLinkPreview(url) {
    if (!url) return { type: 'default', previewUrl: null };

    try {
        let fullUrl = url;
        if (!/^(https?:|file:)/i.test(fullUrl)) {
            fullUrl = 'https://' + fullUrl;
        }
        const urlObj = new URL(fullUrl);

        // Common file extensions
        const isImage = /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(urlObj.pathname);
        const isPdf = /\.pdf$/i.test(urlObj.pathname);
        
        // Video services
        const isYouTube = urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
        
        // Google Workspace
        const isGoogleDoc = urlObj.hostname === 'docs.google.com' && urlObj.pathname.includes('/document/');
        const isGoogleSheet = urlObj.hostname === 'docs.google.com' && urlObj.pathname.includes('/spreadsheets/');
        const isGoogleSlides = urlObj.hostname === 'docs.google.com' && urlObj.pathname.includes('/presentation/');
        const isGoogleForms = urlObj.hostname === 'docs.google.com' && urlObj.pathname.includes('/forms/');

        if (isImage) return { type: 'image', previewUrl: url }; // Use original URL for image source
        if (isPdf) return { type: 'pdf', previewUrl: null };
        if (isGoogleDoc) return { type: 'gdoc', previewUrl: null };
        if (isGoogleSheet) return { type: 'gsheet', previewUrl: null };
        if (isGoogleSlides) return { type: 'gslides', previewUrl: null };
        if (isGoogleForms) return { type: 'gforms', previewUrl: null };

        if (isYouTube) {
            let videoId = null;
            if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.slice(1).split('?')[0];
            } else if (urlObj.searchParams.has('v')) {
                videoId = urlObj.searchParams.get('v');
            } else if (urlObj.pathname.includes('/embed/')) {
                videoId = urlObj.pathname.split('/embed/')[1].split('/')[0];
            }
            
            if (videoId) {
                return { type: 'youtube', previewUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` };
            }
        }
    } catch (e) {
        // Invalid URL, treat as default
        return { type: 'default', previewUrl: null };
    }

    return { type: 'default', previewUrl: null };
}

function renderAppCard(app, sectionId) {
    const descriptionHTML = app.description ? `<div class="app-description">${app.description}</div>` : '';
    
    let iconContainerClass = "app-icon";
    let iconHTML = '';

    if (app.icon) {
        if (app.icon.startsWith('data:image')) {
            iconHTML = `<img src="${app.icon}" class="app-preview-image" alt="${app.name} icon">`;
        } else {
            iconContainerClass += " icon-background";
            iconHTML = app.icon.startsWith('fa') ? `<i class="${app.icon}"></i>` : app.icon;
        }
    } else {
        // If no icon, generate a preview
        const preview = getLinkPreview(app.url);
        if (preview.type === 'image' || preview.type === 'youtube') {
            iconHTML = `<img src="${preview.previewUrl}" class="app-preview-image" alt="${app.name} preview" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML += '<i class=\'fas fa-link\'></i>'; this.parentElement.classList.add('icon-background');">`;
        } else {
            iconContainerClass += " icon-background";
            switch (preview.type) {
                case 'pdf':
                    iconHTML = '<i class="fas fa-file-pdf app-file-icon"></i>';
                    break;
                case 'gdoc':
                    iconHTML = '<i class="fas fa-file-word app-file-icon"></i>';
                    break;
                case 'gsheet':
                    iconHTML = '<i class="fas fa-file-spreadsheet app-file-icon"></i>';
                    break;
                case 'gslides':
                    iconHTML = '<i class="fas fa-file-powerpoint app-file-icon"></i>';
                    break;
                case 'gforms':
                    iconHTML = '<i class="fas fa-list-check app-file-icon"></i>';
                    break;
                default:
                    // Default fallback icon if no user icon and no preview
                    iconHTML = '<i class="fas fa-link"></i>';
                    break;
            }
        }
    }

    return `
        <a href="${app.url}" target="_blank" class="app-card" data-app-id="${app.id}" data-section-id="${sectionId}">
            <div class="app-actions">
                <button class="icon-btn edit-app" title="Edit App" data-app-id="${app.id}"><i class="fas fa-edit"></i></button>
                <button class="icon-btn move-app" title="Move to another section" data-app-id="${app.id}"><i class="fas fa-random"></i></button>
                <button class="icon-btn delete-app" title="Delete App" data-app-id="${app.id}"><i class="fas fa-trash"></i></button>
            </div>
            <div class="${iconContainerClass}">
                ${iconHTML}
            </div>
            <div class="app-name">${app.name}</div>
            ${descriptionHTML}
        </a>
    `;
}



// =================================================================================
// Event Listeners
// =================================================================================
function setupEventListeners() {
    // Header
    document.getElementById('hamburger-menu').addEventListener('click', () => {
        document.body.classList.toggle('nav-active');
    });
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('addSectionBtn').addEventListener('click', openAddSectionModal);
    document.getElementById('expressPasteBtn').addEventListener('click', handleExpressPaste);

    // Search Input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        const filtered = filterApplications(searchTerm);
        render(filtered);
    });
    
    // Modals (General)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAllModals();
            }
        });
    });

    // App Modal
    document.getElementById('closeModal').addEventListener('click', closeAppModal);
    document.getElementById('cancelBtn').addEventListener('click', closeAppModal);
    document.getElementById('appForm').addEventListener('submit', handleAppFormSubmit);
    document.getElementById('appUrl').addEventListener('blur', handleUrlBlur);
    document.getElementById('appIcon').addEventListener('paste', handleIconPaste);

    // Section Modal
    document.getElementById('closeSectionModal').addEventListener('click', closeSectionModal);
    document.getElementById('cancelSectionBtn').addEventListener('click', closeSectionModal);
    document.getElementById('sectionForm').addEventListener('submit', handleSectionFormSubmit);

    // Move App Modal
    document.getElementById('closeMoveAppModal').addEventListener('click', closeMoveAppModal);

    // Import/Export Modal
    document.getElementById('importExportBtn').addEventListener('click', openImportExportModal);
    document.getElementById('closeImportExport').addEventListener('click', closeImportExportModal);
    document.getElementById('exportConfigBtn').addEventListener('click', exportConfig);
    document.getElementById('importFile').addEventListener('change', handleFileImport);

    // Confirm Dialog
    document.getElementById('closeConfirm').addEventListener('click', closeConfirmDialog);
    document.getElementById('confirmCancel').addEventListener('click', closeConfirmDialog);
    document.getElementById('confirmOk').addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback();
        }
        closeConfirmDialog();
    });

    // PWA Install
    document.getElementById('installBtn').addEventListener('click', installPWA);

    // About Modal
    document.getElementById('aboutBtn').addEventListener('click', openAboutModal);
    document.getElementById('closeAboutModal').addEventListener('click', closeAboutModal);
}

async function addLinkToLastSection(url) {
    if (!url) {
        showToast('No URL provided.', 'error');
        return;
    }

    // Simple validation for a URL
    try {
        new URL(url);
    } catch (_) {
        showToast('Invalid URL format.', 'error');
        return;
    }

    if (sections.length === 0) {
        showToast('No sections available. Please create a section first.', 'error');
        return;
    }

    const lastSection = sections[sections.length - 1];
    
    const newApp = {
        id: Date.now(),
        name: url,
        url: url,
        icon: '',
        description: ''
    };

    const isYouTube = /youtube\.com|youtu\.be/i.test(url);
    if (isYouTube) {
        showToast('Pasting YouTube link, fetching info...');
        try {
            const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
            if (response.ok) {
                const data = await response.json();
                newApp.name = data.title;
                newApp.description = `By ${data.author_name}`;
            }
        } catch (e) {
            console.warn('Could not fetch YouTube oEmbed data for paste.', e);
        }
    }

    lastSection.apps.push(newApp);
    saveSections();
    render();
    showToast('Link added successfully!', 'success');
}

async function handleExpressPaste() {
    if (sections.length === 0) {
        showToast('No sections available. Please create a section first.', 'error');
        return;
    }
    const lastSection = sections[sections.length - 1];
    
    // Open the modal for the last section
    openAddAppModal(lastSection.id);

    let pastedUrl = '';

    if (navigator.clipboard && navigator.clipboard.readText) {
        try {
            const text = await navigator.clipboard.readText();
            pastedUrl = text.trim();
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            // Not a hard error, just fallback to manual input
        }
    }

    const urlInput = document.getElementById('appUrl');
    const nameInput = document.getElementById('appName');

    if (pastedUrl) {
        urlInput.value = pastedUrl;
        showToast('URL pasted from clipboard! Please complete the details.', 'success');
        // Trigger blur event to fetch metadata like title
        urlInput.dispatchEvent(new Event('blur'));
        nameInput.focus(); // Focus on name, since URL is filled
    } else {
        showToast('Please paste the URL and fill in the details.', 'info');
        urlInput.focus(); // Focus on URL for manual paste
    }
}

function addRenderEventListeners() {
    // Add App buttons
    document.querySelectorAll('.add-app').forEach(btn => {
        btn.addEventListener('click', () => {
            openAddAppModal(parseInt(btn.dataset.sectionId));
        });
    });

    // Edit/Delete/Move App buttons
    document.querySelectorAll('.edit-app').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            openEditAppModal(parseInt(btn.dataset.appId));
        });
    });
    document.querySelectorAll('.move-app').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            openMoveAppModal(parseInt(btn.dataset.appId));
        });
    });
    document.querySelectorAll('.delete-app').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            deleteApp(parseInt(btn.dataset.appId));
        });
    });

    // Section Title editing
    document.querySelectorAll('.edit-section-title').forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = parseInt(btn.dataset.sectionId);
            const titleEl = document.querySelector(`.section-title[data-section-id="${sectionId}"]`);
            makeTitleEditable(titleEl, sectionId);
        });
    });
    
    // Delete Section buttons
    document.querySelectorAll('.delete-section').forEach(btn => {
        btn.addEventListener('click', () => {
            deleteSection(parseInt(btn.dataset.sectionId));
        });
    });
}


// =================================================================================
// Section CRUD
// =================================================================================
function openAddSectionModal() {
    editingSectionId = null;
    document.getElementById('sectionModalTitle').textContent = 'Add New Section';
    document.getElementById('sectionForm').reset();
    document.getElementById('sectionModal').classList.add('active');
}

function openEditSectionModal(sectionId) {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    editingSectionId = sectionId;
    document.getElementById('sectionModalTitle').textContent = 'Edit Section';
    document.getElementById('sectionName').value = section.title;
    document.getElementById('sectionModal').classList.add('active');
}

function handleSectionFormSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('sectionName').value.trim();
    if (!title) {
        showToast('Section name cannot be empty', 'error');
        return;
    }

    if (editingSectionId) {
        const section = sections.find(s => s.id === editingSectionId);
        if (section) {
            section.title = title;
            showToast('Section updated successfully', 'success');
        }
    } else {
        sections.push({ id: Date.now(), title: title, apps: [] });
        showToast('Section added successfully', 'success');
    }

    saveSections();
    render();
    closeSectionModal();
}

function deleteSection(sectionId) {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    showConfirmDialog(
        `Are you sure you want to delete the "${section.title}" section and all its apps?`,
        () => {
            sections = sections.filter(s => s.id !== sectionId);
            saveSections();
            render();
            showToast('Section deleted successfully', 'success');
        }
    );
}

function makeTitleEditable(titleEl, sectionId) {
    titleEl.setAttribute('contenteditable', 'true');
    titleEl.focus();
    const originalTitle = titleEl.textContent;

    const saveChanges = () => {
        titleEl.removeAttribute('contenteditable');
        const newTitle = titleEl.textContent.trim();
        if (newTitle && newTitle !== originalTitle) {
            const section = sections.find(s => s.id === sectionId);
            if (section) {
                section.title = newTitle;
                saveSections();
                showToast('Title updated', 'success');
            }
        } else {
            titleEl.textContent = originalTitle; // Revert if empty or unchanged
        }
        titleEl.removeEventListener('blur', saveChanges);
        titleEl.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveChanges();
        } else if (e.key === 'Escape') {
            titleEl.textContent = originalTitle;
            saveChanges();
        }
    };
    
    titleEl.addEventListener('blur', saveChanges);
    titleEl.addEventListener('keydown', handleKeydown);
}

// =================================================================================
// App CRUD
// =================================================================================
function findApp(appId) {
    for (const section of sections) {
        const app = section.apps.find(a => a.id === appId);
        if (app) return { app, section };
    }
    return { app: null, section: null };
}

/**
 * Filters applications and sections based on a search term.
 * @param {string} searchTerm The term to search for.
 * @returns {Array<Object>} A new array of sections containing only matching apps, or sections with matching titles.
 */
function filterApplications(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (!lowerCaseSearchTerm) {
        return sections; // If search term is empty, return all sections
    }

    const filteredSections = [];

    sections.forEach(section => {
        const matchingApps = section.apps.filter(app => 
            app.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            app.url.toLowerCase().includes(lowerCaseSearchTerm) ||
            (app.description && app.description.toLowerCase().includes(lowerCaseSearchTerm))
        );

        // If section title matches or there are matching apps, include the section
        if (section.title.toLowerCase().includes(lowerCaseSearchTerm) || matchingApps.length > 0) {
            filteredSections.push({
                ...section,
                apps: matchingApps // Only include apps that matched the filter
            });
        }
    });

    return filteredSections;
}

function openAddAppModal(sectionId) {
    editingAppId = null;
    editingSectionId = sectionId;
    document.getElementById('modalTitle').textContent = 'Add Application';
    document.getElementById('appForm').reset();
    // Explicitly clear fields to prevent any weird state or browser autofill issues
    document.getElementById('appName').value = '';
    document.getElementById('appUrl').value = '';
    document.getElementById('appDescription').value = '';
    document.getElementById('appIcon').value = '';
    document.getElementById('appModal').classList.add('active');
}

function openEditAppModal(appId) {
    const { app, section } = findApp(appId);
    if (!app) return;

    editingAppId = appId;
    editingSectionId = section.id;
    document.getElementById('modalTitle').textContent = 'Edit Application';
    document.getElementById('appName').value = app.name;
    document.getElementById('appUrl').value = app.url;
    document.getElementById('appIcon').value = app.icon;
    document.getElementById('appDescription').value = app.description || '';
    document.getElementById('appModal').classList.add('active');
}

function handleAppFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('appName').value.trim();
    const url = document.getElementById('appUrl').value.trim();
    const icon = document.getElementById('appIcon').value.trim();
    const description = document.getElementById('appDescription').value.trim();

    if (!name || !url) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    if (editingAppId) { // Editing existing app
        const { app } = findApp(editingAppId);
        if (app) {
            app.name = name;
            app.url = url;
            app.icon = icon;
            app.description = description;
            showToast('Application updated successfully', 'success');
        }
    } else { // Adding new app
        const section = sections.find(s => s.id === editingSectionId);
        if (section) {
            section.apps.push({ id: Date.now(), name, url, icon, description });
            showToast('Application added successfully', 'success');
        }
    }

    saveSections();
    render();
    closeAppModal();
}

async function handleUrlBlur(event) {
    const url = event.target.value.trim();
    if (!url) return;

    const appNameInput = document.getElementById('appName');
    
    // Only proceed if the app name is empty
    if (appNameInput.value.trim() !== '') {
        return;
    }

    const isYouTube = /youtube\.com|youtu\.be/i.test(url);

    if (isYouTube) {
        showToast('Fetching YouTube info...');
        try {
            const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
            if (response.ok) {
                const data = await response.json();
                appNameInput.value = data.title;
                if (document.getElementById('appDescription').value.trim() === '') {
                    document.getElementById('appDescription').value = `By ${data.author_name}`;
                }
                showToast('YouTube info populated!', 'success');
            } else {
                showToast('Could not fetch YouTube info', 'error');
            }
        } catch (e) {
            console.warn('Could not fetch YouTube oEmbed data.', e);
            showToast('Error fetching YouTube data', 'error');
        }
    }
}

function deleteApp(appId) {
    const { app, section } = findApp(appId);
    if (!app) return;

    showConfirmDialog(
        `Are you sure you want to delete "${app.name}"?`,
        () => {
            section.apps = section.apps.filter(a => a.id !== appId);
            saveSections();
            render();
            showToast('Application deleted successfully', 'success');
        }
    );
}

function handleIconPaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let index in items) {
        const item = items[index];
        if (item.kind === 'file') {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('appIcon').value = event.target.result;
            }; 
            reader.readAsDataURL(blob);
        }
    }
}

function openMoveAppModal(appId) {
    const { app, section: currentSection } = findApp(appId);
    if (!app) return;

    editingAppId = appId; // Keep track of the app being moved

    const sectionList = document.getElementById('moveAppSectionList');
    sectionList.innerHTML = ''; // Clear previous list

    const otherSections = sections.filter(s => s.id !== currentSection.id);

    if (otherSections.length === 0) {
        sectionList.innerHTML = '<p style="padding: 1rem; text-align: center;">No other sections available.</p>';
    } else {
        otherSections.forEach(section => {
            const sectionButton = document.createElement('button');
            sectionButton.className = 'section-move-button';
            sectionButton.textContent = section.title;
            sectionButton.addEventListener('click', () => moveApp(app.id, section.id));
            sectionList.appendChild(sectionButton);
        });
    }

    document.getElementById('moveAppModal').classList.add('active');
}

function moveApp(appId, newSectionId) {
    const { app, section: oldSection } = findApp(appId);
    const newSection = sections.find(s => s.id === newSectionId);

    if (!app || !oldSection || !newSection) {
        showToast('An error occurred while moving the app.', 'error');
        return;
    }

    // Remove from old section
    oldSection.apps = oldSection.apps.filter(a => a.id !== appId);
    // Add to new section
    newSection.apps.push(app);

    saveSections();
    render();
    closeMoveAppModal();
    showToast(`Moved '${app.name}' to '${newSection.title}'`, 'success');
}


// =================================================================================
// Modal Management
// =================================================================================
function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
    document.body.classList.remove('nav-active');
    closeAboutModal();
    closeMoveAppModal();
}
function closeAppModal() {
    document.getElementById('appModal').classList.remove('active');
    editingAppId = null;
    editingSectionId = null;
}
function closeSectionModal() {
    document.getElementById('sectionModal').classList.remove('active');
    editingSectionId = null;
}
function closeMoveAppModal() {
    document.getElementById('moveAppModal').classList.remove('active');
    editingAppId = null;
}
function closeImportExportModal() {
    document.getElementById('importExportModal').classList.remove('active');
}

function openAboutModal() {
    closeAllModals(); // Close any other open modals first
    document.getElementById('aboutModal').classList.add('active');
}
function closeAboutModal() {
    document.getElementById('aboutModal').classList.remove('active');
}
function showConfirmDialog(message, callback) {
    closeAllModals();
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = callback;
    document.getElementById('confirmDialog').classList.add('active');
}
function closeConfirmDialog() {
    document.getElementById('confirmDialog').classList.remove('active');
    confirmCallback = null;
}


// =================================================================================
// Theme Management
// =================================================================================
function loadTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } catch (e) {
        document.body.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }
}
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    try {
        localStorage.setItem('theme', newTheme);
    } catch (e) { console.log('Theme preference not saved'); }
    updateThemeIcon(newTheme);
}
function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}


// =================================================================================
// Toast Notifications
// =================================================================================
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="toast-icon fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastUp 0.5s ease reverse';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}


// =================================================================================
// Import / Export
// =================================================================================
function openImportExportModal() {
    closeAllModals();
    document.getElementById('configJson').value = JSON.stringify(sections, null, 2);
    document.getElementById('importExportModal').classList.add('active');
}

async function exportConfig() {
    const dataStr = JSON.stringify(sections, null, 2);
    const baseFilename = `myPopAI-config-${Date.now()}`;
    const defaultJsonFilename = `${baseFilename}.json`;
    const defaultMarkdownFilename = `${baseFilename}.md`;

    // Use the modern File System Access API if available
    if (window.showSaveFilePicker) {
        try {
            // Save JSON
            const jsonHandle = await window.showSaveFilePicker({
                suggestedName: defaultJsonFilename,
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] },
                }],
            });
            const jsonWritable = await jsonHandle.createWritable();
            await jsonWritable.write(dataStr);
            await jsonWritable.close();
            showToast('JSON Configuration saved successfully', 'success');

            // Save Markdown
            const markdownContent = sections
                .filter(section => section.title !== 'BIZELIA AI Prompt Generation Tools')
                .flatMap(section => section.apps.map(app => app.url))
                .join('\r\n');

            const markdownHandle = await window.showSaveFilePicker({
                suggestedName: defaultMarkdownFilename,
                types: [{
                    description: 'Markdown Files',
                    accept: { 'text/markdown': ['.md'] },
                }],
            });
            const markdownWritable = await markdownHandle.createWritable();
            await markdownWritable.write(markdownContent);
            await markdownWritable.close();
            showToast('Markdown Configuration saved successfully', 'success');
            
            return; // Exit after successful save
        } catch (error) {
            // AbortError is expected if the user cancels the dialog.
            if (error.name === 'AbortError') {
                showToast('Export cancelled', 'info');
                return;
            }
            // For other errors, log them and fall through to the legacy method.
            console.error('Error with showSaveFilePicker, falling back:', error);
            showToast('Save dialog failed, using fallback export.', 'error');
        }
    }

    // --- Legacy Fallback Logic ---
    const userFilename = prompt("Your browser doesn't support saving to a specific folder. Please enter a base filename to export:", baseFilename);

    if (userFilename === null) {
        showToast('Export cancelled', 'info');
        return;
    }

    const filename = userFilename.trim() || baseFilename;
    const jsonFileToDownload = new File([dataStr], `${filename}.json`, { type: 'application/json' });
    
    // Create and download Markdown
    const markdownContent = sections
        .filter(section => section.title !== 'BIZELIA AI Prompt Generation Tools')
        .flatMap(section => section.apps.map(app => app.url))
        .join('\r\n');
    const markdownFileToDownload = new File([markdownContent], `${filename}.md`, { type: 'text/markdown' });

    showToast('Exporting configuration files...', 'success');
    downloadFallback(jsonFileToDownload);
    downloadFallback(markdownFileToDownload);
}


function downloadFallback(blob) {
    const url = URL.createObjectURL(blob);
    const filename = blob.name || `myPopAI-config-${Date.now()}.json`;

    // Try to open the URL in a new window/tab, which often prompts a download dialog more reliably
    try {
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
            // Give a short delay to allow the download to start before revoking the URL
            // and potentially closing the new window (if it wasn't a true download)
            setTimeout(() => {
                URL.revokeObjectURL(url);
                // We don't try to close newWindow here, as it might be a valid download window
            }, 100);
            return; // Exit if window.open was successful
        }
    } catch (e) {
        console.warn('window.open for download was blocked or failed:', e);
        // Fall through to the <a> tag method if window.open fails
    }

    // Fallback to the <a> tag method if window.open was blocked or failed
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importConfig() {
    try {
        const jsonText = document.getElementById('configJson').value;
        const importedData = JSON.parse(jsonText);

        if (!Array.isArray(importedData)) {
            throw new Error('Invalid format: Must be an array of sections.');
        }
        
        // Basic validation
        const isValid = importedData.every(s => s.hasOwnProperty('title') && s.hasOwnProperty('apps') && Array.isArray(s.apps));
        if(!isValid) {
            throw new Error('Invalid format: Each section must have a title and an apps array.');
        }

        sections = importedData;
        saveSections();
        render();
        closeImportExportModal();
        showToast('Configuration imported successfully', 'success');
    } catch (e) {
        showToast(e.message || 'Invalid JSON format', 'error');
    }
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) {
        showToast('No file selected', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        document.getElementById('configJson').value = content;
        importConfig();
    };
    reader.onerror = function() {
        showToast('Failed to read file', 'error');
    };
    reader.readAsText(file);
}


// =================================================================================
// PWA Functionality
// =================================================================================
function setupPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.error('SW registration failed: ', err);
            });
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('installBtn').style.display = 'flex';
    });
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((result) => {
            if (result.outcome === 'accepted') {
                showToast('App installed successfully!', 'success');
            }
            deferredPrompt = null;
            document.getElementById('installBtn').style.display = 'none';
        });
    }
}

// =================================================================================
// Run Application
// =================================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
