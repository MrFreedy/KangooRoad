import './Sections.css'
import AnnuaireCard from '@components/AnnuaireCard/AnnuaireCard.tsx'
import Feedback from '@components/Feedback/Feedback.tsx'
import { useNavigate, useLocation } from 'react-router-dom';
import Headbar from '@components/Headbar/Headbar';

import { RiAddLine, RiBriefcaseLine, RiDeleteBin2Line, RiEdit2Line, RiEyeLine, RiEyeOffLine, RiGraduationCapLine, RiSave2Line, RiSave3Line } from '@remixicon/react'
import { useEffect, useState, useMemo } from 'react';
import api from '@src/services/apiService';

function Sections() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sections, setSections] = useState([]);
    const [isListView, setIsListView] = useState(true);
    const [isCreateForm, setIsCreateForm] = useState(false);
    const [sectionName, setSectionName] = useState('');
    const [order, setOrder] = useState<number | ''>('');
    const [isActive, setIsActive] = useState<'1' | '0'>('1');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isCreateForm && !isListView) {
            sessionStorage.setItem('insideCreationForm', 'true');
        } else {
            sessionStorage.removeItem('insideCreationForm');
        }
    }, [isCreateForm, isListView]);

    useEffect(() => {
    if (location.state?.reset) {
        setIsCreateForm(false);
        setIsListView(true);
    }
    }, [location.state]);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const data = await api.get('/sections');

            data.sort((a, b) => a.order - b.order);
            setSections(data);
        } catch (error) {
            console.error('Erreur lors du chargement des sections :', error);
        }
    };

    const showListView = () => {
        setIsListView(true);
        setIsCreateForm(false);
    };

    const showCreateForm = () => {
        setIsCreateForm(true);
        setIsListView(false);
        setSectionName('');
        setOrder('');
        setIsActive('1');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            // TODO: appel API pour créer la section
            // await api.post('/sections', { name: sectionName, order: Number(order), is_active: isActive === '1' })

            showListView(); // retour à la liste
        } finally {
            setIsSaving(false);
        }
    };

  return (
    <>
    {isListView && !isCreateForm && (
    <>
        <h1 className="text-center font-bold text-2xl sm:text-3xl">Gestion des sections</h1>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 mb-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Liste des sections</h2>

            <button
            type="button"
            onClick={showCreateForm}
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 rounded px-4 py-2 text-white font-semibold w-full sm:w-auto"
            >
            <RiAddLine className="scale-90 inline-block" />
            Ajouter une section
            </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 text-center text-sm sm:text-base">
            <thead className="bg-gray-100 text-black font-bold">
                <tr>
                <th className="px-4 sm:px-6 py-3 border border-gray-200 tracking-wider">Ordre</th>
                <th className="px-4 sm:px-6 py-3 border border-gray-200 tracking-wider">Nom</th>
                <th className="px-4 sm:px-6 py-3 border border-gray-200 tracking-wider">Visibilité</th>
                <th className="px-4 sm:px-6 py-3 border border-gray-200 tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody>
                {sections.map((section) => (
                <tr key={section.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 border border-gray-200">{section.order}</td>
                    <td className="px-4 sm:px-6 py-3 border border-gray-200">{section.name}</td>
                    <td
                    className={`px-4 sm:px-6 py-3 border border-gray-200 ${
                        section.is_active ? 'text-green-600' : 'text-red-500'
                    }`}
                    >
                    {section.is_active ? 'Visible' : 'Caché'}
                    </td>
                    <td className="px-4 sm:px-6 py-3 border border-gray-200">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                        className={`text-white rounded p-2 ${
                            section.is_active ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
                        }`}
                        onClick={() => navigate(`/sections/edit/${section.id}`)}
                        aria-label={section.is_active ? 'Voir' : 'Caché'}
                        title={section.is_active ? 'Voir' : 'Caché'}
                        >
                        {section.is_active ? (
                            <RiEyeLine className="scale-90 inline-block" />
                        ) : (
                            <RiEyeOffLine className="scale-90 inline-block" />
                        )}
                        </button>

                        <button
                        className="text-white rounded p-2 bg-purple-500 hover:bg-purple-600"
                        onClick={() => navigate(`/sections/edit/${section.id}`)}
                        aria-label="Éditer"
                        title="Éditer"
                        >
                        <RiEdit2Line className="scale-90 inline-block" />
                        </button>

                        <button
                        className="text-white rounded p-2 bg-red-500 hover:bg-red-600"
                        onClick={() => navigate(`/sections/edit/${section.id}`)}
                        aria-label="Supprimer"
                        title="Supprimer"
                        >
                        <RiDeleteBin2Line className="scale-90 inline-block" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </>
    )}

    {isCreateForm && !isListView && (
    <>
        <h1 className="text-center font-bold text-2xl sm:text-3xl">Formulaire de création de section</h1>

        <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 mb-24"
        >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
            <label className="block font-semibold mb-2">
                Nom de la section <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                className="border rounded px-4 py-2 w-full"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                required
            />
            </div>

            <div>
            <label className="block font-semibold mb-2">
                Ordre <span className="text-red-500">*</span>
            </label>
            <input
                type="number"
                className="border rounded px-4 py-2 w-full"
                value={order}
                onChange={(e) => setOrder(e.target.value === '' ? '' : Number(e.target.value))}
                required
                min={0}
            />
            </div>

            <div>
            <label className="block font-semibold mb-2">Visibilité</label>
            <select
                className="border rounded px-4 py-2 w-full"
                value={isActive}
                onChange={(e) => setIsActive(e.target.value as '1' | '0')}
            >
                <option value="1">Visible</option>
                <option value="0">Caché</option>
            </select>
            </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 rounded px-4 py-2 text-white font-semibold w-full sm:w-auto"
            disabled={isSaving}
            aria-busy={isSaving}
            >
            <RiSave3Line className="scale-90 inline-block" />
            {isSaving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
        </div>
        </form>
    </>
    )}
    </>
  );
}

export default Sections;
