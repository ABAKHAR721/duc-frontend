'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Calendar, Clock, Gift, Eye, Timer, Tag, Phone, Bike } from 'lucide-react';
import { eventsService, EventData } from '@/services/eventsService';
import EventModal from './EventModal';
import styles from './EventsPromo.module.css';

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
  const [isUberEatsOpen, setIsUberEatsOpen] = useState(false);

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
    <div className="relative w-full max-w-7xl mx-auto px-4 py-16 bg-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg text-sm font-semibold mb-6 shadow-lg">
          <Tag className="w-5 h-5" />
          <span className="uppercase tracking-wider">Promotions Actuelles</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Nos Offres du Moment
        </h2>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Découvrez nos promotions exclusives et profitez de nos offres spéciales
        </p>
      </div>

      {/* Main Event Display */}
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
          {/* Event Image Section */}
          <div 
            key={currentIndex} 
            className={`relative ${styles.slideIn}`}
            onMouseEnter={() => setIsEventHovered(true)}
            onMouseLeave={() => setIsEventHovered(false)}
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <img
                key={`${currentIndex}-${currentImageIndex}`}
                src={currentEvent.imageUrl || '/placeholder-event.jpg'}
                alt={currentEvent.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Event Status Badge */}
              {isEventActive(currentEvent) && (
                <div className="absolute top-4 left-4 bg-green-600 rounded-lg px-3 py-1 flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-white font-medium text-sm">Actif</span>
                </div>
              )}

              {/* Countdown Timer */}
              {currentEvent.endDate && timeLeft[currentEvent.id!] && (
                <div className="absolute top-4 right-4 bg-orange-600 rounded-lg px-3 py-1">
                  <div className="flex items-center gap-2 text-white">
                    <Timer className="w-4 h-4" />
                    <div className="flex gap-1 text-sm font-medium">
                      <span>{timeLeft[currentEvent.id!].days}j</span>
                      <span>{timeLeft[currentEvent.id!].hours}h</span>
                      <span>{timeLeft[currentEvent.id!].minutes}m</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Dots */}
            {events.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setCurrentImageIndex(0);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-orange-500 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Event Details Section */}
          <div className="space-y-6 text-gray-800">
            {/* Event Category */}
            <div className="inline-flex items-center gap-2 bg-orange-100 rounded-lg px-4 py-2 border border-orange-200">
              <Gift className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 font-medium text-sm uppercase tracking-wider">
                {currentEvent.eventType || 'Promotion'}
              </span>
            </div>

            {/* Event Title */}
            <h3 className="text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
              {currentEvent.name}
            </h3>

            {/* Event Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              {currentEvent.description || "Une offre exceptionnelle vous attend ! Profitez de cette promotion exclusive pour découvrir nos spécialités à prix réduit."}
            </p>

            {/* Event Dates */}
            <div className="flex flex-wrap gap-4">
              {currentEvent.startDate && (
                <div className="flex items-center gap-2 bg-green-50 rounded-lg px-4 py-2 border border-green-200">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Début: {formatDate(currentEvent.startDate)}
                  </span>
                </div>
              )}
              {currentEvent.endDate && (
                <div className="flex items-center gap-2 bg-red-50 rounded-lg px-4 py-2 border border-red-200">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">
                    Fin: {formatDate(currentEvent.endDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => openModal(currentEvent)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                <Eye className="w-5 h-5" />
                Voir les détails
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-300 text-sm md:text-base"
                >
                  <Gift className="w-5 h-5" />
                  Profiter de l'offre
                </button>
                {isSubMenuOpen && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-lg shadow-xl z-20 overflow-hidden border border-gray-200 min-w-[250px]">
                    <div className={`transition-transform duration-300 ease-in-out ${isUberEatsOpen ? '-translate-x-full' : 'translate-x-0'}`}>
                      <div className="w-full">
                        <a href="tel:+33XXXXXXXXX" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 border-b border-gray-100">
                          <Phone className="w-4 h-4 mr-3" />
                          Commander par Téléphone
                        </a>
                        <button 
                          onClick={() => setIsUberEatsOpen(true)}
                          className="w-full text-left flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-orange-50"
                        >
                          <div className="flex items-center">
                            <Bike className="w-4 h-4 mr-3" />
                            <span>Livraison avec Uber Eats</span>
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-0 left-full w-full bg-white">
                        <button 
                          onClick={() => setIsUberEatsOpen(false)}
                          className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 font-medium border-b border-gray-100"
                        >
                          <ChevronRight className="w-4 h-4 mr-3 transform rotate-180" />
                          Retour
                        </button>
                        <a href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 border-b border-gray-100">UBER EAT PODENSAC</a>
                        <a href="https://www.ubereats.com/fr/store/pizza-le-duc-langon/knYx33kaXLSOSaJVs7XyRg" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50">UBER EAT LANGON</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {events.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center text-gray-700 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center text-gray-700 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
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
