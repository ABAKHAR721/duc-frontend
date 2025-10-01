"use client";

import React, { useState, useEffect } from 'react';
import { eventsService } from '@/services/eventsService';

const Annonce = () => {
    const [annonces, setAnnonces] = useState<{ description: string }[]>([]);
    const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const headerAnnonces = await eventsService.getAllHeader();
        setAnnonces(headerAnnonces);
        setAnimationKey(prevKey => prevKey + 1);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        const fallbackAnnonces = [
          { description: "Offre spéciale : -20% sur toutes les commandes de plus de 30€ ce week-end" },
          { description: "Nouvelle pizza du mois : La Forestière avec sa crème de cèpes" },
          { description: "Fermeture exceptionnelle le 25 Décembre" },
          { description: "Livraison désormais disponible à Podensac" }
        ];
        setAnnonces(fallbackAnnonces);
        setAnimationKey(prevKey => prevKey + 1);
      }
    };

    fetchAnnonces();
  }, []);

    const scrollingText = annonces.length > 0 ? annonces.map((annonce) => annonce.description).join('   •   ') : '';

  return (
    <div className="py-3 overflow-hidden" style={{ backgroundColor: '#f09e11', color: 'white' }}>
      {scrollingText && (
        <div className="duc-marquee-track" key={animationKey}>
          <span className="font-bold text-sm mx-8">{scrollingText}</span>
          <span className="font-bold text-sm mx-8" aria-hidden="true">{scrollingText}</span>
          <span className="font-bold text-sm mx-8" aria-hidden="true">{scrollingText}</span>
          <span className="font-bold text-sm mx-8" aria-hidden="true">{scrollingText}</span>
        </div>
      )}
      <style jsx global>{`
        @keyframes duc-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .duc-marquee-track {
          display: inline-flex;
          white-space: nowrap;
          animation: duc-marquee 20s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default Annonce;