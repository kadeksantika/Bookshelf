async function showDashboardPage() {
    try {
        const response = await fetch('./view/pages/dashboard.html');
        const data = await response.text();
        const mainContent = document.getElementById('pages');
        mainContent.innerHTML = data.trim();
        sessionStorage.setItem('currentPage', 'dashboard');
        setActivePage('dashboard');

        setTimeout(() => {
            document.dispatchEvent(new Event(RENDER_EVENT_DASHBOARD));
        }, 40);

    } catch (error) {
        console.error('Error fetching dashboard content:', error);
    }
}

async function showBooksPage() {
    try {
        const response = await fetch('./view/pages/books.html');
        const data = await response.text();
        const mainContent = document.getElementById('pages');
        mainContent.innerHTML = data.trim();
        sessionStorage.setItem('currentPage', 'books');
        setActivePage('books');
        setTimeout(() => {
            document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
        }, 40)
    } catch (error) {
        console.error('Error fetching books content:', error);
    }
}
async function showEmptyDashboard() {
    try {
        const response = await fetch('./view/components/emptybookcard.html');
        const data = await response.text();
        const dashboard = document.getElementById('dashboard');
        dashboard.innerHTML += data.trim();

    } catch (error) {
        console.error('Error fetching dashboard content:', error);
    }
}
async function showEmptyBooks() {
    try {
        const response = await fetch('./view/components/emptybookcard.html');
        const data = await response.text();
        const dashboard = document.getElementById('books');
        dashboard.innerHTML = data.trim();
        const btncta = document.getElementById('cta-books');
        btncta.remove();
    } catch (error) {
        console.error('Error fetching dashboard content:', error);
    }
}
async function showDashboardContent() {
    try {
        const response = await fetch('./view/components/dashboardcontent.html');
        const data = await response.text();
        const dashboard = document.getElementById('dashboard');
        dashboard.innerHTML += data.trim();

    } catch (error) {
        console.error('Error fetching dashboard content:', error);
    }
}
async function showBooksContent() {
    try {
        const response = await fetch('./view/components/bookscontent.html');
        const data = await response.text();
        const books = document.getElementById('books');
        books.innerHTML = data.trim();
    } catch (error) {
        console.error('Error fetching dashboard content:', error);
    }
}
async function showBooks() {
    try {
        const response = await fetch('./view/components/cardbook.html');
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching dashboard content:', error);
    }
}
async function showDialog(isActive, status, message, id) {
    try {
        const app = document.getElementById('app');
        const dialog = document.getElementById('dialog');
        if (isActive === true) {
            const response = await fetch('./view/components/dialog.html');
            const data = await response.text();

            const updateInnerHTML = new Promise((resolve) => {
                app.innerHTML += data.trim();
                resolve();
            });

            updateInnerHTML.then(() => {
                setTimeout(() => {
                    const newDialog = document.getElementById('dialog');
                    if (newDialog) {
                        const messageElement = document.getElementById('message-dialog');
                        const btnOk = document.getElementById('btn-dialog-ok');
                        const btnCancel = document.getElementById('btn-dialog-cancel');
                        newDialog.classList.add('active');
                        if (status == "success") {
                            newDialog.classList.add('success');
                            btnOk.addEventListener('click', function () {
                                showDialog(false);
                            });
                            btnCancel.remove();
                        } else if (status == "danger") {
                            newDialog.classList.add('danger');
                            btnOk.addEventListener('click', function () {
                                showDialog(false);
                            });
                            btnCancel.remove();
                        }
                        else {
                            newDialog.classList.add('warning');
                            btnOk.addEventListener('click', function (event) {
                                event.preventDefault();
                                removeBook(id);
                            });
                            btnCancel.addEventListener('click', function (event) {
                                event.preventDefault();
                                showDialog(false);
                            });
                        }
                        messageElement.innerText = message;
                    }
                }, 1);
            });
        } else {
            if (dialog) {
                dialog.classList.remove('active');
                if (status == "success") {
                    dialog.classList.remove('success');
                } else if (status == "danger") {
                    dialog.classList.remove('danger');
                }
                else {
                    dialog.classList.remove('warning');
                }
                setTimeout(() => {
                    dialog.remove();
                    const currentPage = sessionStorage.getItem('currentPage');
                    if (currentPage === 'books') {
                        document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
                    }
                }, 300);
            }
        }
    } catch (error) {
        console.error('Error fetching main content:', error);
    }
}



async function showForm(isActive, book) {
    try {
        const app = document.getElementById('app');
        const formContainer = document.getElementById('form-container');

        if (isActive === true) {
            const response = await fetch('./view/components/form.html');
            const data = await response.text();

            const updateInnerHTML = new Promise((resolve) => {
                app.innerHTML += data.trim();
                resolve();
            });

            updateInnerHTML.then(() => {
                setTimeout(() => {
                    const newFormContainer = document.getElementById('form-container');
                    if (newFormContainer) {
                        newFormContainer.classList.add('active');
                        const btnSubmit = document.getElementById("submitForm");
                        const header = document.getElementById("header-form")

                        if (book) {
                            document.getElementById('title').value = book.title;
                            document.getElementById('year').value = book.year;
                            document.getElementById('author').value = book.author;
                            if (book.isComplete) {
                                document.getElementById('yes').checked = true;
                            } else {
                                document.getElementById('notyet').checked = true;
                            }
                            btnSubmit.addEventListener('click', function () {
                                submitForm(book.id);
                            });
                            btnSubmit.value = "Edit book";
                            header.innerText = "Edit book";
                        } else {
                            document.getElementById('notyet').checked = true;
                            btnSubmit.addEventListener('click', function () {
                                submitForm();
                            });
                        }
                    }
                }, 1);
            });
        } else {
            if (formContainer) {
                formContainer.classList.remove('active');;
                setTimeout(() => {
                    formContainer.remove();
                    const currentPage = sessionStorage.getItem('currentPage');
                    if (currentPage === 'books') {
                        document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
                    }
                }, 300);
            }
        }
    } catch (error) {
        console.error('Error fetching form content:', error);
    }
}

function activeSidebar(){
    const sidebar = document.getElementById("sidebar");
    const sidebarBtn = document.getElementById("sidebar-btn");

    if(sidebar.classList.contains('active')){
        sidebar.classList.remove('active');
        sidebarBtn.classList.remove('active');
    }else{
        sidebar.classList.add('active');
        sidebarBtn.classList.add('active');
    }

}

function setActivePage(page) {
    const booksButton = document.getElementById('books-button')
    const dashboardButton = document.getElementById('dashboard-button')
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    if (page === 'dashboard') {
        dashboardButton.classList.add('active');
    } else if (page === 'books') {
        booksButton.classList.add('active');
    }
}