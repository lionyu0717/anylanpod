interface BenefitCardProps {
  title: string;
  description: string;
}

export const BenefitCard = ({ title, description }: BenefitCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
); 