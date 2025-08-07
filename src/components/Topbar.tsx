import { Search, Facebook, Twitter, ChevronDown } from 'lucide-react';
const Topbar = () => {
  return (
     <header>
      <div className="px-4 sm:px-6 lg:px-8 h-26 py-4">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between h-26 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src="/logo.png" alt="Logo" width={36} height={36} />
          </div>

          {/* Title */}
          <div className="mt-2 sm:mt-0 flex md:-ml-96">
            <div className="text-[2.5rem] font-serif text-[#24557a] font-bold pr-6">West Carroll</div>
            <div className="border-l-2 border-[#24557a] mx-auto w-6 my-1" />
            <div className="text-lg text-[#24557a] my-auto">Parish School Board</div>
          </div>

          {/* Search & Social */}
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-1 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Facebook size={24} className="text-[#d9ac69] hover:opacity-75" />
            <Twitter size={24} className="text-[#d9ac69] hover:opacity-75" />
            <ChevronDown size={24} className="text-gray-700 hover:opacity-75" />
          </div>
        </div>
      </div>

      {/* Accent Bar */}
      <div className="h-2 bg-[#d9ac69]" />
    </header>
  )
}

export default Topbar