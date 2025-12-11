// share.js - handles content shared to the PWA

(function() {
    // 1. Parse URL for shared data
    const urlParams = new URLSearchParams(window.location.search);
    const sharedTitle = urlParams.get('title') || '';
    const sharedText = urlParams.get('text') || '';
    const sharedUrl = urlParams.get('url') || sharedText; // If url is missing, it might be in the text field

    // Exit if no URL is found
    if (!sharedUrl) {
        console.error("No URL or text was shared.");
        // Maybe show an error message to the user before redirecting
        window.location.href = 'index.html';
        return;
    }

    // 2. Load sections from localStorage
    let sections = [];
    try {
        const stored = localStorage.getItem('myPopAI_sections');
        sections = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Could not load sections from localStorage.', e);
        // Can't proceed without sections data
        window.location.href = 'index.html';
        return;
    }

    // 3. If no sections, create a default one
    if (sections.length === 0) {
        sections.push({
            id: 1,
            title: "Shared Links",
            apps: []
        });
    }

    // 4. Get the last section
    const lastSection = sections[sections.length - 1];

    // 5. Create a new app object
    const newApp = {
        id: Date.now(),
        name: sharedTitle || sharedUrl, // Use title, fallback to the URL
        url: sharedUrl,
        icon: '', // No icon by default for shared links
        description: sharedTitle ? sharedText : '' // If title was used for name, use text for description
    };

    // 6. Add the new app to the last section
    lastSection.apps.push(newApp);

    // 7. Save the updated sections array to localStorage
    try {
        localStorage.setItem('myPopAI_sections', JSON.stringify(sections));
    } catch (e) {
        console.error('Storage not available, could not save new link.', e);
        // Redirect anyway, but the link won't be saved.
    }

    // 8. Redirect to the main page
    window.location.href = 'index.html';

})();
