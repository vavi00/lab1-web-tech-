
const API_URL = "http://127.0.0.1:8000/books/";
//для рендеру таблиці
async function fetchBooks(filterGenre = '') {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tbody = document.getElementById('book-list');
    tbody.innerHTML = '';


    data.forEach(book => {
        if (filterGenre && book.genre !== filterGenre) return;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>${book.genre}</td>
            <td>${book.rating}</td>
            <td><button class="delete-btn" data-id="${book.id}">X</button></td>
        `;
        tbody.appendChild(tr);
    });
    populateGenres(data);
}

//додавання нової книги
document.getElementById('book-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const genre = document.getElementById('genre').value;
    const rating = document.getElementById('rating').value;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, year, genre, rating })
        });

        if (!res.ok) throw new Error("Failed to add book");

        await fetchBooks(genreSelect.value); // оновлюємо таблицю
        this.reset();
        showMessage(`Book "${title}" added!`, 'green');
        console.log('Adding book title:', title);


    } catch (error) {
        showMessage(`Error: ${error.message}`, 'red');
    }

});

//видалення книги
document.getElementById('book-list').addEventListener('click', async function (e) {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
        if (res.ok) {
            await fetchBooks(genreSelect.value);
            showMessage(`Book deleted!`, 'red');
        }
    }
});

//сортування де є букви і цифри
function sortTable(columnIndex, type = 'str') {
    const table = document.getElementById("book-table");

    let switching = true;
    while (switching) {
        switching = false;
        const rows = table.rows;
        for (let i = 1; i < rows.length - 1; i++) {
            let shouldSwitch = false;
            const x = rows[i].getElementsByTagName("TD")[columnIndex];
            const y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

            if (!x || !y) continue;

            let xVal = type === 'num' ? Number(x.textContent) : x.textContent.toLowerCase();
            let yVal = type === 'num' ? Number(y.textContent) : y.textContent.toLowerCase();

            if (xVal > yVal) {
                shouldSwitch = true;
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                break;
            }
        }
    }
}

//фільтрація за жанром
const genreSelect = document.getElementById('filter-genre');
genreSelect.addEventListener('change', () => fetchBooks(genreSelect.value));

function populateGenres(data) {
    const select = document.getElementById('filter-genre');
    const currentValue = select.value;
    const genres = [...new Set(data.map(b => b.genre))];
    select.innerHTML = '<option value="">All genres</option>';
    genres.forEach(g => {
        console.log("Genre:", g);
        const option = document.createElement('option');
        if (g === "All genres")
            alert("alldetected");
        option.value = g;
        option.textContent = g;
        select.appendChild(option);
    });
    select.value = currentValue;
}

function showMessage(msg, color) {
    const el = document.getElementById('form-message');
    el.textContent = msg;
    el.style.color = color;
    setTimeout(() => el.textContent = '', 3000);
}

fetchBooks();