"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Menu, X, LogOut } from "lucide-react";
import { authApi, Subscription, User } from "../_lib/api";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await authApi.me();
        setUser(data.user);
        const subData = await authApi.subscription();
        setSubscription(subData);
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
              className="text-primary font-medium transition"
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
                className="text-primary font-medium transition py-2"
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
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Account Settings</h2>

        <div className="space-y-6">
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Profile Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  EMAIL ADDRESS
                </label>
                <p className="text-slate-900 mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  NAME
                </label>
                <p className="text-slate-900 mt-1">
                  {user.display_name || user.email.split("@")[0]}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  MEMBER SINCE
                </label>
                <p className="text-slate-900 mt-1">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Subscription
            </h3>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    CURRENT PLAN
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-slate-900 font-semibold">
                      {user.tier === "pro" ? "Pro" : "Free"}
                    </p>
                    <Badge
                      variant={
                        user.tier === "pro" ? "default" : "secondary"
                      }
                    >
                      {user.tier === "pro" ? "$5/month" : "Free"}
                    </Badge>
                  </div>
                </div>
              </div>

              {subscription && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      STATUS
                    </label>
                    <p className="text-slate-900 mt-1 capitalize">
                      {subscription.status}
                    </p>
                  </div>

                  {subscription.current_period_end && (
                    <div>
                      <label className="text-xs font-semibold text-slate-600">
                        NEXT BILLING DATE
                      </label>
                      <p className="text-slate-900 mt-1">
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="pt-4 flex gap-3">
                {user.tier === "free" && (
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90"
                  >
                    <a href="/apps/fluentforge/pricing">Upgrade to Pro</a>
                  </Button>
                )}
                {user.tier === "pro" && (
                  <Button
                    variant="outline"
                    disabled
                    className="cursor-not-allowed"
                  >
                    Manage Subscription (Paddle)
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Danger Zone
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Sign out of your account on this device.
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
