import { Pullquote } from 'alps-library/molecules/text/pullquote/Pullquote';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import { DictionaryType } from 'src/contexts/DictionaryContext';
import './DictionaryList.scss';

type DictionaryListProps = {
  items: DictionaryType[];
};

const renderEgwComments = (text: string) => {
  const lines = text.split('\n').filter((p) => p.trim() !== '');

  let author: string | undefined = undefined;
  const quoteTextLines: string[] = [];

  lines.forEach((line) => {
    const match = line.match(/^::(.*)::$/);
    if (match) {
      author = match[1];
    } else {
      quoteTextLines.push(line);
    }
  });

  const finalQuote = quoteTextLines.join('\n');

  return <Pullquote author={author} quote={finalQuote || undefined} />;
};

const getBibleGatewayLink = (searchQuery: string) => {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
    searchQuery
  )}&version=BPB`;
};

export const DictionaryList = ({ items }: DictionaryListProps): JSX.Element => {
  if (items.length === 0) {
    return <Caption>Няма намерени теми.</Caption>;
  }

  return (
    <Accordion className="dictionary-list text">
      {items.map((item) => (
        <AccordionItem
          key={item._id}
          id={item.topic}
          faIconClass="fas fa-pen-fancy"
          heading={<h3>{item.topic}</h3>}
        >
          <div className="u-spacing u-space--half--bottom">
            <div>{renderEgwComments(item.EGW_comments)}</div>

            {item.verses && item.verses.length > 0 && (
              <section>
                <h4 className="u-text--strong">Какво казва Библията:</h4>

                <div className="u-spacing--half">
                  {item.verses.map((verse, verseIdx) => (
                    <a
                      key={verseIdx}
                      href={getBibleGatewayLink(verse)}
                      className="u-display--inline-block u-space--right"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {verse}
                    </a>
                  ))}
                </div>

                <a
                  href={getBibleGatewayLink(item.verses.join('; '))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-display--inline-block u-space--half--top"
                >
                  Виж всички стихове заедно
                </a>
              </section>
            )}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
