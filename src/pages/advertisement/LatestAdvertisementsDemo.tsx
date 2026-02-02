import { useEffect } from 'react';
import moment from 'moment';
import { useAdvertisements } from 'src/hooks/useAdvertisements';
import { CustomPortableText } from 'src/utils/CustomPortableText';

const LatestAdvertisementsDemo = () => {
  const { latestAdvertisements, getLatestAdvertisements } = useAdvertisements();

  useEffect(() => {
    if (
      !latestAdvertisements ||
      Object.keys(latestAdvertisements).length === 0
    ) {
      void getLatestAdvertisements();
    }
  }, [getLatestAdvertisements, latestAdvertisements]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Последни обяви по тип</h2>

      {!latestAdvertisements ||
      Object.keys(latestAdvertisements).length === 0 ? (
        <p>Няма намерени обяви</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {Object.entries(latestAdvertisements).map(([type, ad]) => (
            <div
              key={type}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', textTransform: 'capitalize' }}>
                {type}
              </h3>

              {ad?.date && (
                <p
                  style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}
                >
                  📅 {moment(ad.date).format('DD.MM.YYYY')}
                </p>
              )}

              {ad?.text && ad.text.length > 0 && (
                <div style={{ marginTop: '10px', lineHeight: '1.6' }}>
                  <CustomPortableText value={ad.text} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestAdvertisementsDemo;
