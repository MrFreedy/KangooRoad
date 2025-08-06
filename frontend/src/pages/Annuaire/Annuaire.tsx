import './Annuaire.css'
import AnnuaireCard from '@components/AnnuaireCard/AnnuaireCard.tsx'
import Feedback from '@components/Feedback/Feedback.tsx'
import { useNavigate } from 'react-router-dom';
import Headbar from '@components/Headbar/Headbar';

import { RiBriefcaseLine, RiGraduationCapLine } from '@remixicon/react'
import { useEffect, useState, useMemo } from 'react';
import API_BASE_URL from '@src/config';

function Annuaire() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('Toutes');
  const [selectedSchool, setSelectedSchool] = useState<string>('Toutes');
  const [selectedType, setSelectedType] = useState<string>('Tous');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}feedbacks`);
        const data = await res.json();

        data.sort((a, b) => (b.year || 0) - (a.year || 0));

        const contactsOnly = data.filter(fb => fb.is_contact === true);

        setFeedbacks(contactsOnly);
    } catch (error) {
        console.error('Erreur lors du chargement des feedbacks :', error);
    }
};

        const uniqueCountries = useMemo(() => [...new Set(feedbacks.map(fb => fb.country).filter(Boolean))], [feedbacks]);
        const uniqueSchools = useMemo(() => [...new Set(feedbacks.map(fb => fb.school).filter(Boolean))], [feedbacks]);
        const uniqueTypes = useMemo(() => [...new Set(feedbacks.map(fb => fb.user_type).filter(Boolean))], [feedbacks]);

    const filteredFeedbacks = feedbacks.filter((fb) => {
        const matchType = selectedType === 'Tous' || fb.user_type === selectedType;
        const matchCountry = selectedCountry === 'Toutes' || fb.country === selectedCountry;
        const matchSchool = selectedSchool === 'Toutes' || fb.school === selectedSchool;
        const isContact = fb.is_contact === true;
        return matchType && matchCountry && matchSchool && isContact;
    });

  return (
    <>
        <h1 className="Home-title text-center font-bold text-3xl">Annuaire 📧</h1>
        <div className="flex flex-col items-center gap-6 px-4 py-6 sm:flex-row sm:flex-wrap sm:justify-center">
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
                <option value="Toutes">Toutes</option>
                {uniqueCountries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
                </select>
            </div>

            <div>
                <label className="block font-semibold mb-1">Statut :</label>
                <select
                className="border rounded px-4 py-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                >
                <option value="Tous">Tous</option>
                {uniqueTypes.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 px-8 sm:px-30 py-6 mb-15">
        {filteredFeedbacks.map((fb, idx) => (
            <AnnuaireCard key={idx} {...fb} />
        ))}
        {filteredFeedbacks.length === 0 && (
            <div className="text-center text-gray-500">
            Aucun contact trouvé pour les critères sélectionnés.
            </div>
        )}
        </div>
    </>
  );
}

export default Annuaire;
