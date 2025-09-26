import Header from '@/components/Header/Header';
import HomeSlider from '@/components/Home-Slider/HomeSlider';
import PizzaMoment from '@/components/pizza-moment/PizzaMoment';
import EventsPromo from '@/components/events-promo/EventsPromo';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return ( 
    
    <main>
      {/* Set showAnnonce to true or false depending on your needs */}
      <Header showAnnonce={true} />
      <HomeSlider /> 
      <PizzaMoment />
      <EventsPromo />
      <Footer />
    </main>
  );
}