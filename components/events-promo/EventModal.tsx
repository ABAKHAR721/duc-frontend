'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, Clock, Gift, Star, MapPin, Users, Phone, Bike, ChevronRight, Timer } from 'lucide-react';
import { EventData } from '@/services/eventsService';

interface EventModalProps {
  event: EventData;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isUberEatsOpen, setIsUberEatsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSubMenuOpen(false);
        setIsUberEatsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!event.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventEnd = new Date(event.endDate!).getTime();
      const difference = eventEnd - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event.endDate]);

  const handleUberEatsClick = () => {
    setIsUberEatsOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventActive = () => {
    if (!event.endDate) return true;
    return new Date(event.endDate) > new Date();
  };

  // Early return if event is not available
  if (!event || !isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-white border-b border-gray-200 p-4 md:p-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6 pr-12">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-100 rounded-xl flex items-center justify-center border border-orange-200 flex-shrink-0">
              <Gift className="w-6 h-6 md:w-7 md:h-7 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                <span className="text-xs md:text-sm font-medium bg-orange-100 text-orange-700 px-2 md:px-3 py-1 rounded-lg border border-orange-200">
                  {event.eventType || 'Promotion'}
                </span>
                {isEventActive() && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs font-medium">Actif</span>
                  </div>
                )}
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{event?.name || 'Événement'}</h2>
            </div>
          </div>

          {/* Countdown Timer */}
          {timeLeft && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-gray-800">Temps restant</span>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                <div className="bg-white rounded-lg p-2 md:p-3 text-center border border-gray-200">
                  <div className="text-lg md:text-2xl font-bold text-gray-900">{timeLeft.days}</div>
                  <div className="text-xs text-gray-600 font-medium">Jours</div>
                </div>
                <div className="bg-white rounded-lg p-2 md:p-3 text-center border border-gray-200">
                  <div className="text-lg md:text-2xl font-bold text-gray-900">{timeLeft.hours}</div>
                  <div className="text-xs text-gray-600 font-medium">Heures</div>
                </div>
                <div className="bg-white rounded-lg p-2 md:p-3 text-center border border-gray-200">
                  <div className="text-lg md:text-2xl font-bold text-gray-900">{timeLeft.minutes}</div>
                  <div className="text-xs text-gray-600 font-medium">Minutes</div>
                </div>
                <div className="bg-white rounded-lg p-2 md:p-3 text-center border border-gray-200">
                  <div className="text-lg md:text-2xl font-bold text-gray-900">{timeLeft.seconds}</div>
                  <div className="text-xs text-gray-600 font-medium">Secondes</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 space-y-6 md:space-y-8">
            {/* Event Image */}
            {event.imageUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <img
                  src={event.imageUrl}
                  alt={event?.name || 'Événement'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Event Details */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-600" />
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {event?.description || "Une promotion exceptionnelle vous attend ! Découvrez cette offre exclusive et profitez de conditions avantageuses pour savourer nos spécialités. Ne manquez pas cette opportunité limitée dans le temps."}
                  </p>
                </div>

                {/* Event Dates */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Dates de l'événement
                  </h3>
                  <div className="space-y-3">
                    {event.startDate && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div>
                          <div className="font-medium text-green-800">Début</div>
                          <div className="text-sm text-green-600">{formatDate(event.startDate)}</div>
                        </div>
                      </div>
                    )}
                    {event.endDate && (
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <div>
                          <div className="font-medium text-red-800">Fin</div>
                          <div className="text-sm text-red-600">{formatDate(event.endDate)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Event Status */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Statut
                  </h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                    event.status === 'Active' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      event.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                    {event.status || 'Actif'}
                  </div>
                </div>

                {/* Location Info */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    Où profiter de cette offre
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Dans nos restaurants</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>Par téléphone</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bike className="w-4 h-4" />
                      <span>En livraison</span>
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-600" />
                    Profiter de l'offre
                  </h3>
                  
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 md:py-4 rounded-lg font-bold uppercase shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm md:text-base"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <Gift className="w-5 h-5" />
                        <span>Commander maintenant</span>
                      </span>
                    </button>
                    {isSubMenuOpen && (
                      <div
                        className={`absolute bottom-full mb-2 left-0 right-0 w-full bg-white rounded-md shadow-xl z-20 overflow-hidden border border-gray-200 ${
                          isUberEatsOpen ? 'min-h-[110px]' : 'min-h-[77px]'
                        }`}
                      >
                        <div className={`transition-transform duration-300 ease-in-out ${isUberEatsOpen ? '-translate-x-full' : 'translate-x-0'}`}>
                          <div className="w-full flex-shrink-0" style={{ width: '100%' }}>
                            <a href="tel:+33XXXXXXXXX" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                              <Phone className="w-4 h-4 mr-2" />
                              Commander par Téléphone
                            </a>
                            <button 
                              onClick={handleUberEatsClick}
                              className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                            >
                              <div className="flex items-center">
                                <Bike className="w-4 h-4 mr-2" />
                                <span>Livraison avec Uber Eats</span>
                              </div>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute top-0 left-full w-full bg-white">
                            <button 
                              onClick={() => setIsUberEatsOpen(false)}
                              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 font-bold"
                            >
                              <ChevronRight className="w-4 h-4 mr-2 transform rotate-180" />
                              Retour
                            </button>
                            <a href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">UBER EAT PODENSAC</a>
                            <a href="https://www.ubereats.com/fr/store/pizza-le-duc-langon/knYx33kaXLSOSaJVs7XyRg" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">UBER EAT LANGON</a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
