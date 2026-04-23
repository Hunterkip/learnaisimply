import { useEffect, useState } from "react";
import { Flame, Users } from "lucide-react";

// Slowly counts down "spots remaining" for psychological scarcity
function useSpotsRemaining() {
  const [spots, setSpots] = useState(47);

  useEffect(() => {
    // Calculate based on day of year so it feels real and consistent
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const base = 50 - (dayOfYear % 35);
    setSpots(Math.max(7, base));

    // Slowly decrease throughout the day
    const interval = setInterval(() => {
      setSpots((s) => (Math.random() > 0.85 && s > 5 ? s - 1 : s));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return spots;
}

export function ScarcityBanner() {
  const spots = useSpotsRemaining();
  const [recentEnrolls] = useState(() => 8 + Math.floor(Math.random() * 12));

  return (
    <div className="bg-gradient-to-r from-destructive via-destructive/90 to-warning text-white py-2.5 px-4 text-center text-xs md:text-sm font-medium relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
      <div className="relative flex items-center justify-center gap-4 md:gap-6 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Flame className="h-4 w-4 animate-pulse" />
          <strong>Easter Special:</strong> 60% OFF — Only {spots} spots left at this price
        </span>
        <span className="hidden md:flex items-center gap-1.5 opacity-90">
          <Users className="h-3.5 w-3.5" />
          {recentEnrolls} people enrolled today
        </span>
      </div>
    </div>
  );
}
