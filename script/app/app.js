document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app');

    async function loadSidebar() {
        try {
            const response = await fetch('./view/sidebar.html');
            const data = await response.text();
            app.innerHTML += data.trim();
        } catch (error) {
            console.error('Error fetching sidebar:', error);
        }
    }

    async function loadMain() {
        try {
            const response = await fetch('./view/main.html');
            const data = await response.text();
            app.innerHTML += data.trim();
        } catch (error) {
            console.error('Error fetching main content:', error);
        }
    }

    async function initialize() {
        try {
            await loadSidebar();
            await loadMain();
            const currentPage = sessionStorage.getItem('currentPage');
            if (currentPage === 'books') {
                showBooksPage();
            } else {
                showDashboardPage();
            }
        } catch (error) {
            console.error(error);
        }
    }

    initialize();
});
