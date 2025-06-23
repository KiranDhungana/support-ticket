import {useState} from 'react'
import { Menu, X } from 'lucide-react';

const Navbar1 = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-[#24557a] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="flex justify-center">
            {/* <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
            </div> */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
              className="p-2 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-indigo-500 bg-indigo-50 text-white text-base font-medium">Home</a>
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-indigo-500 hover:bg-indigo-50 hover:text-white text-gray-700 text-base font-medium">About</a>
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 text-base font-medium">Services</a>
            <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 text-base font-medium">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar1