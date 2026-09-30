"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Video, Settings, Bell, ChevronDown, Search,
  Calendar, Users, LayoutGrid, Menu, X,
} from "lucide-react";
import type { User } from "@/types/meeting";

const NAV_LINKS = [
  { label: "Meetings", href: "/", icon: LayoutGrid },
  { label: "Calendar", href: "#", icon: Calendar },
  { label: "Contacts", href: "#", icon: Users },
];

export default function Navbar({ user }: { user: User | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="h-14 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
        <div className="w-8 h-8 bg-[#0B5CFF] rounded-lg flex items-center justify-center">
          <Video size={16} className="text-white" />
        </div>
        <span className="text-[#0B5CFF] font-bold text-lg tracking-tight hidden sm:block">
          Zoom
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      {/* Search */}
      <div className={`hidden sm:flex items-center gap-2 ml-2 bg-gray-100 rounded-lg px-3 py-1.5 transition-all ${searchFocused ? "ring-2 ring-[#0B5CFF] bg-white" : ""}`}>
        <Search size={14} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-36 lg:w-48"
        />
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex">
          <Bell size={18} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex">
          <Settings size={18} className="text-gray-600" />
        </button>

        {user && (
          <button className="flex items-center gap-2 ml-1 hover:bg-gray-100 rounded-full pl-1 pr-2 py-1 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#0B5CFF] flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden lg:block max-w-[120px] truncate">
              {user.name}
            </span>
            <ChevronDown size={14} className="text-gray-500 hidden lg:block" />
          </button>
        )}

        {/* Mobile menu toggle */}
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden z-50">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
