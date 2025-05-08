📚  Book Management API
A full-stack backend API built with Node.js, Express, and Sequelize for managing a collection of books — complete with JWT auth, search, pagination, and Swagger docs.

🚀 Features
🔐 JWT-based authentication (signup, login, logout)

📖 CRUD operations for managing books

🔍 Search across multiple book fields

📄 Swagger UI for API documentation

✅ Input validation using Joi

🌍 CORS support for frontend integration

📦 Tech Stack
Backend: Node.js, Express

ORM: Sequelize

Database: PostgreSQL

Auth: JWT

Validation: Joi

Docs: Swagger (OpenAPI)

📘 Book Schema
Each book has the following attributes:

bookName (string)

author (string)

publisher (string)

subject (string)

publication_year (integer)

🔐 Auth Routes
http
Copy
Edit
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
Signup Payload
json
Copy
Edit
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "yourPassword123"
}
📚 Book Routes
http
Copy
Edit
GET     /api/books
GET     /api/books/search?q=term
GET     /api/books/:id
POST    /api/books/create
PUT     /api/books/update/:id
DELETE  /api/books/delete/:id
🧪 Run Locally
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/yourusername/book-management-api.git
cd book-management-api
2. Install dependencies
bash
Copy
Edit
npm install
3. Set up .env
bash
Copy
Edit
PORT=5000
JWT_SECRET=yourSecretKey
DATABASE_URL=your_postgres_connection_string
4. Run migrations (if using Sequelize CLI)
bash
Copy
Edit
npx sequelize-cli db:migrate
5. Start the server
bash
Copy
Edit
npm start
📖 Swagger Docs
Once running, view interactive API docs at:

bash
Copy
Edit
http://localhost:5000/api-docs















import React, { useState } from 'react';
import { useBooks, Book } from '@/contexts/BookContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Book as BookIcon, Plus, Search, Edit, Trash2 } from 'lucide-react';
import BookForm from './BookForm';
import { useAuth } from '@/contexts/AuthContext';

const BookTable = () => {
  const { books, searchBooks, addBook, updateBook, deleteBook, isLoading } = useBooks();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter books based on search query
  const handleSearch = () => {
    const results = searchBooks(searchQuery);
    setFilteredBooks(results);
  };

  // Reset search and show all books
  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredBooks([]);
  };

  // Handle creating a new book
  const handleAddBook = (bookData: Omit<Book, 'id' | 'userId'>) => {
    if (user) {
      const newBook = {
        ...bookData,
        userId: user.id,
      };
      addBook(newBook as Omit<Book, 'id'>);
    }
  };

  // Handle updating an existing book
  const handleEditBook = (bookData: Omit<Book, 'id' | 'userId'>) => {
    if (bookToEdit) {
      updateBook(bookToEdit.id, bookData);
    }
  };

  // Open the edit dialog
  const openEditDialog = (book: Book) => {
    setBookToEdit(book);
    setIsDialogOpen(true);
  };

  // Open the add dialog
  const openAddDialog = () => {
    setBookToEdit(null);
    setIsDialogOpen(true);
  };

  // Confirm deletion dialog
  const openDeleteDialog = (id: string) => {
    setBookToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Perform the actual deletion
  const confirmDelete = () => {
    if (bookToDelete) {
      deleteBook(bookToDelete);
      setBookToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  // Books to display (filtered or all)
  const displayedBooks = searchQuery ? filteredBooks : books;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center">
          <BookIcon className="h-6 w-6 mr-2 text-book-primary" />
          <h1 className="text-2xl font-bold">My Books</h1>
          <span className="ml-2 text-sm bg-book-accent text-book-secondary px-2 py-0.5 rounded-full">
            {books.length}
          </span>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            variant={searchQuery ? "default" : "outline"}
            onClick={searchQuery ? handleSearch : handleResetSearch}
          >
            {searchQuery ? "Search" : "Reset"}
          </Button>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-1" /> Add Book
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-book-primary"></div>
        </div>
      ) : (
        <>
          {displayedBooks.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/50">
              <BookIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">No books found</h2>
              <p className="text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Add your first book to get started"}
              </p>
              {!searchQuery && (
                <Button className="mt-4" onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-1" /> Add Your First Book
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Name</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.bookName}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.publisher}</TableCell>
                      <TableCell>{book.subject}</TableCell>
                      <TableCell>{book.publicationYear}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(book)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openDeleteDialog(book.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      <BookForm
        book={bookToEdit || undefined}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={bookToEdit ? handleEditBook : handleAddBook}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookTable;
