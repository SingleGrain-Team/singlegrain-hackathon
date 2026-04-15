// Single Grain Hackathon - Auto-save
(function() {
    const STORAGE_KEY = 'sg-hackathon-data';
    const saveStatus = document.getElementById('saveStatus');
    let saveTimeout;

    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        try {
            const data = JSON.parse(saved);
            document.querySelectorAll('input[data-field]').forEach(input => {
                const key = input.getAttribute('data-field');
                if (data[key] !== undefined) {
                    input.type === 'checkbox' ? input.checked = data[key] : input.value = data[key];
                }
            });
            document.querySelectorAll('[contenteditable="true"][data-field]').forEach(el => {
                const key = el.getAttribute('data-field');
                if (data[key] !== undefined) el.textContent = data[key];
            });
        } catch (e) {}
    }

    function saveData() {
        const data = {};
        document.querySelectorAll('input[data-field]').forEach(input => {
            const key = input.getAttribute('data-field');
            data[key] = input.type === 'checkbox' ? input.checked : input.value;
        });
        document.querySelectorAll('[contenteditable="true"][data-field]').forEach(el => {
            data[el.getAttribute('data-field')] = el.textContent;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        saveStatus.textContent = 'Saved';
        saveStatus.classList.add('saved');
        setTimeout(() => {
            saveStatus.textContent = 'All changes saved';
            saveStatus.classList.remove('saved');
        }, 1500);
    }

    function debouncedSave() {
        saveStatus.textContent = 'Saving...';
        saveStatus.classList.add('saving');
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveStatus.classList.remove('saving');
            saveData();
        }, 400);
    }

    document.querySelectorAll('input[data-field]').forEach(i => {
        i.addEventListener('input', debouncedSave);
        i.addEventListener('change', debouncedSave);
    });
    document.querySelectorAll('[contenteditable="true"][data-field]').forEach(el => {
        el.addEventListener('input', debouncedSave);
    });

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveData();
        }
    });

    loadData();
})();
