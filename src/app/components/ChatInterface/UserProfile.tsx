"use client";

import Image from "next/image";
import { 
  Sparkles, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Smile,
  Loader2
} from "lucide-react";
import { useEffect, useRef } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface UserProfileProps {
  user: User | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
  onImageUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUpdatingProfile: boolean;
}

export default function UserProfile({
  user,
  isOpen,
  setIsOpen,
  onLogout,
  onImageUpdate,
  isUpdatingProfile,
}: UserProfileProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div className="fixed top-6 right-6 z-50" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md p-0.5 rounded-full transition-all shadow-lg active:scale-95"
      >
        {isUpdatingProfile ? (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        ) : user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="Profile"
              width={32}
              height={32}
              unoptimized
              className="w-8 h-8 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center text-white text-xs font-bold border border-white/10">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </button>
  
        {/* Dropdown Menu */}
        <div className={`absolute top-12 right-0 w-64 bg-[#2d2d2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5 transition-all duration-200 origin-top-right ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}>
          {/* Header */}
          <div className="px-2 py-0.5">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2.5">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt="Profile"
                    width={32}
                    height={32}
                    unoptimized
                    className="w-8 h-8 rounded-full object-cover"
                  />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center text-white text-[10px] font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div className="leading-tight">
                <p className="text-xs font-medium text-white truncate max-w-[120px]">{user?.name || "User"}</p>
                <p className="text-[10px] text-white/40">Free</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
          </div>
        </div>

        <div className="h-px bg-white/5 my-1 mx-2" />

        {/* Menu Items */}
        <div className="px-1.5 space-y-0.5">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-white/90 hover:bg-white/5 rounded-lg transition-colors text-left">
            <Sparkles className="w-3.5 h-3.5 text-white/60" />
            <span>Try Plus free</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-white/90 hover:bg-white/5 rounded-lg transition-colors text-left">
            <Smile className="w-3.5 h-3.5 text-white/60" />
            <span>Personalization</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-white/90 hover:bg-white/5 rounded-lg transition-colors relative text-left"
          >
            <User className="w-3.5 h-3.5 text-white/60" />
            <span>Profile</span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={onImageUpdate}
            />
          </button>

          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-white/90 hover:bg-white/5 rounded-lg transition-colors text-left">
            <Settings className="w-3.5 h-3.5 text-white/60" />
            <span>Settings</span>
          </button>
        </div>

        <div className="h-px bg-white/5 my-1 mx-2" />

        <div className="px-1.5 space-y-0.5">
          <button className="w-full flex items-center justify-between px-2.5 py-2 text-[13px] text-white/90 hover:bg-white/5 rounded-lg transition-colors group text-left">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-3.5 h-3.5 text-white/60" />
              <span>Help</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
          </button>
          <button 
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-white/90 hover:bg-white/5 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5 text-white/60" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
