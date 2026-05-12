"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, X, LogOut, Settings, BarChart3 } from "lucide-react";
import { authApi, rewriteApi, User, UsageResponse } from "./_lib/api";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    const checkoutSuccess = searchParams?.get("checkout");
    if (checkoutSuccess === "success") {
      setIsPolling(true);
      const pollSubscription = setInterval(async () => {
        try {
          const me = await authApi.me();
          if (me.subscription_status === "active") {
            setIsPolling(false);
            clearInterval(pollSubscription);
            router.replace("/apps/fluentforge");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
      const timeout = setTimeout(() => {
        clearInterval(pollSubscription);
        setIsPolling(false);
      }, 40000);
      return () => {
        clearInterval(pollSubscription);
        clearTimeout(timeout);
      };
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authApi.me();
        setUser(data.user);
        if (data.user.tier === "free") {
          const usageData = await rewriteApi.usage();
          setUsage(usageData);
        }
      } catch (err) {
        router.push("/apps/fluentforge/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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
        {isPolling && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 text-sm">
              Payment processing... please wait
            </p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Fluency Coach
              </h2>
              <p className="text-slate-600 mt-2">
                Paste your text and get professional fluency rewrites
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{user.tier.toUpperCase()}</Badge>
              {user.tier === "free" && usage && (
                <Badge variant="outline">
                  {usage.remaining} of {usage.daily_limit} rewrites left
                </Badge>
              )}
            </div>
          </div>

          <RewriteWorkspace user={user} usage={usage} />
        </div>
      </main>
    </div>
  );
}

function RewriteWorkspace({
  user,
  usage,
}: {
  user: User;
  usage: UsageResponse | null;
}) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const isLimitReached = usage && usage.remaining === 0;

  const handleRewrite = async () => {
    if (!text.trim() || text.length < 10 || text.length > 2000) {
      setError("Text must be between 10 and 2000 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await rewriteApi.rewrite(text);
      setResult(data);
      setText("");
    } catch (err: any) {
      if (err.status === 429) {
        setError("Daily limit reached. Please upgrade to Pro for unlimited rewrites.");
      } else if (err.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError(err.message || "Failed to rewrite text");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.rewritten_text) {
      await navigator.clipboard.writeText(result.rewritten_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <label className="block text-sm font-medium text-slate-900 mb-3">
          Your Text
        </label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your email, message, cover letter, or any professional text..."
          className="min-h-[180px] text-base"
          disabled={isLimitReached}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {text.length} / 2000 characters
          </div>
          <Button
            onClick={handleRewrite}
            disabled={
              loading ||
              !text.trim() ||
              text.length < 10 ||
              isLimitReached
            }
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? "Rewriting..." : "Rewrite for Fluency"}
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-900 text-sm">{error}</p>
          {error.includes("Daily limit") && (
            <a
              href="/apps/fluentforge/pricing"
              className="inline-block mt-2 text-sm text-red-700 hover:text-red-900 font-medium underline"
            >
              Upgrade to Pro →
            </a>
          )}
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="lessons">Micro-Lessons</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-4">
              <Card className="p-6 bg-orange-50 border-orange-200">
                <h3 className="font-semibold text-slate-900 mb-3">Before</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {result.original_text}
                </p>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">After</h3>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </Button>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {result.rewritten_text}
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="lessons" className="space-y-4">
              {result.micro_lessons &&
                result.micro_lessons.length > 0 &&
                result.micro_lessons.map((lesson: any, idx: number) => (
                  <Card key={idx} className="p-4 border-slate-200">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge className="mt-0.5 bg-primary/10 text-primary border-0">
                          {idx + 1}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium text-slate-900">
                              "{lesson.original}"
                            </span>
                            {" → "}
                            <span className="font-medium text-green-700">
                              "{lesson.rewritten}"
                            </span>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {lesson.explanation}
                      </p>
                    </div>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
