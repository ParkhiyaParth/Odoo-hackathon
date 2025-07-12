import { BellIcon } from 'lucide-react';

export default function NotificationBell({ count }: { count: number }) {
  return (
    <div className="relative">
      <BellIcon className="w-6 h-6 text-gray-700" />
      {count > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {count}
        </span>
      )}
    </div>
  );
}
