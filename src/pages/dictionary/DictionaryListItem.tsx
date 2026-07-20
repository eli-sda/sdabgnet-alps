import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import { Pullquote } from 'alps-library/molecules/text/pullquote/Pullquote';
import { DictionaryType } from 'src/contexts/DictionaryContext';

export const DictionaryListItem = ({
  item
}: {
  item: DictionaryType;
}): JSX.Element => {
  const renderEgwComments = (text: string) => {
    const lines = text.split('\n');
    const segments: { text: string; author?: string }[] = [];
    let currentLines: string[] = [];

    lines.forEach((line) => {
      const match = line.match(/^::(.*)::$/);
      if (match) {
        const segText = currentLines.join('\n').trim();
        if (segText) {
          segments.push({ text: segText, author: match[1] });
        }
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    });

    const remaining = currentLines.join('\n').trim();
    if (remaining) {
      segments.push({ text: remaining });
    }

    return (
      <>
        {segments.map((seg, i) => (
          <Pullquote key={i} author={seg.author} quote={seg.text} />
        ))}
      </>
    );
  };

  const getBibleGatewayLink = (searchQuery: string) => {
    const url = new URL('https://www.biblegateway.com/passage/');
    url.searchParams.set('search', searchQuery);
    url.searchParams.set('version', 'BPB');
    return url.toString();
  };

  return (
    <AccordionItem heading={<h3>{item.topic}</h3>}>
      <div className="u-spacing u-space--half--bottom">
        <div className="u-spacing--half">
          {renderEgwComments(item.EGW_comments)}
        </div>

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
  );
};
