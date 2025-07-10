import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react'; // optional icon for arrow

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-2 max-w-md md:max-w-lg lg:max-w-none">
      <div className="overflow-hidden">
        <Image
          src="/images/stats.jpg" // 🖼 Replace with your actual path
          alt="Phone app"
          width={300}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Tile 2: Currencies */}
      <div className="bg-[#F4F1E8]  p-6 flex flex-col justify-between">
        <div className="text-right">
          <p className="text-3xl font-semibold text-gray-900">56+</p>
          <p className="text-sm text-gray-600">Currencies</p>
        </div>
        <div className="text-right text-gray-500 mt-4">
          🌍 {/* Or an icon if you prefer */}
        </div>
      </div>

      {/* Tile 3: Users Active */}
      <div className="bg-[#E4ECE7] p-6 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-700 text-xl">✦✦</span>
          <p className="text-gray-700 font-medium">Users Active</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* Avatars */}
          <div className="flex -space-x-2">
            <Image src="/avatars/user1.png" alt="User 1" width={32} height={32} className="rounded-full border-2 border-white" />
            <Image src="/avatars/user2.png" alt="User 2" width={32} height={32} className="rounded-full border-2 border-white" />
            <Image src="/avatars/user3.png" alt="User 3" width={32} height={32} className="rounded-full border-2 border-white" />
          </div>
          <div className="p-2 bg-white rounded-full shadow">
            <ArrowUpRight className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Tile 4: Total Saving */}
      <div className="bg-[#193C37]  p-6 flex flex-col justify-between text-white">
        <div>
          <p className="text-2xl font-semibold">$196,000</p>
          <p className="text-sm mt-1">Saving</p>
        </div>
        <span className="text-sm mt-2 text-green-400">↑</span>
      </div>
    </div>
  );
};

export default StatsGrid;
