import './Home.css'
import Tile from '@components/Tile/Tile.tsx'
import { useNavigate } from 'react-router-dom';

import { RiEdit2Line } from '@remixicon/react'
import { RiArticleLine } from '@remixicon/react'
import { RiImage2Line } from '@remixicon/react'
import { RiContactsBookLine } from '@remixicon/react'
import { RiArchiveLine } from '@remixicon/react'
import { RiInformation2Line } from '@remixicon/react'

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="Home-title text-center font-bold text-3xl">Bienvenue👋</h1>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 py-6 mb-15">
          <Tile
            label="Déposer un feedback"
            bgColor="var(--color-cobalt)"
            hoverColor="var(--color-cobalt-hover)"
            icon={<RiEdit2Line className="text-white"/>}
            onClick={() => navigate('/form')}
          />
          <Tile
            label="Consulter les feedbacks"
            bgColor="var(--color-green)"
            hoverColor="var(--color-green-hover)"
            icon={<RiArticleLine className="text-white"/>}
            onClick={() => alert('Messages clicked')}
          />
          <Tile
            label="Galerie"
            bgColor="var(--color-amber)"
            hoverColor="var(--color-amber-hover)"
            icon={<RiImage2Line className="text-white"/>}
            onClick={() => alert('Paramètres clicked')}
          />
          <Tile
            label="Annuaire"
            bgColor="var(--color-pink)"
            hoverColor="var(--color-pink-hover)"
            icon={<RiContactsBookLine className="text-white" />}
            onClick={() => alert('Notifications clicked')}
          />
          <Tile
            label="Archives"
            bgColor="var(--color-teal)"
            hoverColor="var(--color-teal-hover)"
            icon={<RiArchiveLine className="text-white"/>}
            onClick={() => alert('Aide clicked')}
          />
          <Tile
            label="Informations"
            bgColor="var(--color-grape)"
            hoverColor="var(--color-grape-hover)"
            icon={<RiInformation2Line className="text-white"/>}
            onClick={() => alert('Déconnexion clicked')}
          />
        </div>
      </div>
    </>
  )
}

export default Home
