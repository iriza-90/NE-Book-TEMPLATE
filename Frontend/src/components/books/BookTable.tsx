import React, { useState } from "react";
import { useBooks } from "@/contexts/BookContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import BookForm from "./BookForm";

function BookTable() {
  const {
    books,
    searchBooks,
    deleteBook,
    isLoading,
  } = useBooks();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const handleSearch = async () => {
    await searchBooks(searchQuery);
    setCurrentPage(1); // reset to page 1 after search
  };

  const totalPages = Math.ceil(books.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search by name, author, etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <Button onClick={handleAddBook}>Add Book</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded border">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 uppercase text-xs text-gray-500">ID</th>
                  <th className="px-6 py-3 uppercase text-xs text-gray-500">Book Name</th>
                  <th className="px-6 py-3 uppercase text-xs text-gray-500">Author</th>
                  <th className="px-6 py-3 uppercase text-xs text-gray-500">Publisher</th>
                  <th className="px-6 py-3 uppercase text-xs text-gray-500">Subject</th>
                  <th className="px-6 py-3 uppercase text-xs text-gray-500">Year</th>
                  <th className="px-6 py-3 text-right uppercase text-xs text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{book.id}</td>
                    <td className="px-6 py-4">{book.bookName}</td>
                    <td className="px-6 py-4">{book.Author}</td>
                    <td className="px-6 py-4">{book.Publisher}</td>
                    <td className="px-6 py-4">{book.Subject}</td>
                    <td className="px-6 py-4">{book.Publication_year}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(book)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this book?")) {
                            deleteBook(book.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <BookForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        book={selectedBook}
      />
    </div>
  );
}

export default BookTable;
