"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  BookOpen,
  BarChart3,
  MessageCircle,
  Mail,
  Lightbulb,
} from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
}

interface FeatureItem {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect to get started",
    features: [
      "5 rewrites per day",
      "Basic before/after output",
      "Micro-lesson explanations",
      "No credit card required",
    ],
    buttonText: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$5",
    description: "For serious fluency learners",
    features: [
      "Unlimited rewrites per day",
      "Full micro-lesson explanations",
      "Rewrite history (last 30 sessions)",
      "Priority processing",
      "Month-to-month billing, cancel anytime",
    ],
    buttonText: "Upgrade to Pro",
    highlighted: true,
  },
];

const features: FeatureItem[] = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Fluency Coaching",
    description:
      "Paste any text and get AI-powered rewrites that sound naturally fluent, not textbook-correct.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Learn Why It Matters",
    description:
      "Understand the reasoning behind each edit with micro-lessons on idioms, rhythm, and cultural context.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Track Your Progress",
    description:
      "Watch your fluency score improve over time as you internalize natural English patterns.",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Context-Aware Rewrites",
    description:
      "Different suggestions for emails, LinkedIn posts, cover letters, and casual messages.",
  },
];

const howItWorks: HowItWorksStep[] = [
  {
    number: "1",
    title: "Paste Your Text",
    description:
      "Copy any email, message, or document and paste it into FluentForge.",
  },
  {
    number: "2",
    title: "AI Analyzes for Fluency",
    description:
      "Our NLP engine scans for awkward phrasing, unnatural rhythm, and non-native patterns.",
  },
  {
    number: "3",
    title: "Get Coaching & Rewrites",
    description:
      "See before/after comparisons with explanations of why native speakers would say it differently.",
  },
  {
    number: "4",
    title: "Learn & Improve",
    description:
      "Each edit teaches you something new about natural English, building your intuition over time.",
  },
];

export default function LandingPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("free");
  const [email, setEmail] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = (): void => {
    if (email) {
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">FluentForge</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900">
              How It Works
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900">
              Pricing
            </a>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <a href="/apps/fluentforge/login">Sign In</a>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="/apps/fluentforge/register">Sign Up</a>
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            AI-Powered Fluency Coaching
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Sound Like a Native English Speaker
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            FluentForge transforms your English from correct to naturally fluent.
            Go beyond grammar—master the rhythm, idioms, and tone that make native
            speakers listen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <a href="/apps/fluentforge/register">
                Try Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 text-slate-900"
            >
              Watch Demo
            </Button>
          </div>
          <div className="bg-slate-100 rounded-lg p-8 border border-slate-200">
            <p className="text-sm text-slate-600 mb-4">Example Transformation:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-slate-700 mb-2">Before:</p>
                <p className="text-slate-700 italic">
                  &quot;Please do the needful at your earliest convenience.&quot;
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-2">After:</p>
                <p className="text-slate-700 italic">
                  &quot;Please take care of this when you have a chance.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Choose FluentForge?
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to master natural English fluency
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature: FeatureItem, index: number) => (
              <Card
                key={index}
                className="p-6 border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Four simple steps to fluent English
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step: HowItWorksStep, index: number) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-blue-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600">
              Choose the plan that fits your fluency journey
            </p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="pro">Pro</TabsTrigger>
            </TabsList>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingTiers.map((tier: PricingTier, index: number) => (
                <TabsContent
                  key={index}
                  value={tier.name.toLowerCase()}
                  className="m-0"
                >
                  <Card
                    className={`p-8 border transition-all ${
                      tier.highlighted
                        ? "border-blue-600 shadow-lg ring-2 ring-blue-100"
                        : "border-slate-200"
                    }`}
                  >
                    {tier.highlighted && (
                      <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-700">
                        Most Popular
                      </Badge>
                    )}
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-slate-600 mb-4">{tier.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-900">
                        {tier.price}
                      </span>
                      {tier.price !== "Custom" && (
                        <span className="text-slate-600">/month</span>
                      )}
                    </div>
                    <Button
                      asChild
                      className={`w-full mb-8 ${
                        tier.highlighted
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      <a href={tier.highlighted ? "/apps/fluentforge/pricing" : "/apps/fluentforge/register"}>
                        {tier.buttonText}
                      </a>
                    </Button>
                    <ul className="space-y-4">
                      {tier.features.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Sound Like a Native Speaker?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of non-native English speakers improving their fluency
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button asChild className="bg-white text-blue-600 hover:bg-blue-50 font-semibold w-full">
              <a href="/apps/fluentforge/register">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-4">
            No credit card required. Start your free trial today.
          </p>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-400" />
                <span className="text-white font-bold">FluentForge</span>
              </div>
              <p className="text-sm">
                Making natural English accessible to non-native speakers worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>
              &copy; 2024 FluentForge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
