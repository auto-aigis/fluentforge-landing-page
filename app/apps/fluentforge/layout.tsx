import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FluentForge - Write Like a Native",
  description: "Professional fluency coaching for non-native English speakers",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
