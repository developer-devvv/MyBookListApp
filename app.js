//Book Class : Represent a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }       
}

//UI Class : Handle UI Tasks
class UI {
    static displayBooks() {

        const books = Store.getbooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);

    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, classname) {
        const div = document.createElement('div');
        div.className = `alert alert-${classname}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Vanish in 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove()
        },3000);
    }


    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}
//Store Class : Handle Storage
class Store {
    static getbooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addbook(book){
        const books = Store.getbooks();
        books.push(book);
        localStorage.setItem('book', JSON.stringify(books));
    }

    static removebook(isbn){
        const books = Store.getbooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                book.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event : Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//Event : Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
        //prevent actual submit
        e.preventDefault();

        //Get Form Values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;

        //Validate 
        if(title === '' || author === '' || isbn === '') {
            UI.showAlert('Please fill in all fields', 'danger');
        }
        else{
            //Instatiate book
            const book = new Book(title, author, isbn);

            //Add Book To UI
            UI.addBookToList(book);

            // Add Book To Store
            Store.addbook(book);

            //Show Success Message
            UI.showAlert('Book Added!', 'success');

            //Clear Fields
            UI.clearFields();
        }

});


//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click' , (e) => {
    //Remove Book From UI
    UI.deleteBook(e.target);

    //Remove Book From Store
    Store.removebook(e.target.parentElement.previousElementSibling.textContent);

    // Remove Book Message
    UI.showAlert('Book Removed!', 'info'); 
});