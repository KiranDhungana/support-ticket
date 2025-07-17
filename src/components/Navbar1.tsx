import {useState} from 'react'
import { Menu, X } from 'lucide-react';

const Navbar1 = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-[#24557a] shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex justify-center flex-1">
            <div className="hidden sm:flex sm:space-x-8">
              <a href="#" className="border-b-2 border-transparent hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 text-md font-medium">Superitendent</a>
              <a href="#" className="border-b-2 border-transparent hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 text-md font-medium">Parents & Students</a>
              <a href="#" className="border-b-2 border-transparent hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 text-md font-medium">Policies</a>
              <a href="#" className="border-b-2 border-transparent hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 text-md font-medium">Contact Schools</a>
              <a href="#" className="border-b-2 border-transparent hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 text-md font-medium">Staff</a>
              <a href="#" className="border-b-2 border-transparent hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 text-md font-medium">Departments</a>
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md inline-flex items-center justify-center text-white hover:text-gray-200 hover:bg-blue-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-[#24557a] shadow-lg z-50">
          <div className="pt-2 pb-3 space-y-1">
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-indigo-500 bg-blue-600 text-white text-base font-medium">Superitendent</a>
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-indigo-500 hover:bg-blue-600 text-white text-base font-medium">Parents & Students</a>
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-indigo-500 hover:bg-blue-600 text-white text-base font-medium">Policies</a>
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-indigo-500 hover:bg-blue-600 text-white text-base font-medium">Contact Schools</a>
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-indigo-500 hover:bg-blue-600 text-white text-base font-medium">Staff</a>
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-indigo-500 hover:bg-blue-600 text-white text-base font-medium">Departments</a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar1