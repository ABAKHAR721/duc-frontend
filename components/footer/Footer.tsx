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
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-32"></div>
                <div className="h-3 bg-white/10 rounded w-40"></div>
                <div className="h-3 bg-white/10 rounded w-36"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-20"></div>
                <div className="h-3 bg-white/10 rounded w-32"></div>
                <div className="h-3 bg-white/10 rounded w-28"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-24"></div>
                <div className="h-3 bg-white/10 rounded w-36"></div>
                <div className="flex gap-2 mt-3">
                  <div className="w-8 h-8 bg-white/10 rounded"></div>
                  <div className="w-8 h-8 bg-white/10 rounded"></div>
                  <div className="w-8 h-8 bg-white/10 rounded"></div>
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
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-white/50 text-sm">Informations de l&apos;entreprise non disponibles</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Business Info & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {businessData.logoUrl && (
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={businessData.logoUrl}
                    alt={`${businessData.name} Logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-white">{businessData.name}</h3>
                {businessData.slogan && (
                  <p className="text-primary text-xs font-light">{businessData.slogan}</p>
                )}
              </div>
            </div>

            {businessData.description && (
              <p className="text-white/90 text-sm font-light leading-relaxed">{businessData.description}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">
              Contact
            </h4>

            <div className="space-y-3">
              {businessData.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <a
                    href={`tel:${businessData.phone}`}
                    className="text-white/90 hover:text-white transition-colors text-sm"
                  >
                    {businessData.phone}
                  </a>
                </div>
              )}

              {businessData.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a
                    href={`mailto:${businessData.email}`}
                    className="text-white/90 hover:text-white transition-colors text-sm"
                  >
                    {businessData.email}
                  </a>
                </div>
              )}

              {businessData.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="text-white/90 text-sm">{businessData.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Opening Hours & Social Links */}
          <div className="space-y-4">
            {/* Opening Hours */}
            {businessData.hours && (
              <div>
                <h4 className="text-sm font-medium text-white mb-3">
                  Horaires
                </h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <p className="text-white/90 text-sm">
                    {formatOpeningHours(businessData.hours)}
                  </p>
                </div>
              </div>
            )}

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">
                Suivez-nous
              </h4>

              <div className="flex gap-2">
                {businessData.urlFacebook && (
                  <a
                    href={businessData.urlFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/10 hover:bg-primary rounded flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-white" />
                  </a>
                )}

                {businessData.urlInstagram && (
                  <a
                    href={businessData.urlInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/10 hover:bg-primary rounded flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                )}

                {businessData.urlLinkedin && (
                  <a
                    href={businessData.urlLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/10 hover:bg-primary rounded flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                )}

                {businessData.uberEatsUrl && (
                  <a
                    href={businessData.uberEatsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/10 hover:bg-primary rounded flex items-center justify-center transition-colors"
                  >
                    <Bike className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} {businessData.name}. Tous droits réservés.
            </p>
            <p className="text-white text-xs">
              Réalisé par{' '}
              <a
                href="https://digitgrow.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Digitgrow
              </a>
            </p>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <a href="/privacy" className="hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Conditions d&apos;utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
