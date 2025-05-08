import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { Book } from '@/contexts/BookContext';
import { useBooks } from '@/contexts/BookContext';

const currentYear = new Date().getFullYear();

const formSchema = z.object({
  bookName: z.string().min(1, { message: 'Book name is required' }),
  Author: z.string().min(1, { message: 'Author name is required' }),
  Publisher: z.string().min(1, { message: 'Publisher name is required' }),
  Subject: z.string().min(1, { message: 'Subject is required' }),
  Publication_year: z.number().int().min(1).max(currentYear, {
    message: `Year can't be later than ${currentYear}`,
  }),
});



type FormValues = z.infer<typeof formSchema>;

interface BookFormProps {
  book?: Book;
  isOpen: boolean;
  onClose: () => void;
}

const BookForm = ({ book, isOpen, onClose }: BookFormProps) => {
  const { addBook, updateBook } = useBooks();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookName: '',
      Author: '',
      Publisher: '',
      Subject: '',
      Publication_year: currentYear,
    },
  });

  useEffect(() => {
    if (book) {
      form.reset({
        bookName: book.bookName,
        Author: book.Author,
        Publisher: book.Publisher,
        Subject: book.Subject,
        Publication_year: book.Publication_year,
      });
    } else {
      form.reset({
        bookName: '',
        Author: '',
        Publisher: '',
        Subject: '',
        Publication_year: currentYear,
      });
    }
  }, [book, form]);

  const handleSubmit = (data: FormValues) => {
    if (book) {
      updateBook(book.id, data);
    } else {
      addBook(data);
    }
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {book
              ? 'Update the details of this book below.'
              : 'Fill in the details to add a new book.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bookName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter book name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publisher</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter publisher name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Publication_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter publication year"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || '')
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{book ? 'Save Changes' : 'Add Book'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookForm;
