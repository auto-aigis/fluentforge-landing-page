"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Menu, X, LogOut } from "lucide-react";
import { authApi, Subscription } from "../_lib/api";

declare global {
  interface Window {
    Paddle?: any;
  }
}

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
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
    fetchUser();
  }, [router]);

  useEffect(() => {
    const loadPaddle = () => {
      if (!window.Paddle) {
        const script = document.createElement("script");
        script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
        script.async = true;
        script.onload = () => {
          if (window.Paddle) {
            window.Paddle.Environment.set("sandbox");
            window.Paddle.Initialize({
              token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
              eventCallback: (data: any) => {
                if (data.name === "checkout.completed") {
                  const txnId = data.data?.transaction_id || "";
                  if (window.Paddle?.Checkout?.close) {
                    window.Paddle.Checkout.close();
                  }
                  window.location.href = `/apps/fluentforge?checkout=success&transaction_id=${txnId}`;
                }
              },
            });
          }
        };
        document.head.appendChild(script);
      }
    };
    loadPaddle();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/apps/fluentforge/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleUpgrade = () => {
    if (!user) {
      router.push("/apps/fluentforge/login");
      return;
    }

    if (window.Paddle) {
      window.Paddle.Checkout.open({
        items: [
          {
            priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO,
            quantity: 1,
          },
        ],
        customer: {
          email: user.email,
        },
        customData: {
          userId: user.id,
        },
      });
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

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600">
            Choose the plan that works for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 border border-slate-200 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 to-slate-200"></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
            <p className="text-slate-600 mb-6">
              Perfect to get started
            </p>

            <div className="mb-8">
              <span className="text-4xl font-bold text-slate-900">$0</span>
              <span className="text-slate-600 ml-2">/month</span>
            </div>

            <Button
              className="w-full mb-8"
              variant={user?.tier === "free" ? "outline" : "default"}
              disabled={user?.tier === "free"}
              onClick={() => router.push("/apps/fluentforge")}
            >
              {user?.tier === "free" ? "✓ Current Plan" : "Get Started"}
            </Button>

            <div className="space-y-4">
              {[
                "5 rewrites per day",
                "Basic before/after output",
                "Micro-lesson explanations",
                "Perfect for professionals exploring fluency coaching",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 border-2 border-primary relative ring-2 ring-primary/10">
            <Badge className="absolute -top-3 left-6 bg-primary text-white">
              Most Popular
            </Badge>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary"></div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
            <p className="text-slate-600 mb-6">
              For serious fluency learners
            </p>

            <div className="mb-8">
              <span className="text-4xl font-bold text-slate-900">$5</span>
              <span className="text-slate-600 ml-2">/month</span>
            </div>

            <Button
              className="w-full mb-8 bg-primary hover:bg-primary/90"
              onClick={handleUpgrade}
              disabled={user?.tier === "pro"}
            >
              {user?.tier === "pro" ? "✓ Current Plan" : "Upgrade to Pro"}
            </Button>

            <div className="space-y-4">
              {[
                "Unlimited rewrites per day",
                "Full micro-lesson explanations",
                "Rewrite history (last 30 sessions)",
                "Priority processing",
                "Master professional English communication",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <Card className="p-8 bg-slate-50 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-medium text-slate-900 mb-1">
                  Can I cancel anytime?
                </p>
                <p>Yes, you can cancel your Pro subscription anytime from your account settings. Your plan reverts to Free at the end of your billing period.</p>
              </div>
              <div>
                <p className="font-medium text-slate-900 mb-1">
                  How do rewrites reset?
                </p>
                <p>Free tier users get 5 rewrites per calendar day (UTC). The count resets at midnight UTC.</p>
              </div>
              <div>
                <p className="font-medium text-slate-900 mb-1">
                  What payment methods are accepted?
                </p>
                <p>We accept all major credit and debit cards through Paddle Billing.</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
