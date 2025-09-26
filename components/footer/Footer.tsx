'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Clock, MapPin, Facebook, Instagram, Linkedin, Mail, Bike } from 'lucide-react';
import { businessService, BusinessData } from '@/services/businessService';
import Image from 'next/image';

const Footer: React.FC = () => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const data = await businessService.getAll();
        // Assuming we get the first business or you can modify to get by ID
        if (data && data.length > 0) {
          setBusinessData(data[0]);
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  const parseOpeningHours = (hours: string) => {
    if (!hours) return null;
    
    try {
      // Try to parse if it's JSON format
      const parsed = JSON.parse(hours);
      return parsed;
    } catch {
      // If not JSON, return as string
      return hours;
    }
  };

  const formatOpeningHours = (hours: string) => {
    const parsed = parseOpeningHours(hours);
    
    if (typeof parsed === 'string') {
      return parsed;
    }
    
    if (typeof parsed === 'object' && parsed !== null) {
      // Format object hours (e.g., {monday: "9:00-18:00", tuesday: "9:00-18:00"})
      return Object.entries(parsed)
        .map(([day, time]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}`)
        .join(', ');
    }
    
    return 'Horaires disponibles sur demande';
  };

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-32"></div>
                <div className="h-4 bg-gray-700 rounded w-40"></div>
                <div className="h-4 bg-gray-700 rounded w-36"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-28"></div>
                <div className="h-4 bg-gray-700 rounded w-44"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-36"></div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (!businessData) {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">Informations de l'entreprise non disponibles</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Business Info & Logo */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {businessData.logoUrl && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={businessData.logoUrl}
                    alt={`${businessData.name} Logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-white">{businessData.name}</h3>
                {businessData.slogan && (
                  <p className="text-orange-400 text-sm font-medium mt-1">{businessData.slogan}</p>
                )}
              </div>
            </div>
            
            {businessData.description && (
              <p className="text-gray-300 leading-relaxed">{businessData.description}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-orange-500 pb-2 inline-block">
              Informations de Contact
            </h4>
            
            <div className="space-y-4">
              {businessData.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Téléphone</p>
                    <a 
                      href={`tel:${businessData.phone}`}
                      className="text-white hover:text-orange-400 transition-colors font-medium"
                    >
                      {businessData.phone}
                    </a>
                  </div>
                </div>
              )}

              {businessData.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <a 
                      href={`mailto:${businessData.email}`}
                      className="text-white hover:text-orange-400 transition-colors font-medium"
                    >
                      {businessData.email}
                    </a>
                  </div>
                </div>
              )}

              {businessData.address && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Adresse</p>
                    <p className="text-white font-medium">{businessData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Opening Hours & Social Links */}
          <div className="space-y-6">
            {/* Opening Hours */}
            {businessData.hours && (
              <div>
                <h4 className="text-lg font-semibold text-white border-b border-orange-500 pb-2 mb-4 inline-block">
                  Horaires d'Ouverture
                </h4>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white leading-relaxed">
                      {formatOpeningHours(businessData.hours)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Links & Delivery */}
            <div>
              <h4 className="text-lg font-semibold text-white border-b border-orange-500 pb-2 mb-4 inline-block">
                Suivez-nous
              </h4>
              
              <div className="flex flex-wrap gap-3">
                {businessData.urlFacebook && (
                  <a
                    href={businessData.urlFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-white" />
                  </a>
                )}
                
                {businessData.urlInstagram && (
                  <a
                    href={businessData.urlInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                )}
                
                {businessData.urlLinkedin && (
                  <a
                    href={businessData.urlLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                )}
                
                {businessData.uberEatsUrl && (
                  <a
                    href={businessData.uberEatsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    <Bike className="w-6 h-6 text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {businessData.name}. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
