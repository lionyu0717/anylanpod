interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export const PricingCard = ({ 
  title, 
  price, 
  features, 
  highlighted = false 
}: PricingCardProps) => (
  <div className={`bg-white p-8 rounded-lg shadow-lg ${highlighted ? 'ring-2 ring-indigo-600 scale-105' : ''}`}>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <div className="text-3xl font-bold mb-6">{price}</div>
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <button className={`w-full py-3 rounded-lg mt-6 font-bold ${
      highlighted 
        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }`}>
      Get Started
    </button>
  </div>
); 