'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

export default function Navigation() {
  const { user, isLoaded } = useUser();

  return (
    <nav className="bg-slate-900/50 border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-white hover:text-teal-400 transition">
            VoiceAIForms
          </Link>

          {/* Navigation Links */}
          {isLoaded && user && (
            <div className="flex items-center gap-6">
              <Link
                href="/forms"
                className="text-slate-300 hover:text-white transition"
              >
                My Forms
              </Link>
              <Link
                href="/forms/create"
                className="text-slate-300 hover:text-white transition"
              >
                Create Form
              </Link>
              <Link
                href="/forms/profile"
                className="text-slate-300 hover:text-white transition"
              >
                Settings
              </Link>
              <Link
                href="/profile"
                className="text-slate-300 hover:text-white transition"
              >
                Account
              </Link>

              {/* Clerk UserButton with logout */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div>
          )}

          {/* Show sign in if not logged in */}
          {isLoaded && !user && (
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
