document.addEventListener('DOMContentLoaded', () => {
    const projectForm = document.getElementById('project-form');
    const projectsGrid = document.getElementById('projects-grid');

    let projects = JSON.parse(localStorage.getItem('projects')) || [];

    // Function to render projects
    function renderProjects() {
        projectsGrid.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.classList.add('project-card');
            card.dataset.id = project.id;
            card.style.setProperty('--project-color', project.color);

            // Calculate progress (simplified: assuming progress is based on a dummy value for now)
            // In a real app, this would be based on transactions linked to the project
            const currentSpent = project.spent || 0; // Dummy spent amount
            const progress = (currentSpent / project.budget) * 100;
            card.style.setProperty('--progress-width', `${Math.min(progress, 100)}%`);

            card.innerHTML = `
                <h3>${project.name}</h3>
                <p>Budget: $${project.budget.toFixed(2)}</p>
                <p>Spent: $${currentSpent.toFixed(2)}</p>
                <div class="progress-bar-container">
                    <div class="progress-bar"></div>
                </div>
                <p class="summary">Progress: ${progress.toFixed(2)}%</p>
                <div class="actions">
                    <button class="edit" data-id="${project.id}">Edit</button>
                    <button class="delete" data-id="${project.id}">Delete</button>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // Add/Edit Project
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = e.target.dataset.id || Date.now().toString();
        const name = document.getElementById('project-name').value;
        const budget = parseFloat(document.getElementById('project-budget').value);
        const color = document.getElementById('project-color').value;

        const newProject = {
            id, name, budget, color, spent: 0 // Initialize spent to 0
        };

        if (e.target.dataset.id) {
            // Edit existing project
            projects = projects.map(p => p.id === id ? { ...p, ...newProject } : p);
            e.target.removeAttribute('data-id');
            document.querySelector('#project-form button[type="submit"]').textContent = 'Add Project';
        } else {
            // Add new project
            projects.push(newProject);
        }

        localStorage.setItem('projects', JSON.stringify(projects));
        projectForm.reset();
        renderProjects();
    });

    // Edit and Delete functionality
    projectsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const idToDelete = e.target.dataset.id;
            projects = projects.filter(p => p.id !== idToDelete);
            localStorage.setItem('projects', JSON.stringify(projects));
            renderProjects();
        } else if (e.target.classList.contains('edit')) {
            const idToEdit = e.target.dataset.id;
            const projectToEdit = projects.find(p => p.id === idToEdit);

            if (projectToEdit) {
                document.getElementById('project-name').value = projectToEdit.name;
                document.getElementById('project-budget').value = projectToEdit.budget;
                document.getElementById('project-color').value = projectToEdit.color;

                projectForm.dataset.id = projectToEdit.id; // Set ID for editing
                document.querySelector('#project-form button[type="submit"]').textContent = 'Update Project';
            }
        }
    });

    // Apply language and theme from localStorage
    const savedLanguage = localStorage.getItem('userLanguage');
    const savedTheme = localStorage.getItem('userTheme');

    function applyTheme(theme) {
        const body = document.body;
        body.classList.remove('light', 'dark');

        if (theme === 'auto') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                body.classList.add('dark');
            } else {
                body.classList.add('light');
            }
        } else {
            body.classList.add(theme);
        }
    }

    function applyLanguage(lang) {
        const body = document.body;
        if (lang === 'ar') {
            body.classList.add('rtl');
            body.style.fontFamily = 'Cairo, sans-serif';
        } else {
            body.classList.remove('rtl');
            body.style.fontFamily = 'Poppins, sans-serif';
        }
    }

    applyTheme(savedTheme || 'auto');
    applyLanguage(savedLanguage || 'en');

    // Initial render
    renderProjects();

    // Feather icons replacement
    feather.replace();
});