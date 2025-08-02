import './Overview.css'
import Tile from '@components/Tile/Tile.tsx'
import Feedback from '@components/Feedback/Feedback.tsx'
import { useNavigate } from 'react-router-dom';
import Headbar from '@components/Headbar/Headbar';

import { RiBriefcaseLine, RiGraduationCapLine } from '@remixicon/react'
import { useEffect, useState, useMemo } from 'react';
import API_BASE_URL from '@src/config';

function Overview() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedYear, setSelectedYear] = useState<string>('Toutes');
  const [selectedSchool, setSelectedSchool] = useState<string>('Toutes');
  const [selectedCountry, setSelectedCountry] = useState<string>('Tous');
  const [userTypeSelected, setUserTypeSelected] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}feedbacks`);
      const data = await res.json();
      data.sort((a, b) => (b.year || 0) - (a.year || 0));
      setFeedbacks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des feedbacks :', error);
    }
  };

  const uniqueYears = useMemo(() => [...new Set(feedbacks.map(fb => fb.year).filter(Boolean))], [feedbacks]);
  const uniqueSchools = useMemo(() => [...new Set(feedbacks.map(fb => fb.school).filter(Boolean))], [feedbacks]);
  const uniqueCountries = useMemo(() => [...new Set(feedbacks.map(fb => fb.country).filter(Boolean))], [feedbacks]);

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchUserType = userTypeSelected === null || fb.user_type === userTypeSelected;
    const matchYear = selectedYear === 'Toutes' || String(fb.year) === selectedYear;
    const matchSchool = selectedSchool === 'Toutes' || fb.school === selectedSchool;
    const matchCountry = selectedCountry === 'Tous' || fb.country === selectedCountry;
    return matchUserType && matchYear && matchSchool && matchCountry;
  });

  return (
    <>
      {userTypeSelected === null ? (
        <>
          <h1 className="Home-title text-center font-bold text-2xl">Vous êtes :</h1>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 py-6 mb-15">
              <Tile
                label="Alternant"
                bgColor="var(--color-cobalt)"
                hoverColor="var(--color-cobalt-hover)"
                icon={<RiBriefcaseLine className="text-white" />}
                onClick={() => {
                  setUserTypeSelected('alternant');
                  sessionStorage.setItem('insideFeedbacks', 'true');
                }}
              />
              <Tile
                label="Étudiant"
                bgColor="var(--color-green)"
                hoverColor="var(--color-green-hover)"
                icon={<RiGraduationCapLine className="text-white" />}
                onClick={() => {
                  setUserTypeSelected('étudiant');
                  sessionStorage.setItem('insideFeedbacks', 'true');
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="Home-title text-center font-bold text-2xl">Aperçu des feedbacks 📖:</h1>
          <div className="flex flex-wrap justify-center gap-6 px-4 py-6">
            <div>
              <label className="block font-semibold mb-1">Année :</label>
              <select
                className="border rounded px-4 py-2"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="Toutes">Toutes</option>
                {uniqueYears.map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">École :</label>
              <select
                className="border rounded px-4 py-2"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
              >
                <option value="Toutes">Toutes</option>
                {uniqueSchools.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Pays :</label>
              <select
                className="border rounded px-4 py-2"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="Tous">Tous</option>
                {uniqueCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-4 py-6 space-y-6">
            {filteredFeedbacks.map((fb, idx) => (
              <Feedback key={idx} {...fb} />
            ))}
            {filteredFeedbacks.length === 0 && (
              <div className="text-center text-gray-500">
                Aucun feedback trouvé pour les critères sélectionnés.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Overview
