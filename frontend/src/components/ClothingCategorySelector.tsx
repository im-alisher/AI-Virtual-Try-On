import { ClothingCategory } from 'shared';

const CLOTHING_OPTIONS: { value: ClothingCategory; label: string; icon: string }[] = [
  { value: ClothingCategory.SHIRT, label: 'Shirt', icon: '👔' },
  { value: ClothingCategory.TSHIRT, label: 'T-Shirt', icon: '👕' },
  { value: ClothingCategory.HOODIE, label: 'Hoodie', icon: '🧥' },
  { value: ClothingCategory.JACKET, label: 'Jacket', icon: '🧥' },
  { value: ClothingCategory.SUIT, label: 'Suit', icon: '🤵' },
  { value: ClothingCategory.DRESS, label: 'Dress', icon: '👗' },
];

interface Props {
  selected: ClothingCategory | null;
  onSelect: (category: ClothingCategory) => void;
  disabled?: boolean;
}

export default function ClothingCategorySelector({ selected, onSelect, disabled }: Props) {
  return (
    <div className="text-center mb-8">
      <p className="text-sm font-medium text-gray-700 mb-3">Select Clothing Type</p>
      <div className="flex flex-wrap justify-center gap-3">
        {CLOTHING_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${selected === option.value
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="mr-1">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
