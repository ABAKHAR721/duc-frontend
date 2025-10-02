'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Gift, Eye, Timer, Phone, Bike } from 'lucide-react';
import { SiUbereats } from 'react-icons/si';
import { FiPhone } from 'react-icons/fi';
import { eventsService, EventData } from '@/services/eventsService';
import EventModal from './EventModal';

const EventsPromo: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEventHovered, setIsEventHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{[key: string]: {days: number, hours: number, minutes: number, seconds: number}}>({});
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPromoEvents = async () => {
      try {
        const data = await eventsService.getPromoEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching promotional events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoEvents();
  }, []);

  // Auto-scroll events effect
  useEffect(() => {
    if (events.length <= 1 || isEventHovered) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
      setCurrentImageIndex(0); // Reset image index when changing event
    }, 6000); // Change event every 6 seconds

    return () => clearInterval(interval);
  }, [events.length, isEventHovered]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: {[key: string]: {days: number, hours: number, minutes: number, seconds: number}} = {};
      
      events.forEach(event => {
        if (event.endDate) {
          const now = new Date().getTime();
          const eventEnd = new Date(event.endDate).getTime();
          const difference = eventEnd - now;

          if (difference > 0) {
            newTimeLeft[event.id!] = {
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((difference % (1000 * 60)) / 1000)
            };
          }
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
    setCurrentImageIndex(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setCurrentImageIndex(0);
  };

  const openModal = (event: EventData) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const getCurrentEvent = () => events[currentIndex] || null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isEventActive = (event: EventData) => {
    if (!event.endDate) return true;
    return new Date(event.endDate) > new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucune promotion en cours</h3>
        <p className="text-gray-600">Revenez bientôt pour découvrir nos offres exclusives !</p>
      </div>
    );
  }

  const currentEvent = getCurrentEvent();

  if (!currentEvent) {
    return null;
  }

  return (
    <div style={{ background: 'var(--background)' }} className="py-20">
      <div className="max-w-5xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-16 relative">
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 relative overflow-hidden"
               style={{
                 background: 'linear-gradient(135deg, var(--color-orange-100), var(--color-cream-200))',
                 color: 'var(--color-brown-800)',
                 border: '2px solid var(--color-orange-200)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse"></div>
            <span className="relative z-10 tracking-wide">✨ PROMOTIONS ACTUELLES ✨</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-6xl font-light mb-4 md:mb-6 relative px-4"
              style={{ color: 'var(--foreground)' }}>
            Nos Offres du Moment
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 md:w-24 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
          </h2>

          <p className="text-base md:text-xl max-w-3xl mx-auto font-light leading-relaxed px-4"
             style={{ color: 'var(--muted-foreground)' }}>
            Découvrez nos promotions exclusives et profitez de nos offres spéciales
          </p>
        </div>

        {/* Mobile-First Layout */}
        <div className="block md:hidden">
          {/* Mobile Event Card */}
          <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--background)' }}>
            {/* Mobile Image */}
            <div className="relative aspect-video">
              <img
                key={`${currentIndex}-${currentImageIndex}`}
                src={currentEvent.imageUrl || '/placeholder-event.jpg'}
                alt={currentEvent.name}
                className="w-full h-full object-cover"
              />
              {/* Countdown Timer Badge */}
              {currentEvent.endDate && timeLeft[currentEvent.id!] && (
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg">
                  <div className="flex items-center gap-1 text-orange-600">
                    <Timer className="w-3 h-3" />
                    <div className="flex gap-1 text-xs font-medium">
                      <span>{timeLeft[currentEvent.id!].days}j</span>
                      <span>{timeLeft[currentEvent.id!].hours}h</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Content */}
            <div className="p-4 space-y-4">
              {/* Title */}
              <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--foreground)' }}>
                {currentEvent.name}
              </h1>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {currentEvent.description || "Une offre exceptionnelle vous attend ! Profitez de cette promotion exclusive."}
              </p>

              {/* Dates */}
              <div className="space-y-2">
                {currentEvent.startDate && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    <Calendar className="w-4 h-4" style={{ color: 'var(--color-green-600)' }} />
                    <span>Début: {formatDate(currentEvent.startDate)}</span>
                  </div>
                )}
                {currentEvent.endDate && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    <Clock className="w-4 h-4" style={{ color: 'var(--color-red-600)' }} />
                    <span>Fin: {formatDate(currentEvent.endDate)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => openModal(currentEvent)}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 text-white"
                  style={{ background: 'var(--primary)' }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir les détails</span>
                </button>
                
                <button
                  onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 border"
                  style={{ 
                    backgroundColor: 'var(--muted)', 
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <Gift className="w-4 h-4" />
                  <span>Profiter de l'offre</span>
                </button>

                {/* Mobile Order Menu */}
                {isSubMenuOpen && (
                  <div className="rounded-lg overflow-hidden border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                    <a 
                      href="tel:+33XXXXXXXXX" 
                      className="flex items-center bg-orange-500 hover:bg-orange-600 px-4 py-3 text-sm border-b hover:opacity-80 transition-opacity text-white rounded-lg mb-2"
                    >
                      <FiPhone className="w-4 h-4 mr-3" />
                      Commander par Téléphone
                    </a>
                    <a 
                      href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 hover:bg-green-600 text-left flex items-center justify-center px-4 py-3 text-sm hover:opacity-80 transition-opacity text-white rounded-lg"
                    >
                      <div className="flex items-center">
                        <SiUbereats className="w-4 h-4 mr-3" />
                        <span>Livraison Uber Eats</span>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div
            className="relative rounded-3xl overflow-hidden transition-all duration-300"
            onMouseEnter={() => setIsEventHovered(true)}
            onMouseLeave={() => setIsEventHovered(false)}
          >
            {/* Background Image */}
            <div className="relative min-h-[500px] lg:min-h-[600px] overflow-hidden">
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out"
                style={{
                  transform: isEventHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <img
                  key={`${currentIndex}-${currentImageIndex}`}
                  src={currentEvent.imageUrl || '/placeholder-event.jpg'}
                  alt={currentEvent.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dynamic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

              {/* Countdown Timer Badge */}
              {currentEvent.endDate && timeLeft[currentEvent.id!] && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg z-10">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Timer className="w-4 h-4" />
                    <div className="flex gap-1 text-sm font-medium">
                      <span>{timeLeft[currentEvent.id!].days}j</span>
                      <span>{timeLeft[currentEvent.id!].hours}h</span>
                      <span>{timeLeft[currentEvent.id!].minutes}m</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-end">
                <div className="w-full p-8 lg:p-12">
                  <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-end">

                      {/* Left Side - Main Info */}
                      <div className="space-y-6">
                        {/* Title */}
                        <div>
                          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-4 leading-tight drop-shadow-lg">
                            {currentEvent.name}
                          </h1>
                          <p className="text-sm md:text-base text-white/95 leading-relaxed max-w-md drop-shadow-md">
                            {currentEvent.description || "Une offre exceptionnelle vous attend ! Profitez de cette promotion exclusive pour découvrir nos spécialités à prix réduit."}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 md:gap-6">
                          {currentEvent.startDate && (
                            <div className="flex items-center gap-2 text-white/90 drop-shadow-md">
                              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                              <span className="text-sm md:text-base font-medium">
                                Jusqu'au {formatDate(currentEvent.endDate || currentEvent.startDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Action Section */}
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="space-y-4">
                          {/* Event Dates */}
                          {(currentEvent.startDate || currentEvent.endDate) && (
                            <div>
                              <label className="text-white text-sm font-semibold mb-4 block">
                                Période de validité
                              </label>
                              <div className="space-y-2">
                                {currentEvent.startDate && (
                                  <div className="flex items-center gap-2 text-white/90">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">Début: {formatDate(currentEvent.startDate)}</span>
                                  </div>
                                )}
                                {currentEvent.endDate && (
                                  <div className="flex items-center gap-2 text-white/90">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">Fin: {formatDate(currentEvent.endDate)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => openModal(currentEvent)}
                              className="flex-1 py-3 px-5 rounded-xl font-semibold transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 text-white text-base shadow-lg"
                              style={{ background: 'var(--primary)' }}
                            >
                              <Eye className="w-5 h-5" />
                              <span>Voir détails</span>
                            </button>
                          </div>

                          {/* Order Options */}
                          <div className="relative">
                            <button
                              onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                              className="w-full py-3 px-5 rounded-xl font-semibold transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-base"
                            >
                              <Gift className="w-5 h-5" />
                              <span>Profiter de l'offre</span>
                            </button>
                            {isSubMenuOpen && (
                              <div className="absolute bottom-full mb-2 left-0 right-0  rounded-lg shadow-xl z-20 overflow-hidden border border-gray-200 min-w-[250px]">
                                <div className="transition-transform duration-300 ease-in-out">
                                  <div className="w-full">
                                    <a 
                                      href="tel:+33XXXXXXXXX"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full bg-orange-500 hover:bg-orange-600 text-left flex items-center justify-center px-4 py-3 text-sm text-white hover:bg-gray-800"
                                    >
                                      <div className="flex items-center">
                                        <FiPhone className="w-4 h-4 mr-3" />
                                        <span>Commander par Téléphone</span>
                                      </div>
                                    </a>

                                    <a 
                                      href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full bg-green-500 hover:bg-green-600 text-left flex items-center justify-center px-4 py-3 text-sm text-white hover:bg-gray-800"
                                    >
                                      <div className="flex items-center">
                                        <SiUbereats className="w-5 h-5 mr-3" />
                                        <span>Livraison avec Uber Eats</span>
                                      </div>
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

        {/* Navigation Dots for multiple events */}
        {events.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setCurrentImageIndex(0);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default EventsPromo;
