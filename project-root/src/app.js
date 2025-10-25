function Book(title, author, year, genre, rating) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.genre = genre;
    this.rating = rating;
}

let books = [];

//збереження в localStorage
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
    const saved = localStorage.getItem('books');
    if (saved) {
        books = JSON.parse(saved);
        renderBooks();
        console.log('Loaded from localStorage');
    } else {
        fetch('data.json')
            .then(res => res.json())
            .then(data => {
                books = data;
                renderBooks();
                saveBooks();
            })
            .catch(err => console.error('Error loading data.json:', err));
    }
}

//для рендеру таблиці
function renderBooks() {
    const tbody = document.getElementById('book-list');
    tbody.innerHTML = '';

    books.forEach(book => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>${book.genre}</td>
            <td>${book.rating}</td>
            <td><button href = '#'  class="delete-btn">X</button></td>
        `;
        tbody.appendChild(tr);
    });
}

//додавання нової книги
document.getElementById('book-form').addEventListener('submit', function (e) {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const genre = document.getElementById('genre').value;
    const rating = document.getElementById('rating').value;

    const newBook = new Book(title, author, year, genre, rating);
    books.push(newBook);

    renderBooks();
    saveBooks();
    this.reset();

    const msg = document.getElementById('form-message');
    msg.textContent = `Book "${title}" added!`;
    msg.style.color = 'green';

    setTimeout(() => { msg.textContent = ''; }, 3000);

    e.preventDefault();

});

//завантаження початкових даних з data.json
fetch('data.json')
    .then(res => res.json())
    .then(data => {
        books = data;
        renderBooks();
        saveBooks();
    }).catch(err => console.error('Error loading data.json:', err));

//видалення книги
document.getElementById('book-list').addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn')) {
        const row = e.target.closest('tr');
        const titleToDelete = row.children[0].textContent;
        books = books.filter(book => book.title !== titleToDelete);
        renderBooks();
        saveBooks();

        const msg = document.getElementById('form-message');
        msg.textContent = `Book "${titleToDelete}" deleted!`;
        msg.style.color = 'red';
        setTimeout(() => { msg.textContent = ''; }, 3000);
    }
});

window.addEventListener('load', loadBooks);