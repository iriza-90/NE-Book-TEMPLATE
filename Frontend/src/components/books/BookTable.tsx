// ✅ BookTable.tsx
import React, { useState } from "react";
import { useBooks } from "@/contexts/BookContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";


function BookTable() {
  const {
    books,
    searchBooks,
    deleteBook,
    isLoading,
  } = useBooks();

  const [searchQuery, setSearchQuery] = useState("");
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleSearch = async () => {
    await searchBooks(searchQuery);
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete !== null) {
      await deleteBook(bookToDelete);
      setBookToDelete(null);
      setShowDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search by name, author, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Book Name</th>
                <th className="p-2">Author</th>
                <th className="p-2">Publisher</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Year</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="p-2">{book.id}</td>
                  <td className="p-2">{book.bookName}</td>
                  <td className="p-2">{book.Author}</td>
                  <td className="p-2">{book.Publisher}</td>
                  <td className="p-2">{book.Subject}</td>
                  <td className="p-2">{book.Publication_year}</td>
                  <td className="p-2 space-x-2">
                    <Button size="sm" variant="outline">
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
      )}

      
    </div>
  );
}

export default BookTable;
