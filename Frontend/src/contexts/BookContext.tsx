import React, { createContext, useState, useEffect, useContext } from "react";
import { axiosInstance } from "./AuthContext";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";


export interface Book {
  id: number;
  bookName: string;
  Author: string;
  Publisher: string;
  Subject: string;
  Publication_year: number;
  userId: number;
}

interface BookPayload {
  bookName: string;
  Author: string;
  Publisher: string;
  Subject: string;
  Publication_year: number;
}

interface BookContextType {
  books: Book[];
  fetchBooks: () => void;
  addBook: (data: BookPayload) => Promise<void>;
  updateBook: (id: number, data: BookPayload) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  getBook: (id: number) => Book | undefined;
  searchBooks: (query: string) => Promise<void>;
  isLoading: boolean;
}


const BookContext = createContext<BookContextType | undefined>(undefined);


function BookProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooks = async () => {
    if (!user?.id) {
      console.warn("Skipping fetch: no user ID");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/books");
      const booksData = Array.isArray(res.data?.books) ? res.data.books : [];

      if (booksData.length === 0) {
        console.warn("No books found or unexpected format:", res.data);
      }

      setBooks(booksData);
    } catch (error: any) {
      console.error("Error fetching books:", error);
      toast.error(error?.response?.data?.message || "Could not fetch books");
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addBook = async (data: BookPayload) => {
    try {
      const res = await axiosInstance.post("/books/create", data);
      setBooks(prev => [...prev, res.data]);
      toast.success("Book added successfully!");
    } catch (error: any) {
      console.error("Add book failed:", error);
      toast.error(error?.response?.data?.message || "Could not add book");
    }
  };

  const updateBook = async (id: number, data: BookPayload) => {
    try {
      const res = await axiosInstance.put(`/books/update/${id}`, data);
      setBooks(prev => prev.map(book => (book.id === id ? res.data : book)));
      toast.success("Book updated successfully!");
    } catch (error: any) {
      console.error("Update book failed:", error);
      toast.error(error?.response?.data?.message || "Could not update book");
    }
  };

  const deleteBook = async (id: number) => {
    try {
      await axiosInstance.delete(`/books/delete/${id}`);
      setBooks(prev => prev.filter(book => book.id !== id));
      toast.success("Book deleted.");
    } catch (error: any) {
      console.error("Delete book failed:", error);
      toast.error(error?.response?.data?.message || "Could not delete book");
    }
  };

  const getBook = (id: number) => books.find(book => book.id === id);

  useEffect(() => {
    if (user?.id) {
      fetchBooks();
    }
  }, [user?.id]);

  const searchBooks = async (query: string) => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/books/search?q=${encodeURIComponent(query)}`);
        setBooks(Array.isArray(res.data) ? res.data : []);
      } catch (error: any) {
        console.error("Search failed:", error);
        toast.error(error?.response?.data?.message || "Search failed");
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <BookContext.Provider
      value={{
        books,
        fetchBooks,
        addBook,
        updateBook,
        deleteBook,
        getBook,
        searchBooks,
        isLoading,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
}

export { BookProvider, useBooks };


