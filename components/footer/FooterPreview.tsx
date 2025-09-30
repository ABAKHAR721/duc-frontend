'use client';

import React from 'react';
import { Phone, Clock, MapPin, Facebook, Instagram, Linkedin, Mail, Bike } from 'lucide-react';

const FooterPreview: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Business Info & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src="/logo-without-bg.png"
                  alt="Le Duc Pizzeria Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Le Duc Pizzeria</h3>
                <p className="text-primary text-xs font-light">Pizza Artisanale</p>
              </div>
            </div>

            <p className="text-white/90 text-sm font-light leading-relaxed">
              Pâte à pizza faite à maison • Produits choisis avec noblesse
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">
              Contact
            </h4>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href="tel:+33123456789"
                  className="text-white/90 hover:text-white transition-colors text-sm"
                >
                  +33 1 23 45 67 89
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a
                  href="mailto:contact@leduc-pizzeria.fr"
                  className="text-white/90 hover:text-white transition-colors text-sm"
                >
                  contact@leduc-pizzeria.fr
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <p className="text-white/90 text-sm">123 Rue de la Pizza, Langon</p>
              </div>
            </div>
          </div>

          {/* Opening Hours & Social Links */}
          <div className="space-y-4">
            {/* Opening Hours */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">
                Horaires
              </h4>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <p className="text-white/90 text-sm">
                  11h00 - 13h30 • 18h00 - 21h30
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">
                Suivez-nous
              </h4>

              <div className="flex gap-2">
                <a
                  href="#"
                  className="w-8 h-8 bg-white/10 hover:bg-primary rounded flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </a>

                <a
                  href="#"
                  className="w-8 h-8 bg-white/10 hover:bg-primary rounded flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>

                <a
                  href="#"
                  className="w-8 h-8 bg-white/10 hover:bg-primary rounded flex items-center justify-center transition-colors"
                >
                  <Bike className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-white/50 text-xs">
              © 2024 Le Duc Pizzeria. Tous droits réservés.
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

export default FooterPreview;