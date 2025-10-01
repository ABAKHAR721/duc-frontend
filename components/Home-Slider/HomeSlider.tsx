"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { FiChevronLeft, FiChevronRight, FiPhone } from "react-icons/fi"
import { SiUbereats } from "react-icons/si"

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      image: "/artisan-pizza-oven-with-flames-and-fresh-pizza-2.jpg",
      title: "Pizza Artisanale",
      subtitle: "Pâte à pizza • faite à maison • Produits choisis avec noblesse",
      buttonText: "Découvrir Notre Carte",
      buttonLink: "/menu",
      showHours: true
    },
    {
      id: 2,
      image: "/ubereats.jpeg",
      title: "Livraison à Domicile",
      subtitle: "Commandez vos pizzas préférées avec Uber Eats",
      showButtons: true,
      buttons: [
        { text: "Uber Eats", link: "https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ" }
      ],
      showHours: false
    },
    {
      id: 3,
      image: "/kiosque-pizza.jpg",
      title: "Kiosque de Langon",
      subtitle: "Pizzas à emporter • Commandes sur place",
      buttonText: "Commander",
      buttonLink: "tel:+33123456789",
      buttonIcon: <FiPhone className="w-4 h-4" />,
      showHours: true
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img src={slide.image} alt="Le Duc Pizzeria" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center px-4 max-w-5xl mx-auto">
              {/* Main Heading */}
              <h1 className="font-serif italic text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
                {slide.title}
              </h1>

              {/* Subheading */}
              <p className="text-white/90 text-lg md:text-xl mb-12 font-light tracking-wide">
                {slide.subtitle}
              </p>

              {/* Single Button */}
              {slide.buttonText && (
                <div className="flex items-center justify-center mt-8">
                  <Link
                    href={slide.buttonLink}
                    className={`${slide.buttonLink.startsWith('tel:') ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'} text-white px-6 py-2 rounded text-sm font-light tracking-wide transition-all duration-200 flex items-center gap-2`}
                  >
                    {slide.buttonIcon}
                    {slide.buttonText}
                  </Link>
                </div>
              )}

              {/* Multiple Buttons */}
              {slide.showButtons && slide.buttons && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  {slide.buttons.map((button, btnIndex) => (
                    <Link
                      key={btnIndex}
                      href={button.link}
                      className="bg-black hover:bg-gray-900 text-white px-6 py-2 rounded text-sm font-light tracking-wide transition-all duration-200 flex items-center gap-3"
                    >
                      <SiUbereats className="w-6 h-6" />
                      {button.text}
                    </Link>
                  ))}
                </div>
              )}

              {/* Opening Hours */}
              {slide.showHours && (
                <div className="mt-16">
                  <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-2 font-light">
                    Ouvert 7 Jours Sur 7
                  </p>
                  <p className="text-white text-lg md:text-xl font-light">11h00 - 13h30 • 18h00 - 21h30</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
      >
        <FiChevronLeft className="w-4 h-4 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
      >
        <FiChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider