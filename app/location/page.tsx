'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Clock, Phone } from 'lucide-react';
import Header from '@/components/Header/Header';
import MobileBottomNav from '@/components/Header/MobileBottomNav';
import { Footer } from '@/components/footer';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 rounded-2xl flex items-center justify-center">
      <div className="text-gray-500">Chargement de la carte...</div>
    </div>
  ),
});


// --- Component Data ---
// Storing data in a structured way makes the component cleaner and easier to update.
const locationData = {
  coordinates: {
    lat: 44.6556021,
    lng: -0.3648379,
  },
  address: [
    "Parking Centre commercial Super U Podensac",
    "Face Crédit Agricole",
    "Route nationale 113",
    "33720, Podensac, France",
  ],
  openingHours: [
    { day: "Ouvert 7jours/7", hours: "" },
    { day: "Le midi", hours: "11h00 à 13h30" },
    { day: "Le soir", hours: "18h00 à 21h30" },
  ],
  phoneNumbers: [
    { location: "Podensac", number: "05 56 27 47 35" },
    // { location: "Langon", number: "06 61 30 30 12" },
  ],
};


// --- The Page Component ---
const ContactAndLocationPage = () => {

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Navigation */}
      <Header variant="solid" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 tracking-tight sm:text-5xl">
            Où manger chez Pizza LE DUC ?
          </h1>
          <div className="mt-8">
            <a 
              href="/notre-carte" 
              className="inline-block bg-orange-600 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-orange-700 transition-transform transform hover:scale-105 shadow-lg"
            >
              JE COMMANDE UNE PIZZA
            </a>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left Column: Information */}
          <div className="lg:col-span-2 space-y-10">
            {/* Address Block */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <MapPin className="h-7 w-7 text-orange-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">Notre Adresse</h2>
                <div className="mt-2 text-base text-gray-600">
                  {locationData.address.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Opening Hours Block */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-7 w-7 text-orange-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">Heures d'Ouverture</h2>
                <div className="mt-2 space-y-1 text-base text-gray-600">
                  {locationData.openingHours.map((item, index) => (
                    <p key={index}>
                      <span className="font-medium text-gray-800">{item.day}</span>
                      {item.hours && `: ${item.hours}`}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Block */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Phone className="h-7 w-7 text-orange-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">Pour Commander</h2>
                <div className="mt-2 space-y-2 text-base">
                  {locationData.phoneNumbers.map((phone, index) => (
                    <p key={index}>
                      <span className="font-medium text-gray-800">{phone.location}:</span>
                      <a 
                        href={`tel:${phone.number.replace(/\s/g, '')}`} 
                        className="ml-2 text-orange-700 hover:text-orange-900 hover:underline transition-colors"
                      >
                        {phone.number}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="lg:col-span-3 h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <MapComponent 
              coordinates={locationData.coordinates}
              address={locationData.address}
            />
          </div>

         <MobileBottomNav/>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default ContactAndLocationPage;