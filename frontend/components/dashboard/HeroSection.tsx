"use client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import type { User } from "@/types/meeting";

export default function HeroSection({ user }: { user: User | null }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-[#0B5CFF] to-[#0040CC] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-16 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">
              {format(now, "EEEE, MMMM d, yyyy")}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              {greeting}{user ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Ready to start or join a meeting?
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-4xl sm:text-5xl font-light tabular-nums tracking-tight">
              {format(now, "h:mm")}
              <span className="text-2xl text-blue-300 ml-1">{format(now, "a")}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
