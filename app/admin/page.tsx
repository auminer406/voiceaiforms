'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Navigation from '@/app/components/Navigation';

interface ProUser {
  email: string;
  tier: string;
  lifetime_access: boolean;
  created_at: string;
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [proUsers, setProUsers] = useState<ProUser[]>([]);

  useEffect(() => {
    if (isLoaded) {
      loadProUsers();
    }
  }, [isLoaded]);

  async function loadProUsers() {
    try {
      const res = await fetch('/api/admin/list-pro-users');
      if (!res.ok) {
        if (res.status === 403) {
          setError('Access denied. Admin privileges required.');
          return;
        }
        throw new Error('Failed to load users');
      }
      const data = await res.json();
      setProUsers(data.users || []);
    } catch (e) {
      console.error(e);
      setError('Failed to load pro users');
    }
  }

  async function handleGrantAccess(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to grant access');
      }

      const data = await res.json();
      setMessage(`✅ Pro access granted to ${email}`);
      setEmail('');

      // Reload the list
      await loadProUsers();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        {/* Grant Access Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Grant Pro Access</h2>

          <form onSubmit={handleGrantAccess} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="beta-tester@example.com"
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {message && (
              <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {loading ? 'Granting...' : 'Grant Pro Access'}
            </button>
          </form>
        </div>

        {/* Pro Users List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Pro Users ({proUsers.length})</h2>

          {proUsers.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No pro users yet</p>
          ) : (
            <div className="space-y-2">
              {proUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-slate-400">
                      {user.lifetime_access ? 'Lifetime Access' : user.tier}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
