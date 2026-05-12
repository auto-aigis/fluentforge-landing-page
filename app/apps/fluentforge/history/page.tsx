"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Menu, X, LogOut } from "lucide-react";
import { authApi, rewriteApi, RewriteSession, User } from "../_lib/api";

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<RewriteSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await authApi.me();
        setUser(data.user);

        if (data.user.tier === "pro") {
          const historyData = await rewriteApi.history();
          setSessions(historyData.sessions);
        } else {
          setError("History is available for Pro users only");
        }
      } catch (err: any) {
        if (err.status === 403) {
          setError("History is available for Pro users only");
        } else {
          router.push("/apps/fluentforge/login");
        }
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
              className="text-primary font-medium transition"
            >
              History
            </a>
            {user.tier === "free" && (
              <a
                href="/apps/fluentforge/pricing"
                className="text-slate-700 hover:text-primary transition font-medium text-accent"
              >
                Upgrade
              </a>
            )}
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
                className="text-primary font-medium transition py-2"
              >
                History
              </a>
              {user.tier === "free" && (
                <a
                  href="/apps/fluentforge/pricing"
                  className="text-slate-700 hover:text-primary transition font-medium text-accent py-2"
                >
                  Upgrade
                </a>
              )}
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Rewrite History</h2>
        <p className="text-slate-600 mb-8">
          Your last {sessions.length} rewrite sessions
        </p>

        {error && user.tier === "free" && (
          <Card className="p-8 bg-blue-50 border-blue-200 text-center mb-8">
            <p className="text-blue-900 font-medium mb-4">{error}</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href="/apps/fluentforge/pricing">Upgrade to Pro</a>
            </Button>
          </Card>
        )}

        {sessions.length === 0 && user.tier === "pro" && (
          <Card className="p-8 text-center">
            <p className="text-slate-600 mb-4">No rewrite history yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href="/apps/fluentforge">Start Rewriting</a>
            </Button>
          </Card>
        )}

        <div className="space-y-6">
          {sessions.map((session) => (
            <Card key={session.id} className="p-6 border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500">
                    {new Date(session.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary">Pro</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    BEFORE
                  </p>
                  <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
                    {session.original_text}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    AFTER
                  </p>
                  <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
                    {session.rewritten_text}
                  </p>
                </div>
              </div>

              {session.micro_lessons && session.micro_lessons.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 mb-3">
                    KEY CHANGES ({session.micro_lessons.length})
                  </p>
                  <div className="space-y-2">
                    {session.micro_lessons.slice(0, 2).map((lesson, idx) => (
                      <div key={idx} className="text-xs text-slate-600">
                        <span className="font-medium">"{lesson.original}"</span>
                        {" → "}
                        <span className="font-medium text-green-700">
                          "{lesson.rewritten}"
                        </span>
                      </div>
                    ))}
                    {session.micro_lessons.length > 2 && (
                      <p className="text-xs text-slate-500 italic">
                        +{session.micro_lessons.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
