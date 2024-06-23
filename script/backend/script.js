const books = [];
const STORAGE_KEY = 'BOOKSHELF_APPS';
const RENDER_EVENT_DASHBOARD = 'render-books-dashboardpage';
const RENDER_EVENT_BOOKS = 'render-books-bookspage';


if (isStorageExist()) {
    loadDataFromStorage();
}

function submitForm(id) {
    if (id) {
        editBook(id);
    } else {
        addBook();
    }
}



async function addBook() {
    const title = document.getElementById('title').value;
    const year = parseInt(document.getElementById('year').value);
    const author = document.getElementById('author').value;
    const isComplete = document.querySelector('input[name="isComplete"]:checked').value === 'true';

    try {
        if (!title) {
            alert("Book title cannot be empty.");
            throw new Error("Book title cannot be empty.");
        }
        if (!year) {
            alert("Book year cannot be empty.");
            throw new Error("Book year cannot be empty.");
        }
        if (!author) {
            alert("Book author cannot be empty.");
            throw new Error("Book author cannot be empty.");
        }

        const generatedID = generateId();
        const bookObject = generateBooksObject(generatedID, title, author, year, isComplete);
        books.push(bookObject);

        saveData();
        await showForm(false);
        setTimeout(() => {
            showDialog(true, "success", title + " added successfully");
            const currentPage = sessionStorage.getItem('currentPage');
            if (currentPage === 'books') {
                document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
            } else {
                document.dispatchEvent(new Event(RENDER_EVENT_DASHBOARD));
            }
        }, 300);
    } catch (e) {
        console.error('Error adding book:', e);
    }
}
async function editBook(id) {
    const title = document.getElementById('title').value;
    const year = parseInt(document.getElementById('year').value);
    const author = document.getElementById('author').value;
    const isComplete = document.querySelector('input[name="isComplete"]:checked').value === 'true';

    try {
        if (!title) {
            alert("Book title cannot be empty.");
            throw new Error("Book title cannot be empty.");
        }
        if (!year) {
            alert("Book year cannot be empty.");
            throw new Error("Book year cannot be empty.");
        }
        if (!author) {
            alert("Book author cannot be empty.");
            throw new Error("Book author cannot be empty.");
        }
        
        const bookTarget = findBookIndex(id);
        if (bookTarget === -1) return;
        
        books[bookTarget].title = title;
        books[bookTarget].year = year;
        books[bookTarget].author = author;
        books[bookTarget].isComplete = isComplete;
        
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
        
        saveData();
        await showForm(false);
        setTimeout(() => {
            showDialog(true, "success", title + " edited successfully");
            const currentPage = sessionStorage.getItem('currentPage');
            if (currentPage === 'books') {
                document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
            }
        }, 300);
    } catch (e) {
        console.error('Error adding book:', e);
    }
}



function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function generateId() {
    return +new Date();
}

function generateBooksObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

async function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    const currentPage = sessionStorage.getItem('currentPage');
    if (currentPage === 'books') {
        document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
    } else {
        document.dispatchEvent(new Event(RENDER_EVENT_DASHBOARD));
    }
}

document.addEventListener(RENDER_EVENT_DASHBOARD, async function () {
    const emptybook = document.getElementById('empty-book-dashboard');
    if (emptybook) {
        emptybook.remove();
    }
    if (books.length > 0) {
        await showDashboardContent();
        const allBooks = document.getElementById('all-books-dashboard');
        const countbooks = document.getElementById('countbooks');
        allBooks.innerHTML = '';

        const maxItem = 10;
        let showItem = 0;
        if (books.length > maxItem) {
            showItem = maxItem
        } else {
            showItem = books.length
        }
        let countAll = 0;
        countbooks.innerText = 'Show ' + showItem + ' of ' + books.length + ' books';

        for (const bookItem of books) {
            const bookElement = makeBookDashboard(bookItem);
            if (countAll < maxItem) {
                allBooks.append(bookElement);
                countAll++;
            }
        }
    } else {
        await showEmptyDashboard();
    }


});
document.addEventListener(RENDER_EVENT_BOOKS, async function () {
    const emptybook = document.getElementById('empty-book-dashboard');
    if (emptybook) {
        emptybook.remove();
    }
    if (books.length > 0) {
        await showBooksContent();

        const uncompletedBooks = document.getElementById('uncompleted-books-container');
        if (uncompletedBooks) {
            uncompletedBooks.innerHTML = '';
        }

        const completedBooks = document.getElementById('completed-books-container');
        if (completedBooks) {
            completedBooks.innerHTML = '';
        }

        let countAllBooks = 0
        let countCompletedBooks = 0
        let countUncompletedBooks = 0
        let displayBooks = books;

        let searchValue = filterBook();
        
        if(searchValue != null){
            if(searchValue.length > 0){
                displayBooks = searchValue;
            }
    
            for (const bookItem of displayBooks) {
                countAllBooks++;
                const book = makeBook(bookItem);
                if (bookItem.isComplete) {
                    completedBooks.appendChild(book);
                    countCompletedBooks++;
                } else {
                    uncompletedBooks.appendChild(book);
                    countUncompletedBooks++;
                }
            }
    
        }
        const elementCountAllBooks = document.getElementById("all-books-count");
        const elementCountCompletedBooks = document.getElementById("completed-books-count");
        const elementCountUncompletedBooks = document.getElementById("uncompleted-books-count");

        elementCountAllBooks.innerText = countAllBooks + ' Books found';
        elementCountCompletedBooks.innerText = countCompletedBooks + ' Completed books';
        elementCountUncompletedBooks.innerText = countUncompletedBooks + ' Uncompleted books';

    } else {
        await showEmptyBooks();
    }
});

function filterBook(){
    const searchValue = document.getElementById("search").value.trim().toLowerCase();
    let searchResults = books.filter(book => {
        return book.title.toLowerCase().includes(searchValue);
    });

    if(searchResults.length < 1){
        searchResults = null;
    }

    return searchResults;
}


function reattachDeleteEventListener(bookId) {
    const btnDelete = document.getElementById(`btn-delete-${bookId}`);
    if (btnDelete) {
        btnDelete.addEventListener('click', function () {
            showDialog(true, "warning", "Are you sure to delete this book?", bookId);
        });
    }
}


function makeBookDashboard(bookObject) {
    const book = document.createElement('p');
    book.innerText = bookObject.title;
    return book;
}


function makeBook(bookObject) {
    const article = document.createElement('article');
    article.id = `book-${bookObject.id}`;
    article.classList.add('book');

    const title = document.createElement('h3');
    title.id = `title-${bookObject.id}`;
    title.textContent = bookObject.title;
    article.appendChild(title);

    const contentContainer = document.createElement('div');
    contentContainer.classList.add('content-container');

    const authorGroup = document.createElement('div');
    authorGroup.classList.add('desc-group');
    const authorLabel = document.createElement('p');
    authorLabel.textContent = 'Author';
    const author = document.createElement('p');
    author.id = `author-${bookObject.id}`;
    author.textContent = ': ' + bookObject.author;
    authorGroup.appendChild(authorLabel);
    authorGroup.appendChild(author);
    contentContainer.appendChild(authorGroup);

    const yearGroup = document.createElement('div');
    yearGroup.classList.add('desc-group');
    const yearLabel = document.createElement('p');
    yearLabel.textContent = 'Year';
    const year = document.createElement('p');
    year.id = `year-${bookObject.id}`;
    year.textContent = ': ' + bookObject.year;
    yearGroup.appendChild(yearLabel);
    yearGroup.appendChild(year);
    contentContainer.appendChild(yearGroup);

    article.appendChild(contentContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.id = `button-container-${bookObject.id}`;
    buttonContainer.classList.add('button-container');

    const btnDone = document.createElement('button');
    btnDone.id = `btn-act-${bookObject.id}`;
    btnDone.classList.add('button-done');


    const btnEdit = document.createElement('button');
    btnEdit.id = `btn-edit-${bookObject.id}`;
    btnEdit.classList.add('button-edit');
    btnEdit.textContent = 'edit';
    btnEdit.addEventListener('click', function () {
        showForm(true, bookObject);
    });

    const btnDelete = document.createElement('button');
    btnDelete.id = `btn-delete-${bookObject.id}`;
    btnDelete.classList.add('button-delete');
    btnDelete.textContent = 'delete';
    btnDelete.addEventListener('click', function () {
        showDialog(true, "warning", "Are you sure to delete this book?", bookObject.id);
    });

    buttonContainer.appendChild(btnDone);
    buttonContainer.appendChild(btnEdit);
    buttonContainer.appendChild(btnDelete);

    if (bookObject.isComplete) {
        btnDone.textContent = 'not yet';
        btnDone.addEventListener('click', function () {
            moveToUncompleted(bookObject.id);
        });
    } else {
        btnDone.textContent = 'done';
        btnDone.addEventListener('click', function () {
            moveToCompleted(bookObject.id);
        });
    }

    article.appendChild(buttonContainer);

    return article
}

function removeBook(id) {
    const bookTarget = findBookIndex(id);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
    saveData();
    showDialog(false);

}

function moveToUncompleted(id) {
    const bookTarget = findBook(id);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
    saveData();
}


function moveToCompleted(id) {
    const bookTarget = findBook(id);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT_BOOKS));
    saveData();
}

function findBookIndex(id) {
    for (const index in books) {
        if (books[index].id === id) {
            return index;
        }
    }
    return -1;
}

function findBook(id) {
    for (const bookItem of books) {
        if (bookItem.id === id) {
            return bookItem;
        }
    }
    return null;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}