import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    color?: string;
    selected?: boolean;
    onClick: () => void;
}

export const OptionCard = ({
    icon: Icon,
    title,
    description,
    color = 'blue',
    selected,
    onClick
}: OptionCardProps) => {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full p-6 rounded-xl border-2 transition-all duration-200 text-left',
                'hover:shadow-lg hover:-translate-y-1',
                selected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
            )}
        >
            <div className="flex items-start gap-4">
                <div className={cn(
                    'p-3 rounded-lg',
                    selected ? 'bg-primary/10' : colorClasses[color as keyof typeof colorClasses]
                )}>
                    <Icon className={cn(
                        'w-6 h-6',
                        selected ? 'text-primary' : ''
                    )} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </button>
    );
};
