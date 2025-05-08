
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book } from '@/contexts/BookContext';
import { Edit, Trash2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

const BookCard = ({ book, onEdit, onDelete }: BookCardProps) => {
  return (
    <Card className="book-card-hover overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-book-primary to-book-secondary">
        <CardTitle className="text-white truncate">{book.bookName}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-1">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Author:</span>
            <span className="text-sm">{book.Author}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Publisher:</span>
            <span className="text-sm">{book.Publisher}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Subject:</span>
            <span className="text-sm">{book.Subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Year:</span>
            <span className="text-sm">{book.Publication_year}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(book)}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(book.id)}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
