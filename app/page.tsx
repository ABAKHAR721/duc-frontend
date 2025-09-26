import Header from '@/components/Header/Header';
import HomeSlider from '@/components/Home-Slider/HomeSlider';
import PizzaMoment from '@/components/pizza-moment/PizzaMoment';

export default function Home() {
  return ( 
    
    <main>
      {/* Set showAnnonce to true or false depending on your needs */}
      <Header showAnnonce={true} />
      <HomeSlider /> 
      <PizzaMoment />
      
    </main>
  );
}