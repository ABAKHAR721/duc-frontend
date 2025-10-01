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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{ background: 'var(--background)' }}
      >
        {/* Header */}
        <div className="relative p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: 'var(--muted)', 
              color: 'var(--foreground)'
            }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl">
            <h2 className="text-3xl font-light mb-2" style={{ color: 'var(--foreground)' }}>
              {event?.name || 'Événement'}
            </h2>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Promotion spéciale</span>
              </div>
              {isEventActive() && (
                <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--color-green-100)', color: 'var(--color-green-800)' }}>
                  🎯 Actif
                </span>
              )}
            </div>
          </div>

          {/* Countdown Timer */}
          {timeLeft && (
            <div className="mt-6 rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Timer className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Temps restant</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{timeLeft.days}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Jours</div>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{timeLeft.hours}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Heures</div>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{timeLeft.minutes}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Minutes</div>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{timeLeft.seconds}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Secondes</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={event.imageUrl || '/placeholder-event.jpg'}
                    alt={event?.name || 'Événement'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  
                  {/* Event Status Badge */}
                  {isEventActive() && (
                    <div className="absolute top-4 right-4 backdrop-blur-sm rounded-full p-2" style={{ backgroundColor: 'var(--background)' }}>
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-green-600)' }}>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Actif</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                    Description
                  </h3>
                  <p className="leading-relaxed text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {event?.description || "Une promotion exceptionnelle vous attend ! Découvrez cette offre exclusive et profitez de conditions avantageuses pour savourer nos spécialités. Ne manquez pas cette opportunité limitée dans le temps."}
                  </p>
                </div>

                {/* Event Dates */}
                <div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                    Période de validité
                  </h3>
                  <div className="space-y-2">
                    {event.startDate && (
                      <button className="w-full p-4 rounded-xl border transition-all text-left border-green-200" style={{ backgroundColor: 'var(--color-green-50)' }}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium" style={{ color: 'var(--color-green-800)' }}>
                              Début de l'offre
                            </div>
                            <div className="text-sm" style={{ color: 'var(--color-green-600)' }}>
                              {formatDate(event.startDate)}
                            </div>
                          </div>
                          <Calendar className="w-5 h-5" style={{ color: 'var(--color-green-600)' }} />
                        </div>
                      </button>
                    )}
                    {event.endDate && (
                      <button className="w-full p-4 rounded-xl border transition-all text-left border-red-200" style={{ backgroundColor: 'var(--color-red-50)' }}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium" style={{ color: 'var(--color-red-800)' }}>
                              Fin de l'offre
                            </div>
                            <div className="text-sm" style={{ color: 'var(--color-red-600)' }}>
                              {formatDate(event.endDate)}
                            </div>
                          </div>
                          <Clock className="w-5 h-5" style={{ color: 'var(--color-red-600)' }} />
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Event Type & Status */}
                {(event.eventType || event.status) && (
                  <div>
                    <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--foreground)' }}>Informations détaillées</h3>
                    <div className="space-y-4">
                      {event.eventType && (
                        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--muted)' }}>
                          <h4 className="font-medium mb-2 capitalize flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                            <Gift className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                            Type d'événement
                          </h4>
                          <span
                            className="px-3 py-1 rounded-full text-xs border"
                            style={{
                              backgroundColor: 'var(--background)',
                              color: 'var(--muted-foreground)',
                              borderColor: 'var(--border)'
                            }}
                          >
                            {event.eventType}
                          </span>
                        </div>
                      )}
                      
                      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--muted)' }}>
                        <h4 className="font-medium mb-2 capitalize flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                          <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                          Disponibilité
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: 'var(--background)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                            🏪 En restaurant
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: 'var(--background)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                            📞 Par téléphone
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: 'var(--background)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                            🚴 En livraison
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Section */}
                <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)' }}>
                    <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                      Profiter de cette offre
                    </h3>

                    <div className="relative" ref={menuRef}>
                      <div className="space-y-2 transition-all duration-300 ease-in-out">
                        {!isSubMenuOpen ? (
                          <button
                            onClick={() => setIsSubMenuOpen(true)}
                            className="w-full py-3 px-4 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2 text-white"
                            style={{ background: 'var(--primary)' }}
                          >
                            <span>Commander maintenant</span>
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <a
                              href="tel:+33XXXXXXXXX"
                              className="w-full py-3 px-4 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2 text-white"
                              style={{ background: 'var(--primary)' }}
                            >
                              <Phone className="w-4 h-4" />
                              <span>Appeler</span>
                            </a>
                            <button
                              onClick={() => setIsUberEatsOpen(!isUberEatsOpen)}
                              className="w-full py-3 px-4 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2 text-white"
                              style={{ background: 'var(--primary)' }}
                            >
                              <Bike className="w-4 h-4" />
                              <span>Uber Eats</span>
                              <ChevronRight
                                className={`w-4 h-4 transition-transform duration-200 ${isUberEatsOpen ? 'rotate-90' : ''}`}
                              />
                            </button>

                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isUberEatsOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <div className="space-y-1 pt-1">
                                <a
                                  href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full py-2 px-4 text-sm rounded-lg transition-colors hover:opacity-80"
                                  style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}
                                >
                                  📍 PODENSAC
                                </a>
                                <a
                                  href="https://www.ubereats.com/fr/store/pizza-le-duc-langon/knYx33kaXLSOSaJVs7XyRg"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full py-2 px-4 text-sm rounded-lg transition-colors hover:opacity-80"
                                  style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}
                                >
                                  📍 LANGON
                                </a>
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
      </div>
    </div>
  );
};

export default EventModal;
