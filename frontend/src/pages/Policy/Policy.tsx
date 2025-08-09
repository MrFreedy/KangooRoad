import './Policy.css'
import Tile from '@components/Tile/Tile.tsx'
import Feedback from '@components/Feedback/Feedback.tsx'
import Headbar from '@components/Headbar/Headbar';
import { useNavigate, useLocation } from 'react-router-dom';

import { RiBriefcaseLine, RiCake2Line, RiCake3Line, RiClockwiseLine, RiDatabase2Line, RiGraduationCapLine, RiInformation2Line, RiLineChartLine, RiLock2Line, RiLockLine, RiRefreshLine, RiShieldKeyholeLine, RiShieldUserLine, RiStackLine, RiTimeLine } from '@remixicon/react'
import { useEffect, useState, useMemo } from 'react';
import api from '@src/services/apiService';
function Policy() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className='mx-30 mb-25'>
        <p className='text-center'>
          <h1 className="font-bold text-3xl">
            Politique de Confidentialité
          </h1>
          Dernière mise à jour : 20/11/2024
        </p>

        <div className='mt-8 space-y-8'>

          <div>
            <span className='flex items-center gap-4'>
              <RiInformation2Line className='text-blue-500 scale-120'/>
              <h2 className='text-2xl font-bold'> 
                1. Qui sommes-nous ?
              </h2>
            </span>
            <p className='mt-2 text-md'>
              Trav3iL est un projet dédié à recueillir les retours d'expérience des étudiants ayant réalisé un semestre d'études à l'étranger. Ces données servent à générer des statistiques et à fournir des conseils aux futurs étudiants pour faciliter leur mobilité internationale.
            </p>
          </div>
          
          <div>
            <span className='flex items-center gap-4'>
              <RiDatabase2Line className='text-blue-500 scale-120'/>
              <h2 className='text-2xl font-bold'> 
                2. Données collectées
              </h2>
            </span>
            <p className="mt-2 text-md">
              Nous collectons les données suivantes via notre questionnaire :
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>
                <strong>Données personnelles :</strong> Les réponses aux questions concernant votre expérience
                (celles-ci sont anonymisées avant toute analyse).
              </li>
              <li>
                <strong>Données statistiques :</strong> Informations générales sur les destinations, les
                logements, le coût de la vie, etc.
              </li>
            </ul>
          </div>

          <div>
            <span className='flex items-center gap-4'>
              <RiLineChartLine className='text-blue-500 scale-120'/>
              <h2 className='text-2xl font-bold'> 
                3. Objectifs de la collecte
              </h2>
            </span>
            <p className="mt-2 text-md">
              Les données collectées sont utilisées pour :
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>
                Produire des statistiques anonymisées afin d’identifier des tendances et des points d'amélioration pour la mobilité internationale des étudiants.
              </li>
              <li>
                Aider les futurs étudiants en leur fournissant des informations pratiques sur les destinations internationales.
              </li>
              <li>
                Améliorer l'accompagnement des étudiants par les écoles et universités partenaires.
              </li>
            </ul>
            <p className="mt-2 text-md">
              En aucun cas, vos données ne seront vendues ou utilisées à des fins commerciales.
            </p>
          </div>

          <div>
            <span className='flex items-center gap-4'>
              <RiShieldKeyholeLine className='text-blue-500 scale-120'/>
              <h2 className='text-2xl font-bold'> 
                4. Anonymisation et protection des données
              </h2>
            </span>
            <p className='mt-2 text-md'>
              Pour respecter votre vie privée et les réglementations européennes (RGPD), nous anonymisons les réponses avant toute analyse. Cela signifie que vos réponses ne seront jamais associées directement à votre identité.
              <br /><br />
              Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou divulgation.
            </p>
          </div>

          <div>
            <span className='flex items-center gap-4'>
              <RiShieldUserLine className='text-blue-500 scale-120'/>
              <h2 className='text-2xl font-bold'> 
                5. Vos droits
              </h2>
            </span>
            <p className="mt-2 text-md">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>
                Accéder à vos données personnelles.
              </li>
              <li>
                Demander leur correction ou leur suppression.
              </li>
              <li>
                Retirer votre consentement pour leur utilisation.
              </li>
              <li>
                Déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) si vous estimez que vos droits ne sont pas respectés.
              </li>
            </ul>
            <p className="mt-2 text-md">
              Pour toute demande concernant vos données, contactez-nous via <a href="/contact" className="text-blue-500 underline">notre formulaire</a>.
            </p>
          </div>

          <div>
            <span className='flex items-center gap-4'>
              <RiTimeLine className='text-blue-500 scale-120'/>
              <h2 className='text-2xl font-bold'> 
                6. Conservation des données
              </h2>
            </span>
            <p className='mt-2 text-md'>
              Les données collectées sont conservées pour une durée maximale de 5 ans après leur anonymisation. Passé ce délai, elles sont supprimées de manière sécurisée.
            </p>
          </div>

          <div>
            <span className='flex items-center gap-4'>
              <RiCake3Line className='text-blue-500 scale-120'/>
              <h2 className='text-2xl font-bold'> 
                7. Cookies
              </h2>
            </span>
            <p className='mt-2 text-md'>
              Nous utilisons des cookies strictement nécessaires pour le bon fonctionnement du site et la gestion des sessions utilisateurs. Aucun cookie tiers ou publicitaire n'est utilisé.            
            </p>
          </div>

          <div>
            <span className='flex items-center gap-4'>
              <RiRefreshLine className='text-blue-500 scale-120'/>
              <h2 className='text-2xl font-bold'> 
                8. Modifications de la politique de confidentialité
              </h2>
            </span>
            <p className='mt-2 text-md'>
              Cette politique de confidentialité peut être mise à jour pour refléter les évolutions légales ou techniques. La date de la dernière mise à jour sera indiquée en haut de cette page. 
            </p>         
          </div>
        </div>
        
      </div>
    </>
  );
}

export default Policy
