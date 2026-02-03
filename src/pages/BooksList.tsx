import { useMemo } from 'react';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import BookRow from './resources/books/BookRow';

const BooksList = ({
  sectionTitle,
  description,
  sectionImage,
  books
}: BooksSection) => {
  const content = useMemo(
    () => (
      <div className='u-spacing--double u-space--half--bottom'>
        {description && <p>{description}</p>}
        {books.map((book, i) => (
          <BookRow key={i} {...book} />
        ))}
      </div>
    ),
    [books, description]
  );

  return (
    <AccordionItem
      imageSrc={sectionImage && `/img/author/${sectionImage}`}
      faIconClass="far fa-folder"
      faIconOpenClass="far fa-folder-open"
      heading={<h3>{sectionTitle}</h3>}
    >
      {content}
    </AccordionItem>
  );
};

export default BooksList;
