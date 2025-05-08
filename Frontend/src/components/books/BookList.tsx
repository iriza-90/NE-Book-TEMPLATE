import React, { useState } from "react";
import { useBooks } from "@/contexts/BookContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

function BookList() {
  const {
    books,
    searchBooks,
    deleteBook,
    isLoading,
  } = useBooks();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    await searchBooks(searchQuery);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="text-lg font-semibold">{book.bookName}</div>
              <div className="text-sm text-gray-600">
                <p><strong>Author:</strong> {book.Author}</p>
                <p><strong>Publisher:</strong> {book.Publisher}</p>
                <p><strong>Subject:</strong> {book.Subject}</p>
                <p><strong>Year:</strong> {book.Publication_year}</p>
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline">Edit</Button>
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

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;
