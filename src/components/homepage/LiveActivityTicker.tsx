import { useState, useEffect } from "react";
import { Users, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const activities = [
  { name: "Mercy from Nairobi", action: "just enrolled", time: "2 minutes ago" },
  { name: "Peter from Eldoret", action: "completed Module 3", time: "5 minutes ago" },
  { name: "Aisha from Mombasa", action: "just enrolled", time: "8 minutes ago" },
  { name: "John from Kisumu", action: "got their certificate", time: "12 minutes ago" },
  { name: "Linet from Nakuru", action: "just enrolled", time: "15 minutes ago" },
  { name: "Brian from Thika", action: "started Module 1", time: "18 minutes ago" },
  { name: "Sarah from Kiambu", action: "just enrolled", time: "22 minutes ago" },
  { name: "Kevin from Machakos", action: "completed the course", time: "25 minutes ago" },
  { name: "Rose from Nyeri", action: "just enrolled", time: "31 minutes ago" },
  { name: "James from Meru", action: "got their certificate", time: "35 minutes ago" },
];

export function LiveActivityTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % activities.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const current = activities[index];

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden md:block pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-4 pr-6 flex items-center gap-3 max-w-sm"
        >
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-accent-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-success rounded-full ring-2 ring-card animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {current.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {current.action} • {current.time}
            </p>
          </div>
          <TrendingUp className="h-4 w-4 text-success flex-shrink-0" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
