import './Login.css'
import Tile from '@components/Tile/Tile.tsx'
import { useNavigate } from 'react-router-dom';

import { RiEdit2Line } from '@remixicon/react'
import { RiArticleLine } from '@remixicon/react'
import { RiImage2Line } from '@remixicon/react'
import { RiContactsBookLine } from '@remixicon/react'
import { RiArchiveLine } from '@remixicon/react'
import { RiInformation2Line } from '@remixicon/react'
import Logo from '@assets/logo.svg';
function Login() {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img src={Logo} alt="Logo" className="mx-auto mb-4" />
            <h1 className="text-2xl text-white font-bold mb-4 text-center">Accès administrateur</h1>
            <form className="flex flex-col gap-6">
              <input type="text" placeholder="Email" className="p-2 border rounded" />
              <input type="password" placeholder="Mot de passe" className="p-2 border rounded" />
              <button type="submit" className="login-button">Se connecter</button>
              <button onClick={() => navigate('/')} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
                Retour
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
