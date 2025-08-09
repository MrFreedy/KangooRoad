import './Contact.css';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkLogo from '@assets/logo-dark.svg';

function Contact() {
  const navigate = useNavigate();

  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullname.trim()) newErrors.fullname = 'Le nom complet est obligatoire.';
    if (!email.trim()) newErrors.email = 'L’email est obligatoire.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Format email invalide.';
    if (!subject.trim()) newErrors.subject = 'Le sujet est obligatoire.';
    if (!message.trim()) newErrors.message = 'Le message est obligatoire.';
    return newErrors;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setOkMsg('');
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // Simule un appel API
      await new Promise((r) => setTimeout(r, 600));
      setOkMsg('Message envoyé. Merci pour votre retour !');
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Erreur d’envoi', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field: string) =>
    `mt-2 w-full rounded-lg border-2 px-4 py-2 outline-none focus:ring-2 ${
      errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
        : 'border-gray-200 focus:border-gray-400 focus:ring-gray-200'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-col items-center gap-3 mb-6">
            <img src={DarkLogo} alt="Logo KangooRoad" className="h-20 w-auto" />
            <h1 className="text-2xl font-bold text-gray-900">
              Formulaire de contact
            </h1>
            <p className="text-sm text-gray-600 text-center max-w-xl">
              Ce formulaire sert à remonter des informations liées au site{' '}
              <strong>KangooRoad</strong>. Pour la mobilité internationale,
              écrivez à{' '}
              <a
                className="underline underline-offset-2 hover:no-underline"
                href="mailto:XXXX@XXXX.fr"
              >
                XXXX@XXXX.fr
              </a>.
            </p>
          </div>

          {okMsg && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800">
              {okMsg}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                Prénom Nom <span className="text-red-500">*</span>
              </label>
              <input
                id="fullname"
                type="text"
                className={inputClasses('fullname')}
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullname && (
                <p className="mt-1 text-xs text-red-600">{errors.fullname}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={inputClasses('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Sujet <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                className={inputClasses('subject')}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Choisissez un sujet</option>
                <option value="suggestion">Suggestion</option>
                <option value="improvement">Amélioration</option>
                <option value="bug">Bug</option>
                <option value="other">Autre</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                rows={6}
                className={inputClasses('message')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Retour
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2 font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Envoi…' : 'Envoyer le message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;