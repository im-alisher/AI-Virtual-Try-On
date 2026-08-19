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
    <div className="mb-8">
      <p className="mb-3 font-bold text-[#26342b]">What type of garment is it?</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {CLOTHING_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            disabled={disabled}
            className={`
              flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition-all
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${selected === option.value
                ? 'border-[#52735b] bg-[#eaf1e5] text-[#173f2d] shadow-sm'
                : 'border-[#e0e2dc] bg-white text-[#667068] hover:border-[#aab7ad]'
              }
            `}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f0f1ed]">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
