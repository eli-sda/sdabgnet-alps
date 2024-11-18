interface Book {
    title: string;
    path: string;
    newLifeId?: number | string; // id in https://newlife-bg.com/
    audioId?: number | string; // id to use as internal anchor to Аудио: /resources/audio#<audioId>
  }
  interface BooksSection {
    sectionTitle: string;
    sectionImage?: string;
    description?: string;
    books: Book[];
  }