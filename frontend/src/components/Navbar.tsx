"use client";

import { useState } from "react";
import { X, Menu } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">My Store</h1>

      {/* Mobile Menu Button */}
      <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex space-x-6">
        <li
          className={`cursor-pointer ${activeTab === "products" ? "text-blue-600 font-bold" : "hover:text-blue-600"}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </li>
        <li
          className={`cursor-pointer ${activeTab === "adjustments" ? "text-blue-600 font-bold" : "hover:text-blue-600"}`}
          onClick={() => setActiveTab("adjustments")}
        >
          Adjustments
        </li>
      </ul>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="lg:hidden bg-white shadow-md absolute w-full left-0 top-16 space-y-4 p-4">
          <li
            className="cursor-pointer hover:text-blue-600"
            onClick={() => {
              setActiveTab("products");
              setIsMenuOpen(false);
            }}
          >
            Products
          </li>
          <li
            className="cursor-pointer hover:text-blue-600"
            onClick={() => {
              setActiveTab("adjustments");
              setIsMenuOpen(false);
            }}
          >
            Adjustments
          </li>
        </ul>
      )}
    </nav>
  );
}
