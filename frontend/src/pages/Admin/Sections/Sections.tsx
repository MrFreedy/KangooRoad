import './Sections.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { RiAddLine, RiDeleteBin2Line, RiEdit2Line, RiEyeLine, RiEyeOffLine, RiSave3Line } from '@remixicon/react'
import { useEffect, useState } from 'react';
import api from '@src/services/apiService';

type Section = {
  id: number;
  name: string;
  order: number;
  is_active: boolean;
};

function Sections() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sections, setSections] = useState<Section[]>([]);
  const [isListView, setIsListView] = useState(true);
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [isEditForm, setIsEditForm] = useState(false);

  // ✅ nouvel état pour l'ID en édition
  const [sectionId, setSectionId] = useState<number | null>(null);

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
      const data = await api.get<Section[]>('/sections');
      data.sort((a, b) => a.order - b.order);
      setSections(data);
    } catch (error) {
      console.error('Erreur lors du chargement des sections :', error);
    }
  };

  const showListView = () => {
    fetchSections();
    setIsListView(true);
    setIsEditForm(false);
    setIsCreateForm(false);
    setSectionId(null); // ✅ reset
  };

  const showCreateForm = () => {
    setIsCreateForm(true);
    setIsListView(false);
    setIsEditForm(false);
    setSectionId(null); // ✅ reset
    setSectionName('');
    setOrder('');
    setIsActive('1');
  };

  const showEditForm = (section: Section) => {
    setIsEditForm(true);
    setIsListView(false);
    setIsCreateForm(false);
    setSectionId(section.id); // ✅ on mémorise l'ID
    setSectionName(section.name);
    setOrder(section.order);
    setIsActive(section.is_active ? '1' : '0');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const payload = {
        name: sectionName,
        order: Number(order),
        is_active: isActive === '1',
      };

      if (isEditForm) {
        if (sectionId == null) {
          throw new Error('Aucune section sélectionnée pour la modification');
        }
        await api.put(`/sections/${sectionId}`, payload); // ✅ sectionId existe
      } else {
        await api.post('/sections', payload);
      }

      showListView();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      try {
        await api.delete(`/sections/${id}`);
        fetchSections();
      } catch (error) {
        console.error('Erreur lors de la suppression de la section :', error);
      }
    }
  };

  const handleVisibility = async (id: number) => {
    try {
      const current = sections.find(s => s.id === id)?.is_active ?? false;
      await api.put(`/sections/${id}/visibility`, { is_active: !current });
      fetchSections();
    } catch (error) {
      console.error('Erreur lors de la modification de la visibilité de la section :', error);
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
                        onClick={() => handleVisibility(section.id)}
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
                        onClick={() => showEditForm(section)}
                        aria-label="Éditer"
                        title="Éditer"
                        >
                        <RiEdit2Line className="scale-90 inline-block" />
                        </button>

                        <button
                        className="text-white rounded p-2 bg-red-500 hover:bg-red-600"
                        onClick={() => handleDelete(section.id)}
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

    {(isCreateForm || isEditForm) && !isListView && (
    <>
        <h1 className="text-center font-bold text-2xl sm:text-3xl">Formulaire de {isEditForm ? 'modification' : 'création'} de section</h1>

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
            onClick={handleSubmit}
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
