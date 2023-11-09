const express = require("express");
let books = require("./booksdb.js");
const e = require("express");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json({ message: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  res.status(200).send(books[req.params.isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  res.status(200).send(
    Object.values(books).filter((book) => {
      return book.author === req.params.author;
    })
  );
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  res.status(200).send(
    Object.values(books).filter((book) => {
      return book.title === req.params.title;
    })
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  res.status(200).send(books[req.params.isbn].reviews);
});

async function getAllBooks() {
  try {
    const list_books = await axios.get("http://localhost:5000/");
    return list_books.data.message;
  } catch (error) {
    throw new Error("something went wrong" + error.message);
  }
}

async function getBookByIsbn(isbn) {
  try {
    const list_books = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return list_books.data.message;
  } catch (error) {
    throw new Error("something went wrong" + error.message);
  }
}

async function getBookByAuthor(author) {
  try {
    const list_books = await axios.get(
      `http://localhost:5000/author/${author}`
    );
    return list_books.data.message;
  } catch (error) {
    throw new Error("something went wrong" + error.message);
  }
}

async function getBookByTitle(title) {
  try {
    const list_books = await axios.get(`http://localhost:5000/title/${title}`);
    return list_books.data.message;
  } catch (error) {
    throw new Error("something went wrong" + error.message);
  }
}
module.exports.general = public_users;
