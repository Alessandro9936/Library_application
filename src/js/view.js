export const handleView = (() => {
  const bookPreviewsCont = document.querySelector(".books-container");
  const bookSpecificsCont = document.querySelector(".book-container");
  const bookCover = document.querySelector(".book__presentation--image img");
  const bookTitle = document.querySelector("[data-title]");
  const bookAuthor = document.querySelector("[data-author]");
  const bookDescription = document.querySelector("[data-description]");

  const toggleBookContainer = () => {
    bookSpecificsCont.classList.toggle("hidden");
  };

  function _cleanPreviewsContainer() {
    bookPreviewsCont.innerHTML = "";
  }

  const displaySpinner = () => {
    _cleanPreviewsContainer();
    bookPreviewsCont.classList.remove("hidden");
    const spinner = document.createElement("span");
    spinner.classList.add("loader");
    bookPreviewsCont.appendChild(spinner);
  };

  // Display Errors

  const displayErrorMessage = (message) => {
    _cleanPreviewsContainer();
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error");
    errorMessage.textContent = message;
    bookPreviewsCont.appendChild(errorMessage);
  };

  const displayDescriptionErrorMessage = (target, message) => {
    const book = target.closest("li");

    //If error is already displayed, return
    if (book.querySelector(".description-err")) return;

    const noDescErr = document.createElement("p");
    noDescErr.classList.add("description-err");
    noDescErr.textContent = message;

    book.prepend(noDescErr);
  };

  // Display books by category

  const handleBookPreviews = (books) => {
    _cleanPreviewsContainer();
    _displayBookPreviews(books);
  };

  function _displayBookPreviews(books) {
    books.forEach((book, index) => {
      const currentBook = _generateMarkupPreview(book, index);
      bookPreviewsCont.appendChild(currentBook);
    });
  }

  function _generateMarkupPreview(book, index) {
    const li = document.createElement("li");
    li.classList.add("book-preview");

    //We need the book number in the array of book previews to find its description later
    li.dataset.numBook = index;

    const bookPreviewContent = `
      <div class="book__info">
        <div class="book__info--image">
          <img src="https://covers.openlibrary.org/b/id/${book.cover}-M.jpg" />
        </div>
        <ul class="book__info--about">
          <li><strong>Title</strong>: ${book.title}</li>
          <li><strong>Author</strong>: ${book.author.map(
            (author) => " " + author
          )}</li>
        </ul>
      </div>
      <div class="learn__more">
        <ion-icon name="chevron-down-outline" class="chevron-down"></ion-icon>
      </div>
      `;

    li.insertAdjacentHTML("beforeend", bookPreviewContent);
    return li;
  }

  // Display books description

  const handleBookDisplay = (bookData, description) => {
    toggleBookContainer();
    _displayBooksSpecifics(bookData, description);
  };

  function _displayBooksSpecifics(bookData, description) {
    bookCover.src = `https://covers.openlibrary.org/b/id/${bookData.cover}-M.jpg`;
    bookTitle.textContent = `${bookData.title}`;
    bookAuthor.textContent = `${bookData.author.map((author) => " " + author)}`;
    bookDescription.textContent = description;
  }

  return {
    displaySpinner,
    handleBookPreviews,
    displayErrorMessage,
    toggleBookContainer,
    handleBookDisplay,
    displayDescriptionErrorMessage,
  };
})();
