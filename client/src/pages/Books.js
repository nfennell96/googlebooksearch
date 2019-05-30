import React, { Component } from "react";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { BookList, BookListItem } from "../components/BookList";
import { Input, TextArea, FormBtn } from "../components/Form";
import {Card} from 'rebass'

class Books extends Component {
  state = {
    books: [],
    title: "",
    author: "",
    thumbnail: "",
    href: "",
    description: "",
    bookSearch: "",
    bookresults: [],
  };

  componentDidMount() {
    this.loadBooks();
    this.searchBooks("the sun also rises");
  }

  searchBooks = query => {
    API.search(query)
      .then(res => this.setState({ bookresults: res.data.items }))
      .catch(err => console.log(err));
  };

 
  addBook = book => {
  //  if (book.title !== this.state.title)
 
    API.saveBook(book)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", thumbnail: "", description: ""})
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };


  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.title && this.state.author) {
      API.saveBook({
        title: this.state.title,
        author: this.state.author,
        thumbnail: this.state.thumbnail,
        description: this.state.description,

      })
        .then(res => this.loadBooks())
        .catch(err => console.log(err));
    }
    else {
      API.search(this.state.bookSearch)
        .then(res =>
          this.setState({ bookresults: res.data.items }))

        .catch(err => console.log(err));
    };

  };


  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="xs-9 sm-10">
          
            <h2>Search Google Books</h2>
            <form>

              <Input
                name="bookSearch"
                value={this.state.bookSearch}
                onChange={this.handleInputChange}
                placeholder="Search For a Book"
              />
              <FormBtn
                disabled={!(this.state.bookSearch)}
                onClick={this.handleFormSubmit}
              >
                Search
              </FormBtn>

            </form>
          </Col>
          <Col size="xs-9 sm-10">

            <h1>Search results</h1>

            {!this.state.bookresults.length ? (
              <h1 className="text-center">No Books to Display</h1>
            ) : (
                <BookList>
                  {this.state.bookresults.map(bookresult => {
                    let book = {
                      title: bookresult.volumeInfo.title,
                      author: bookresult.volumeInfo.authors,
                      description: bookresult.volumeInfo.description,
                  
                    }
                    return (
                      <BookListItem
                        key={bookresult.id}
                        title={bookresult.volumeInfo.title}
                        thumbnail={bookresult.volumeInfo.imageLinks.thumbnail}
                        author={bookresult.volumeInfo.authors}
                        description={bookresult.volumeInfo.description}
                        href={bookresult.volumeInfo.previewLink}
                        onClick={() => this.addBook(book)}>
                        isSaved
                      </BookListItem>

                    );
                  })}
                </BookList>

              )}


          </Col>
        </Row>
        <Row>

          <Col size="md-8 sm-12">
           
             <Card> <h1>My Saved Books</h1> </Card>
         
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem
                    key={book._id}
                    srcUrl={book.thumbnail}
                    heading={book.title}
                    text={book.description}
                    onClick={() => this.deleteBook(book._id)}>
                    <Link to={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Link>
                  </ListItem>
                ))}
              </List>
            ) : (
                <h3>No Results to Display</h3>
              )}
          </Col>
          <Col size="md-4 xs-12">
          
              <h1>Add a new book</h1>
       
            <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Title (required)"
              />
              <Input
                value={this.state.author}
                onChange={this.handleInputChange}
                name="author"
                placeholder="Author (required)"
              />
              <Input
                value={this.state.thumbnail}
                onChange={this.handleInputChange}
                name="thumbnail"
                placeholder="Thumbnail (Optional)"
              />
              <TextArea
                value={this.state.description}
                onChange={this.handleInputChange}
                name="description"
                placeholder="Description (Optional)"
              />
              <FormBtn
                disabled={!(this.state.author && this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Submit Book
              </FormBtn>
            </form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
