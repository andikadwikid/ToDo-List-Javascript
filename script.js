const books = [];
const RENDER_EVENT = 'render-book'
const STORAGE_KEY = 'BOOKSHELF_APP'
const SAVED_EVENT = 'saved-book'
const DELETE_EVENT = 'delete-book'
console.log(books)
document.addEventListener('DOMContentLoaded', function () {
    const submitForms = document.getElementById('inputBook')
    const inputTitle = document.getElementById('inputBookTitle')
    const inputSearchBook = document.getElementById("searchBook")
    submitForms.addEventListener('submit', function (event) {
        event.preventDefault()
        if (books.some(book => book.title == inputTitle.value)) {
            alert("Judul buku sudah ada !")
        } else {
            addBook()
        }
    });

    inputSearchBook.addEventListener("submit", function (event) {
        event.preventDefault()
        searchBook()
    });

    inputSearchBook.addEventListener("keyup", function (event) {
        event.preventDefault()
        searchBook()
    });

    if (isStorageExist()) {
        loadDataFromStorage()
    }
});

const generateId = () => {
    return +new Date()
}

const generateBookObject = (id, title, author, year, isCompleted = false) => {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    };
}

const savedData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)

        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

const addBook = () => {
    const textTitle = document.getElementById('inputBookTitle').value
    const textAuthor = document.getElementById('inputBookAuthor').value
    const textYear = document.getElementById('inputBookYear').value
    const booksIsComplete = document.getElementById('inputBookIsComplete')
    let checked = false

    if (booksIsComplete.checked) {
        checked = true
    } else {
        checked
    }

    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, textTitle, textAuthor, textYear, checked);

    books.push(bookObject);

    alert('Data Berhasil disimpan!')

    document.dispatchEvent(new Event(RENDER_EVENT))
    savedData()
}

const isStorageExist = () => {
    if (typeof Storage === undefined) {
        alert('Browser kamu tidak mendukung local storage')
        return false
    }
    return true
}

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY)
    const data = JSON.parse(serializedData)

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookId === bookItem.id) {
            return bookItem;
        }
    }

    return null;
}

const findBookIndex = (bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }

    return -1;
}

const addBookToCompleted = (bookId) => {
    const bookTarget = findBook(bookId)
    if (bookTarget === null) {
        return
    }

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT))
    savedData()
}

const unreadBookFromCompleted = (bookId) => {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) {
        return
    }

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT))
    savedData();
}

const deleteBook = (bookId) => {
    const bookTarget = findBookIndex(bookId)

    if (bookTarget === -1) {
        return
    }

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT))
    savedData();
}

const createButton = (buttonClass, textContent, bgColor) => {
    const button = document.createElement('button')
    button.classList.add(buttonClass)
    button.style.backgroundColor = bgColor
    button.textContent = textContent
    return button
}

const createUnreadButton = (bookId) => {
    const unreadButton = createButton('green', 'Belum Dibaca!', 'green')
    unreadButton.addEventListener('click', function () {
        unreadBookFromCompleted(bookId)
    });
    return unreadButton;
}

const createReadButton = (bookId) => {
    const readButton = createButton('green', 'Selesai Dibaca!', 'green')
    readButton.addEventListener('click', function () {
        addBookToCompleted(bookId)
    });
    return readButton
}

const createDeleteButton = (bookId) => {
    const deleteButton = createButton('red', 'Hapus Buku', 'red')
    deleteButton.addEventListener('click', function () {
        let hapusData = confirm("Yakin data akan dihapus?")
        if (hapusData) {
            deleteBook(bookId);
            alert('Data Berhasil dihapus!');
        }
    });
    return deleteButton;
}

const makeBook = (bookObject) => {
    const textTitle = document.createElement('h3')
    textTitle.innerText = bookObject.title

    const textAuthor = document.createElement('p')
    textAuthor.innerText = `Penulis : ${bookObject.author}`

    const textYear = document.createElement('p')
    textYear.innerText = `Tahun : ${bookObject.year}`

    const bookContainer = document.createElement('article')
    bookContainer.classList.add('book_item')
    bookContainer.append(textTitle, textAuthor, textYear)
    bookContainer.setAttribute('id', `book-${bookObject.id}`)

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    bookContainer.append(buttonContainer);

    if (bookObject.isCompleted) {
        const unreadButton = createUnreadButton(bookObject.id)

        const deleteButton = createDeleteButton(bookObject.id)

        buttonContainer.append(unreadButton, deleteButton)

    } else {
        const readButton = createReadButton(bookObject.id)

        const deleteButton = createDeleteButton(bookObject.id)

        buttonContainer.append(readButton, deleteButton)
    }

    return bookContainer;
}

const searchBook = () => {
    const searchBook = document.getElementById("searchBookTitle")
    const filter = searchBook.value
    const bookItem = document.getElementsByClassName('book_item')
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText
        if (txtValue.indexOf(filter) > -1) {
            bookItem[i].style.display = ""
        } else {
            bookItem[i].style.display = "none"
        }
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const unreadBook = document.getElementById('incompleteBookshelfList')
    unreadBook.innerHTML = ''

    const readedBook = document.getElementById('completeBookshelfList')
    readedBook.innerHTML = ''

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem)
        if (!bookItem.isCompleted) {
            unreadBook.append(bookElement)
        } else {
            readedBook.append(bookElement)
        }
    }
});

