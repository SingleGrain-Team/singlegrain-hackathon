// Single Grain Hackathon - Auto-save functionality
// Uses localStorage for persistence

(function() {
    'use strict';

    const STORAGE_KEY = 'sg-hackathon-data';
    const saveStatus = document.getElementById('saveStatus');
    let saveTimeout;

    // Load saved data on page load
    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        try {
            const data = JSON.parse(saved);

            // Restore input fields
            document.querySelectorAll('input[data-field]').forEach(input => {
                const key = input.getAttribute('data-field');
                if (data[key] !== undefined) {
                    if (input.type === 'checkbox') {
                        input.checked = data[key];
                    } else {
                        input.value = data[key];
                    }
                }
            });

            // Restore contenteditable fields
            document.querySelectorAll('[contenteditable="true"][data-field]').forEach(el => {
                const key = el.getAttribute('data-field');
                if (data[key] !== undefined) {
                    el.textContent = data[key];
                }
            });

            console.log('Data loaded successfully');
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }

    // Save all data
    function saveData() {
        const data = {};

        // Save input fields
        document.querySelectorAll('input[data-field]').forEach(input => {
            const key = input.getAttribute('data-field');
            if (input.type === 'checkbox') {
                data[key] = input.checked;
            } else {
                data[key] = input.value;
            }
        });

        // Save contenteditable fields
        document.querySelectorAll('[contenteditable="true"][data-field]').forEach(el => {
            const key = el.getAttribute('data-field');
            data[key] = el.textContent;
        });

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            showSaveStatus('saved');
            console.log('Data saved successfully');
        } catch (e) {
            console.error('Error saving data:', e);
            showSaveStatus('error');
        }
    }

    // Show save status indicator
    function showSaveStatus(status) {
        saveStatus.classList.remove('saving', 'saved');

        if (status === 'saving') {
            saveStatus.textContent = 'Saving...';
            saveStatus.classList.add('saving');
        } else if (status === 'saved') {
            saveStatus.textContent = 'All changes saved';
            saveStatus.classList.add('saved');

            // Reset to neutral after 2 seconds
            setTimeout(() => {
                saveStatus.classList.remove('saved');
            }, 2000);
        } else if (status === 'error') {
            saveStatus.textContent = 'Error saving';
            saveStatus.style.background = '#ef4444';
        }
    }

    // Debounced save
    function debouncedSave() {
        showSaveStatus('saving');
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveData, 500);
    }

    // Event listeners for inputs
    document.querySelectorAll('input[data-field]').forEach(input => {
        input.addEventListener('input', debouncedSave);
        input.addEventListener('change', debouncedSave);
    });

    // Event listeners for contenteditable
    document.querySelectorAll('[contenteditable="true"][data-field]').forEach(el => {
        el.addEventListener('input', debouncedSave);
        el.addEventListener('blur', saveData);
    });

    // Load data on page load
    document.addEventListener('DOMContentLoaded', loadData);

    // Also try to load immediately in case DOMContentLoaded already fired
    if (document.readyState !== 'loading') {
        loadData();
    }

    // Save before leaving page
    window.addEventListener('beforeunload', saveData);

    // Keyboard shortcut for manual save (Ctrl/Cmd + S)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveData();
        }
    });

})();
