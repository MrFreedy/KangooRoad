import './Overview.css'
import Tile from '@components/Tile/Tile.tsx'
import { useNavigate } from 'react-router-dom';

import { RiBriefcaseLine, RiGraduationCapLine } from '@remixicon/react'

function Overview() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="Home-title text-center font-bold text-3xl">Vous êtes :</h1>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 py-6 mb-15">
          <Tile
            label="Alternant"
            bgColor="var(--color-cobalt)"
            hoverColor="var(--color-cobalt-hover)"
            icon={<RiBriefcaseLine className="text-white"/>}
            onClick={() => displayFeedback("Alternant")}
          />
          <Tile
            label="Étudiant"
            bgColor="var(--color-green)"
            hoverColor="var(--color-green-hover)"
            icon={<RiGraduationCapLine className="text-white"/>}
            onClick={() => displayFeedback("Étudiant")}
          />
        </div>
      </div>
    </>
  )

  function displayFeedback(label: string) {
    if (label === 'Alternant') {
      navigate('/form');
    }
    else if (label === 'Étudiant') {
      navigate('/overview');
    }
  }
}

export default Overview
