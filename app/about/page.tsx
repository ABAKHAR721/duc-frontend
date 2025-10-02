// /app/notre-histoire/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Flame, Users } from 'lucide-react';
import Header from '@/components/Header/Header';
import MobileBottomNav from '@/components/Header/MobileBottomNav';
import { Footer } from '@/components/footer';

// --- Page Component ---
const NotreHistoirePage = () => {
  return (
    <div className="bg-white">
      <Header variant="solid" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-800 tracking-tight sm:text-5xl">
            Notre Histoire
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500">
            La passion de la pizza, une tradition de goût au cœur de Podensac.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="space-y-20">

          {/* Image & Introduction Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p>
                L'histoire de <strong>Pizza Le Duc</strong> n'est pas seulement celle d'une pizzeria, 
                mais celle d'une passion transmise pour la cuisine authentique. Née au cœur 
                de Podensac, notre ambition a toujours été simple : créer des pizzas 
                mémorables en mariant le meilleur du savoir-faire italien et la richesse 
                des produits de notre région.
              </p>
              <p>
                Chaque pizza qui sort de notre four est le reflet de nos engagements : 
                le respect du produit, l'amour du travail bien fait et le plaisir de partager.
              </p>
            </div>
            <div className="h-80 w-full rounded-2xl overflow-hidden shadow-xl bg-black">
            <Image
                src="/patte.png"
                alt="Préparation artisanale de pizza"
                width={800}
                height={400}
                className="w-full h-full object-contain" 
            />
            </div>
          </div>

          {/* Our Commitments Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-800">Nos Engagements</h2>
              <p className="mt-2 max-w-2xl mx-auto text-md text-gray-500">
                Trois piliers qui définissent chaque pizza que nous créons.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Commitment 1: Quality Ingredients */}
              <div className="text-center p-6 border border-gray-100 rounded-xl shadow-sm">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingrédients de Qualité</h3>
                <p className="text-gray-600">
                  Une sélection rigoureuse de produits frais, locaux et d'appellations italiennes 
                  protégées pour un goût incomparable.
                </p>
              </div>
              {/* Commitment 2: Artisanal Know-How */}
              <div className="text-center p-6 border border-gray-100 rounded-xl shadow-sm">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flame className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Savoir-faire Artisanal</h3>
                <p className="text-gray-600">
                  Notre pâte mature lentement pendant 48h, garantissant une texture légère et une 
                  digestibilité parfaite.
                </p>
              </div>
              {/* Commitment 3: Local Connection */}
              <div className="text-center p-6 border border-gray-100 rounded-xl shadow-sm">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ancrage Local</h3>
                <p className="text-gray-600">
                  Fiers de notre communauté, nous sommes plus qu'une pizzeria : un lieu de vie et 
                  de partage pour les habitants de Podensac et ses environs.
                </p>
              </div>
            </div>
          </div>
          
        {/* Call to Action Section - MODIFIED FOR RESPONSIVENESS */}
        <div className="text-center bg-gray-50 p-10 rounded-2xl">
        <h2 className="text-3xl font-light text-gray-800 mb-4">
            Goûtez la différence
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            Notre histoire se raconte le mieux une part de pizza à la main. Découvrez nos créations et laissez-vous convaincre.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
            href="/menu" 
            className="w-full sm:w-auto text-center bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-orange-700 transition-colors duration-200"
            >
            Voir notre carte
            </Link>
            <Link 
            href="/nous-trouver"
            className="w-full sm:w-auto text-center bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
            >
            Nous contacter
            </Link>
        </div>
        </div>

        </div>
        <MobileBottomNav />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default NotreHistoirePage;