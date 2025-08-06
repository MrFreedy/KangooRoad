import React from 'react';
import {
  RiSchoolLine,
  RiMapPin2Line,
  RiStarFill,
  RiMailLine,
  RiGraduationCapLine
} from '@remixicon/react';
import './AnnuaireCard.css';

interface AnnuaireCardProps {
  firstname: string;
  lastname: string;
  school: string;
  city: string;
  country: string;
  user_type: string;
  email: string;
}

const AnnuaireCard: React.FC<AnnuaireCardProps> = ({
  firstname,
  lastname,
  school,
  city,
  country,
  user_type,
  email,
}) => {
  return (
    <div className="contact-card max-w-xsm">
      <h2 className="contact-name">{firstname} {lastname}</h2>

      <div className="contact-info mb-10">
        <div className="contact-row">
          <RiSchoolLine className="contact-icon" />
          <span><strong>École :</strong> {school}</span>
        </div>
        <div className="contact-row">
          <RiMapPin2Line className="contact-icon" />
          <span><strong>Lieu :</strong> {city}, {country}</span>
        </div>
        <div className="contact-row">
          <RiGraduationCapLine className="contact-icon" />
          <span><strong>Statut :</strong> {user_type.charAt(0).toUpperCase() + user_type.slice(1)}</span>
        </div>
      </div>

      <a href={`mailto:${email}`} className="contact-btn">
        <span className="contact-btn-content">
          <RiMailLine className="contact-icon-btn" /> Contacter
        </span>
      </a>
    </div>
  );
};

export default AnnuaireCard;