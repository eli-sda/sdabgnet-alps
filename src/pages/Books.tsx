import { FC, useEffect, useState } from 'react';
import { Page } from 'src/organisms/Page';
import routes from '../routes';
import books from './books.json';

import {
  Avatar,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  // ListItemButton,
  ListItemIcon
  // ListItemText
} from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import GroupIcon from '@mui/icons-material/Group';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AutoStories from '@mui/icons-material/AutoStories';
import LinkIcon from '@mui/icons-material/Link';
import AudioIcon from '@mui/icons-material/AudioFile';
import { getTitle } from 'src/utils/Navigation';

const Books = () => {
  //TODO to work #<bookId>
  const [allBooks, setAllBooks] = useState<BooksSection[]>([]);

  useEffect(() => {
    //TODO: get all books from API
    console.log('books:', books);
    setAllBooks(books);
  }, []);

  const breadcrumbsUrls = [routes.resources(), routes.resources('books')];
  return (
    <Page
      title={getTitle(routes.resources('books'))}
      kicker="Ресурси за изтегляне"
      breadcrumbsUrls={breadcrumbsUrls}
    >
      {/* <section className="l-grid l-grid--7-col u-shift--left--1-col--at-large l-grid-wrap--6-of-7 u-spacing--double--until-xxlarge u-padding--zero--sides"> */}
      <div className="download c-article l-grid-item l-grid-item--l--4-col u-padding--zero--sides u-spacing--double">
        {allBooks &&
          allBooks.map((bookSection, i) => (
            <ListSection key={i} {...bookSection}></ListSection>
          ))}
      </div>
      {/* </section> */}
    </Page>
  );
};

const ListSection: FC<BooksSection> = ({
  sectionTitle,
  sectionImage,
  description,
  books
}) => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className="c-block c-block__text  u-theme--border-color--darker u-border--left u-spacing--half">
      <ListItemButton>
        <ListItemText primary="Inbox" />
      </ListItemButton>
      <ListItemButton onClick={handleClick} alignItems="flex-start">
        <ListItemAvatar>
          {sectionImage && <Avatar alt={sectionTitle} src={sectionImage} />}
          {!sectionImage && (
            <Avatar>
              <GroupIcon />
            </Avatar>
          )}
        </ListItemAvatar>

        <ListItemText
          primary={
            <>
              <h2 className="u-font--primary--s u-theme--color--darker">
                <span className="u-theme--color--base">
                  <em>{sectionTitle}</em>
                </span>
              </h2>
              <p className="c-block__body text">{description}</p>
            </>
          }
        />

        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit sx={{ pl: 8 }}>
        <List component="div" disablePadding>
          {books.map((book, b) => (
            <BookItem key={b} {...book} />
          ))}
        </List>
      </Collapse>
    </div>
  );
};

const BookItem: FC<Book> = ({ title, path, audioId, newLifeId }) => (
  <ListItem
    disablePadding
    sx={{ mb: 2 }}
    secondaryAction={
      <>
        {audioId && (
          <IconButton
            edge="end"
            className="o-button o-button--primary"
            href={`${routes.resources('audio')}#${audioId}`}
            title={`към aудио вариант`}
            aria-label="към aудио вариант"
          >
            <AudioIcon />
          </IconButton>
        )}

        {newLifeId && (
          <IconButton
            edge="end"
            sx={{ ml: 2 }}
            className="o-button o-button--primary"
            href={`https://newlife-bg.com/product/${newLifeId}/`}
            target="_blank"
            title={`към книгата в издат. "Нов Живот"`}
            aria-label="към книгата в издат. Нов Живот"
          >
            <LinkIcon />
            {/* <Icons.IconNewLife/> */}
          </IconButton>
        )}
      </>
    }
  >
    <ListItemButton
      className="o-button--simple"
      component="a"
      download
      // href={`${encodeURI(path)}`}
      href={`https://api.sdabg.net/download/${encodeURIComponent(path)}`}
    >
      <ListItemIcon>
        <AutoStories />
      </ListItemIcon>
      <ListItemText primary={title} />
    </ListItemButton>
  </ListItem>
);

export default Books;
