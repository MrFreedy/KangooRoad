import './Home.css';
import Tile from '@components/Tile/Tile.tsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@src/context/AuthContext';
import {
  RiDashboardLine,
  RiEdit2Line,
  RiFileTextLine,
  RiMultiImageLine,
  RiQuestionLine,
  RiArticleLine,
  RiImage2Line,
  RiContactsBookLine,
  RiArchiveLine,
  RiInformation2Line
} from '@remixicon/react';

type User = { id: number; username: string; is_admin: boolean };

function Home() {
  const navigate = useNavigate();
  const { user, error } = useAuth();
  const [errMsg, setErrMsg] = useState<string>('');
  const [isAdminView, setIsAdminView] = useState<boolean>(user?.is_admin ?? false);

  return (
    <>
      <h1 className="Home-title text-center font-bold text-3xl">
        Bienvenue{user ? `, ${user.username}` : ''} 👋
      </h1>

      {user?.is_admin && (
        <div className="flex justify-center mt-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <span className="text-sm">{isAdminView ? 'Panel Administrateur' : 'Panel Utilisateur'}</span>

            <div
              onClick={() => setIsAdminView(!isAdminView)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                isAdminView ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  isAdminView ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </label>
        </div>
      )}

      {errMsg && (
        <p className="text-center mt-2 text-sm text-red-600" role="alert">
          {errMsg}
        </p>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 py-6 mb-20">

          {isAdminView && user?.is_admin && (
            <>
              <Tile
                label="Gérer les sections"
                bgColor="var(--color-cobalt)"
                hoverColor="var(--color-cobalt-hover)"
                isAnimated
                icon={<RiDashboardLine className="text-white" />}
                onClick={() => navigate('/sections')}
              />
              <Tile
                label="Gérer les questions"
                bgColor="var(--color-green)"
                hoverColor="var(--color-green-hover)"
                isAnimated
                icon={<RiQuestionLine className="text-white" />}
                onClick={() => navigate('/questions')}
              />
              <Tile
                label="Gérer les feedbacks"
                bgColor="var(--color-red)"
                hoverColor="var(--color-red-hover)"
                isAnimated
                icon={<RiFileTextLine className="text-white" />}
                onClick={() => navigate('/feedbacks')}
              />
              <Tile
                label="Gérer la galerie"
                bgColor="var(--color-amber)"
                hoverColor="var(--color-amber-hover)"
                isAnimated
                icon={<RiMultiImageLine className="text-white" />}
                onClick={() => navigate('/galerie')}
              />
              <Tile
                label="Gérer les archives"
                bgColor="var(--color-teal)"
                hoverColor="var(--color-teal-hover)"
                isAnimated
                icon={<RiArchiveLine className="text-white" />}
                onClick={() => navigate('/archives')}
              />
              <Tile
                label="Gérer les informations"
                bgColor="var(--color-grape)"
                hoverColor="var(--color-grape-hover)"
                isAnimated
                icon={<RiInformation2Line className="text-white" />}
                onClick={() => navigate('/informations')}
              />
            </>
          )}

          {!isAdminView && (
            <>
              <Tile
                label="Déposer un feedback"
                bgColor="var(--color-cobalt)"
                hoverColor="var(--color-cobalt-hover)"
                isAnimated
                icon={<RiEdit2Line className="text-white" />}
                onClick={() => navigate('/form')}
              />
              <Tile
                label="Consulter les feedbacks"
                bgColor="var(--color-green)"
                hoverColor="var(--color-green-hover)"
                isAnimated
                icon={<RiArticleLine className="text-white" />}
                onClick={() => navigate('/overview')}
              />
              <Tile
                label="Galerie"
                bgColor="var(--color-amber)"
                hoverColor="var(--color-amber-hover)"
                isAnimated
                icon={<RiImage2Line className="text-white" />}
                onClick={() => alert('Paramètres clicked')}
              />
              <Tile
                label="Annuaire"
                bgColor="var(--color-pink)"
                hoverColor="var(--color-pink-hover)"
                isAnimated
                icon={<RiContactsBookLine className="text-white" />}
                onClick={() => navigate('/annuaire')}
              />
              <Tile
                label="Archives"
                bgColor="var(--color-teal)"
                hoverColor="var(--color-teal-hover)"
                isAnimated
                icon={<RiArchiveLine className="text-white" />}
                onClick={() => alert('Aide clicked')}
              />
              <Tile
                label="Informations"
                bgColor="var(--color-grape)"
                hoverColor="var(--color-grape-hover)"
                isAnimated
                icon={<RiInformation2Line className="text-white" />}
                onClick={() => alert('Déconnexion clicked')}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;