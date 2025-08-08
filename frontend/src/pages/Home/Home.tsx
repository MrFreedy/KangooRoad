import './Home.css'
import Tile from '@components/Tile/Tile.tsx'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@src/services/apiService';

import { RiEdit2Line } from '@remixicon/react'
import { RiArticleLine } from '@remixicon/react'
import { RiImage2Line } from '@remixicon/react'
import { RiContactsBookLine } from '@remixicon/react'
import { RiArchiveLine } from '@remixicon/react'
import { RiInformation2Line } from '@remixicon/react'

type User = { id: number; username: string; is_admin: boolean };

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string>('');

  return (
    <>
      <h1 className="Home-title text-center font-bold text-3xl">
        Bienvenue{user ? `, ${user.username}` : ''} 👋
      </h1>

      {/* Badge/notice admin */}
      {user?.is_admin && (
        <p className="text-center mt-2 text-sm text-green-700">
          Mode administrateur activé
        </p>
      )}

      {errMsg && (
        <p className="text-center mt-2 text-sm text-red-600" role="alert">
          {errMsg}
        </p>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 py-6 mb-15">
          <Tile
            label="Déposer un feedback"
            bgColor="var(--color-cobalt)"
            hoverColor="var(--color-cobalt-hover)"
            icon={<RiEdit2Line className="text-white" />}
            onClick={() => navigate('/form')}
          />

          <Tile
            label="Consulter les feedbacks"
            bgColor="var(--color-green)"
            hoverColor="var(--color-green-hover)"
            icon={<RiArticleLine className="text-white" />}
            onClick={() => navigate('/overview')}
          />

          <Tile
            label="Galerie"
            bgColor="var(--color-amber)"
            hoverColor="var(--color-amber-hover)"
            icon={<RiImage2Line className="text-white" />}
            onClick={() => alert('Paramètres clicked')}
          />

          <Tile
            label="Annuaire"
            bgColor="var(--color-pink)"
            hoverColor="var(--color-pink-hover)"
            icon={<RiContactsBookLine className="text-white" />}
            onClick={() => navigate('/annuaire')}
          />

          <Tile
            label="Archives"
            bgColor="var(--color-teal)"
            hoverColor="var(--color-teal-hover)"
            icon={<RiArchiveLine className="text-white" />}
            onClick={() => alert('Aide clicked')}
          />

          <Tile
            label="Informations"
            bgColor="var(--color-grape)"
            hoverColor="var(--color-grape-hover)"
            icon={<RiInformation2Line className="text-white" />}
            onClick={() => alert('Déconnexion clicked')}
          />

          {/* Exemple de tuile visible UNIQUEMENT pour les admins */}
          {user?.is_admin && (
            <Tile
              label="Espace admin"
              bgColor="var(--color-cobalt)"
              hoverColor="var(--color-cobalt-hover)"
              icon={<RiInformation2Line className="text-white" />}
              onClick={() => navigate('/admin')}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;