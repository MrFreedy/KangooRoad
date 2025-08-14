import './Feedbacks.css'
import Tile from '@components/Tile/Tile.tsx'
import Feedback from '@components/Feedback/Feedback.tsx'
import Headbar from '@components/Headbar/Headbar';
import { useNavigate, useLocation } from 'react-router-dom';

import { RiAddLine, RiCloseCircleLine, RiDeleteBin2Line, RiDownloadLine, RiEdit2Line, RiEyeLine, RiEyeOffLine, RiFileCheckLine, RiFileDownloadLine, RiSave3Line } from '@remixicon/react'
import { useEffect, useState, useMemo } from 'react';
import api from '@src/services/apiService';
import { downloadFeedbackPdf } from '@src/services/pdfDownload';

function Feedbacks() {
  const navigate = useNavigate();
  const location = useLocation();

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('Toutes');
  const [selectedSchool, setSelectedSchool] = useState<string>('Toutes');
  const [selectedCountry, setSelectedCountry] = useState<string>('Tous');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
  const [selectedContactable, setSelectedContactable] = useState<string>('Tous');
  const [userTypeSelected, setUserTypeSelected] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [validateOpen, setValidateOpen] = useState(false);
  const [currentFb, setCurrentFb] = useState<any | null>(null);
  const [form, setForm] = useState({
    school: '',
    year: '',
    city: '',
    country: '',
    user_type: '',
    is_contact: 'Oui',
    firstname: '',
    lastname: '',
    email: '',
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (location.state?.reset) {
      setUserTypeSelected(null);
    }
  }, [location.state]);

  const fetchFeedbacks = async () => {
    try {
      const toTs = (d: any) => {
        if (!d) return 0;
        if (d instanceof Date) return d.getTime();
        const t = new Date(d).getTime();
        return Number.isNaN(t) ? 0 : t;
        };

        const raw = await api.get('/feedbacks');

        const data = [...raw].sort((a: any, b: any) => {
        const needA = a.school == null ? 0 : 1;
        const needB = b.school == null ? 0 : 1;
        if (needA !== needB) return needA - needB;

        const da = toTs(a.submission_date);
        const db = toTs(b.submission_date);
        return db - da;
        });

        setFeedbacks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des feedbacks :', error);
    }
  };

  const uniqueYears = useMemo(
    () => [...new Set(feedbacks.map(fb => fb.year).filter((v: any) => v !== undefined && v !== null))],
    [feedbacks]
  );
  const uniqueSchools = useMemo(
    () => [...new Set(feedbacks.map(fb => fb.school).filter((v: any) => v !== undefined && v !== null))],
    [feedbacks]
  );
  const uniqueCountries = useMemo(
    () => [...new Set(feedbacks.map(fb => fb.country).filter((v: any) => v !== undefined && v !== null))],
    [feedbacks]
  );
  const uniqueStatus = useMemo(
    () => [...new Set(feedbacks.map(fb => fb.user_type).filter((v: any) => v !== undefined && v !== null))],
    [feedbacks]
  );
  const uniqueContactable = useMemo(
    () => [...new Set(feedbacks.map(fb => fb.is_contact).filter((v: any) => v !== undefined && v !== null))],
    [feedbacks]
  );

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchUserType = userTypeSelected === null || fb.user_type === userTypeSelected;
    const matchYear = selectedYear === 'Toutes' || String(fb.year) === selectedYear;
    const matchSchool = selectedSchool === 'Toutes' || fb.school === selectedSchool;
    const matchCountry = selectedCountry === 'Tous' || fb.country === selectedCountry;
    const matchStatus = selectedStatus === 'Tous' || fb.user_type === selectedStatus;

    let matchContactable = true;
    if (selectedContactable === 'Oui') matchContactable = fb.is_contact === true;
    else if (selectedContactable === 'Non') matchContactable = fb.is_contact === false;

    return matchUserType && matchYear && matchSchool && matchCountry && matchStatus && matchContactable;
  });

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce feedback ?')) {
      try {
        await api.delete(`/feedbacks/${id}`);
        fetchFeedbacks();
      } catch (error) {
        console.error('Erreur lors de la suppression du feedback :', error);
      }
    }
  };

  const handleVisibility = async (id: number) => {
    setFeedbacks(prev =>
      prev.map(f => f.id === id ? { ...f, is_visible: !f.is_visible } : f)
    );

    try {
      const current = feedbacks.find(f => f.id === id)?.is_visible ?? false;
      await api.put(`/feedbacks/${id}/visibility`, { is_visible: !current });
    } catch (error) {
      console.error('Erreur lors de la modification :', error);
      setFeedbacks(prev =>
        prev.map(f => f.id === id ? { ...f, is_visible: !f.is_visible } : f)
      );
    }
  };

  const openValidate = (fb: any) => {
    setCurrentFb(fb);
    setForm({
      school: fb.school ?? '',
      year: fb.year ? String(fb.year) : '',
      city: fb.city ?? '',
      country: fb.country ?? '',
      user_type: fb.user_type ?? '',
      is_contact: fb.is_contact === false ? 'Non' : 'Oui',
      firstname: fb.firstname ?? '',
      lastname: fb.lastname ?? '',
      email: fb.email ?? '',
    });
    setValidateOpen(true);
  };

  const closeValidate = () => {
    setValidateOpen(false);
    setCurrentFb(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleValidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
        form.school,
        form.year,
        form.city,
        form.country,
        form.user_type,
        form.is_contact
    ];

    if (form.is_contact === 'Oui') {
        requiredFields.push(form.lastname, form.firstname, form.email);
    }

    const hasEmpty = requiredFields.some(field => !field || String(field).trim() === '');

    if (hasEmpty) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    if (!currentFb) return;

    try {
        setIsSaving(true);
        await api.put(`/feedbacks/${currentFb.id}`, {
            school: form.school || null,
            year: form.year ? Number(form.year) : null,
            city: form.city || null,
            country: form.country || null,
            user_type: form.user_type || null,
            is_contact: form.is_contact === 'Oui',
            firstname: form.firstname || null,
            lastname: form.lastname || null,
            email: form.email || null,
        });

        await fetchFeedbacks();
        closeValidate();
    } catch (error) {
        console.error('Erreur lors de la validation du feedback :', error);
        toast.error("Erreur lors de la validation du feedback");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <>
      <h1 className="Home-title text-center font-bold text-2xl">Gestion des feedbacks 🗂️:</h1>

      <div className="flex flex-wrap justify-center gap-6 px-4 py-6">
        <div className="order-1">
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
        <div className="order-3 md:order-2">
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
        <div className="order-2 md:order-3">
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
        <div className="order-2 md:order-3">
          <label className="block font-semibold mb-1">Statut :</label>
          <select
            className="border rounded px-4 py-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Tous">Tous</option>
            {uniqueStatus.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="order-2 md:order-3">
          <label className="block font-semibold mb-1">Contactable :</label>
          <select
            className="border rounded px-4 py-2"
            value={selectedContactable}
            onChange={(e) => setSelectedContactable(e.target.value)}
          >
            <option value="Tous">Tous</option>
            {uniqueContactable.map((c) => (
              <option key={String(c)} value={c ? 'Oui' : 'Non'}>
                {c ? 'Oui' : 'Non'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto px-4 mb-20">
        <div className="max-w-full mx-20">
          <table className="min-w-full bg-white border border-gray-200 text-center text-sm sm:text-base shadow-md rounded-lg overflow-hidden table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-r border-gray-200">Feedbacks</th>
                <th className="px-4 py-2 w-44">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((fb) => (
                  <tr key={fb.id} className="border-t align-top">
                    <td className="px-4 py-2 align-top border-r border-gray-200">
                      <Feedback {...fb} />
                    </td>
                    <td className="px-4 py-2 align-top">
                      <div className="flex items-start justify-center gap-2 flex-nowrap">
                        {(fb.city === null || fb.country === null || fb.school === null || fb.year === null || fb.user_type === null || fb.is_contact === null) ? (
                          <>
                            <button
                              className={'text-white rounded p-2 bg-green-500 hover:bg-green-600 flex items-center gap-2'}
                              onClick={() => openValidate(fb)}
                              aria-label='Valider'
                              title='Valider'
                            >
                              <RiFileCheckLine className="scale-90 inline-block" />
                              <span>Valider</span>
                            </button>
                            <button
                              className={'text-white rounded p-2 bg-red-500 hover:bg-red-600 flex items-center gap-2'}
                              onClick={() => handleDelete(fb.id)}
                              aria-label='Refuser'
                              title='Refuser'
                            >
                              <RiCloseCircleLine className="scale-90 inline-block" />
                              <span>Refuser</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={`text-white rounded p-2 ${fb.is_visible ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                              onClick={() => handleVisibility(fb.id)}
                              aria-label={fb.is_visible ? 'Voir' : 'Caché'}
                              title={fb.is_visible ? 'Voir' : 'Caché'}
                            >
                              {fb.is_visible ? <RiEyeLine className="scale-90 inline-block" /> : <RiEyeOffLine className="scale-90 inline-block" />}
                            </button>
                            <button
                              className="text-white rounded p-2 bg-purple-500 hover:bg-purple-600"
                              onClick={() => navigate('/')}
                              aria-label="Éditer"
                              title="Éditer"
                            >
                              <RiEdit2Line className="inline-block" />
                            </button>
                            <button
                              className="text-white rounded p-2 bg-teal-500 hover:bg-teal-600"
                              onClick={() => downloadFeedbackPdf(fb)}
                              aria-label="Télécharger"
                              title="Télécharger"
                            >
                              <RiFileDownloadLine className="inline-block" />
                            </button>
                            <button
                              className="text-white rounded p-2 bg-red-500 hover:bg-red-600"
                              onClick={() => handleDelete(fb.id)}
                              aria-label="Supprimer"
                              title="Supprimer"
                            >
                              <RiDeleteBin2Line className="inline-block" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-gray-500 py-4">
                    Aucun feedback trouvé pour les critères sélectionnés.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {validateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeValidate}></div>

          <div className="relative z-10 w-full max-w-xl mx-4 rounded-lg bg-white shadow-lg">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-center">Ajouter les informations</h2>
            </div>

            <form onSubmit={handleValidateSubmit} noValidate className="px-6 pt-4 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  École (mobilité) <span className="text-red-500">*</span>
                </label>
                <input
                  name="school"
                  value={form.school}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="ex. 3iL"
                  required
                />
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Année (mobilité) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="ex. 2022"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ville (mobilité) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="ex. Rodez"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pays (mobilité) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="ex. France"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Statut de l'étudiant <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="user_type"
                    value={form.user_type}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Sélectionner le statut de l'étudiant</option>
                    <option value="etudiant">Alternant</option>
                    <option value="alternant">Étudiant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                    Contactable <span className="text-red-500">*</span>
                    </label>
                    <select
                    name="is_contact"
                    value={form.is_contact}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                    required
                    >
                    <option value="">Sélectionner une option</option>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                    </select>
                </div>
                </div>

                {form.is_contact === 'Oui' && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                        Nom <span className="text-red-500">*</span>
                        </label>
                        <input
                        name="lastname"
                        value={form.lastname}
                        onChange={handleFormChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="ex. Martin"
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                        Prénom <span className="text-red-500">*</span>
                        </label>
                        <input
                        name="firstname"
                        value={form.firstname}
                        onChange={handleFormChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="ex. Arthur"
                        required
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                        Email <span className="text-red-500">*</span>
                        </label>
                        <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleFormChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="ex. email@test.com"
                        required
                        />
                    </div>
                    </div>
                </>
                )}

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeValidate} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                  Annuler
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 rounded px-4 py-2 text-white font-semibold w-full sm:w-auto"
                    disabled={isSaving}
                    aria-busy={isSaving}
                    onClick={handleValidateSubmit}
                    >
                    <RiSave3Line className="scale-90 inline-block" />
                    {isSaving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Feedbacks;