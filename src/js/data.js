import "regenerator-runtime/runtime";
import axios from "axios";
import _ from "lodash";

const formattedBook = (rawBook) => {
  const title = rawBook.title;
  const author = rawBook.authors.map((author) => author.name);
  const cover = rawBook.cover_id;
  const key = rawBook.key;

  return {
    title,
    cover,
    author,
    key,
  };
};

export const dataHandler = (() => {
  let books;

  const getBooksByCategory = async (category) => {
    try {
      const response = await axios.get(
        `${process.env.BOOK_API_CATEGORY}${category}.json`,
        { timeout: 5000 }
      );

      const rawBooksData = _.get(response, "data.works", []);

      // Check if requested caterogy exist
      if (_.isEmpty(rawBooksData)) throw error;

      books = _formatBooks(rawBooksData);
      return books;
    } catch (error) {
      if (error.response) {
        //response status is an error code (input field empty)
        throw new Error(
          "Input field can't be empty, please search for a category"
        );
      } else if (error.request) {
        //response not received though the request was sent (timeout exceeded)
        throw new Error(`${error.message}, your internet may be too slow`);
      } else {
        //an error occurred in the request (searched category does not exist)
        throw new Error(`"${category}" category does not exist`);
      }
    }
  };

  function _formatBooks(rawBooks) {
    const booksArray = rawBooks.map((rawBook) => formattedBook(rawBook));
    return booksArray;
  }

  const getBookDescription = async (bookInList) => {
    try {
      const clickedBookData = books.at(bookInList);

      const response = await axios.get(
        `${process.env.BOOK_API_DESCRIPTION}${clickedBookData.key}.json`
      );

      //There are books that do not have description available
      if (!_.has(response.data, "description")) {
        throw new Error("No description available");
      }

      //There are books where the description is nested inside another object with the property 'value'
      const bookDescription =
        response.data.description.value ?? response.data.description;

      return { clickedBookData, bookDescription };
    } catch (error) {
      throw error.message;
    }
  };

  return {
    getBooksByCategory,
    getBookDescription,
  };
})();
