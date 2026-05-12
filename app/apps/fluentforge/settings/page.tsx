"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, X, LogOut } from "lucide-react";
import { authApi, settingsApi, User } from "../_lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await authApi.me();
        setUser(data.user);
        const keys = await settingsApi.getKeys();
        if (keys.keys.length > 0) {
          setMaskedKey(keys.keys[0].masked_key);
        }
      } catch (err) {
        router.push("/apps/fluentforge/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/apps/fluentforge/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!apiKey.trim()) {
      setError("API key cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const result = await settingsApi.saveKey(apiKey);
      setMaskedKey(result.masked_key);
      setApiKey("");
      setSuccess("API key saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save API key");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm">
              F
            </div>
            <h1 className="text-xl font-semibold text-primary">FluentForge</h1>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/apps/fluentforge"
              className="text-slate-700 hover:text-primary transition"
            >
              Workspace
            </a>
            <a
              href="/apps/fluentforge/history"
              className="text-slate-700 hover:text-primary transition"
            >
              History
            </a>
            <a
              href="/apps/fluentforge/account"
              className="text-slate-700 hover:text-primary transition"
            >
              Account
            </a>
            <button
              onClick={handleLogout}
              className="text-slate-700 hover:text-primary transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {sidebarOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <nav className="flex flex-col p-4 gap-3">
              <a
                href="/apps/fluentforge"
                className="text-slate-700 hover:text-primary transition py-2"
              >
                Workspace
              </a>
              <a
                href="/apps/fluentforge/history"
                className="text-slate-700 hover:text-primary transition py-2"
              >
                History
              </a>
              <a
                href="/apps/fluentforge/account"
                className="text-slate-700 hover:text-primary transition py-2"
              >
                Account
              </a>
              <button
                onClick={handleLogout}
                className="text-left text-slate-700 hover:text-primary transition py-2"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Settings</h2>

        <Card className="p-6 border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            OpenAI API Key
          </h3>

          <form onSubmit={handleSaveKey} className="space-y-4">
            <div>
              <Label htmlFor="api-key" className="text-slate-700 font-medium">
                API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                disabled={saving}
                className="mt-2"
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter your OpenAI API key. This will be used for all fluency rewrite requests.
              </p>
            </div>

            {maskedKey && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-900 text-sm">
                  <span className="font-medium">Current key:</span> {maskedKey}
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-900 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-900 text-sm">{success}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={saving || !apiKey.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {saving ? "Saving..." : "Save API Key"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
