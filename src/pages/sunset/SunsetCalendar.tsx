import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/dist/locale/bg';
moment.locale('bg');

interface NominatimResponse {
  lat: string;
  lon: string;
  [key: string]: unknown;
}

interface SunsetApiResponse {
  status: string;
  results: {
    sunset: string;
    [key: string]: unknown;
  };
}

const SunsetCalendar = () => {
  const [city, setCity] = useState('София');
  const [month, setMonth] = useState(moment());
  const [sunsetData, setSunsetData] = useState<Record<string, string>>({});
  const [coords, setCoords] = useState({ lat: 42.6977, lng: 23.3219 }); // София по подразбиране

  useEffect(() => {
    void fetchSunsetData(coords, month);
  }, [coords, month]);

  const fetchCoords = async (cityName: string) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        cityName
      )}&countrycodes=bg&format=json`;
      const res = await fetch(url);
      const data = (await res.json()) as NominatimResponse[];
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert('Не са намерени координати за това населено място.');
      }
    } catch (err) {
      console.error('Грешка при търсене на координати:', err);
    }
  };

  const fetchSunsetData = async (
    coords: { lat: number; lng: number },
    date: moment.Moment
  ) => {
    const results: Record<string, string> = {};
    const daysInMonth = date.daysInMonth();

    for (let d = 1; d <= daysInMonth; d++) {
      const day = date.clone().date(d);
      const apiUrl = `https://api.sunrise-sunset.org/json?lat=${
        coords.lat
      }&lng=${coords.lng}&date=${day.format('YYYY-MM-DD')}&formatted=0`;

      const response = await fetch(apiUrl);
      const json = (await response.json()) as SunsetApiResponse;

      if (json.status === 'OK') {
        results[day.format('YYYY-MM-DD')] = moment(json.results.sunset)
          .locale('bg')
          .format('HH:mm');
      }
    }

    setSunsetData(results);
  };

  const changeMonth = (offset: number) => {
    setMonth((prev) => prev.clone().add(offset, 'month'));
  };

  const renderCalendar = () => {
    const startOfMonth = month.clone().startOf('month');
    const endOfMonth = month.clone().endOf('month');
    const days: JSX.Element[] = [];

    for (let d = startOfMonth.date(); d <= endOfMonth.date(); d++) {
      const date = month.clone().date(d);
      const key = date.format('YYYY-MM-DD');

      days.push(
        <div
          key={key}
          className="alps-card"
          style={{
            padding: '8px',
            textAlign: 'center',
            borderRadius: 8,
            background: '#fafafa'
          }}
        >
          <div>{d}</div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            {sunsetData[key] || '-'}
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 6,
          marginTop: 12
        }}
      >
        {days}
      </div>
    );
  };

  return (
    <div
      className="alps-container"
      style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}
    >
      <h2>🌇 Залез на слънцето</h2>

      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 12
        }}
      >
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Населено място"
          className="alps-input"
        />
        <button className="alps-button" onClick={() => void fetchCoords(city)}>
          Търси
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <button className="alps-button" onClick={() => changeMonth(-1)}>
          ◀ Предишен
        </button>
        <h3>{month.format('MMMM YYYY')}</h3>
        <button className="alps-button" onClick={() => changeMonth(1)}>
          Следващ ▶
        </button>
      </div>

      {renderCalendar()}
    </div>
  );
};

export default SunsetCalendar;
