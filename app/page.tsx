import Header from '@/components/Header/Header';
import HomeSlider from '@/components/Home-Slider/HomeSlider';
import Annonce from '@/components/Header/Annonce';
import PizzaMoment from '@/components/pizza-moment/PizzaMoment';
import EventsPromo from '@/components/events-promo/EventsPromo';
import Footer from '@/components/footer/Footer';
import FooterPreview from '@/components/footer/FooterPreview';

export default function Home() {
  return ( 
    
    <main>
      <Header />
      <HomeSlider />
      <Annonce />
      <PizzaMoment />
      <EventsPromo />
      <Footer />
    </main>
  );
}