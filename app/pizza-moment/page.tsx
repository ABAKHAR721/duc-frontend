import { PizzaMoment } from '@/components/pizza-moment';

export default function PizzaMomentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto">
        <PizzaMoment />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Pizza du Moment - Duc Restaurant',
  description: 'Découvrez notre sélection exclusive de pizzas artisanales du moment',
};
