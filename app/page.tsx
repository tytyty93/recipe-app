import Hero from "@/components/context/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4 items-end">
        <Hero />
      </div>
    </main>
  );
}
