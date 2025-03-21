const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Comprobamos si ya existe un tema preferido guardado
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggleButton.textContent = 'Modo Claro';
}

// Función para cambiar de tema
themeToggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const newTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    themeToggleButton.textContent = body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
});
