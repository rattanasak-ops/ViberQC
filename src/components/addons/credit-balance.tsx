"use client";

import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

export function CreditBalance() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/credits")
      .then((res) => res.json())
      .then((data) => setBalance(data.balance ?? 0))
      .catch(() => setBalance(0));
  }, []);

  if (balance === null) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm">
      <Coins className="h-4 w-4 text-primary" />
      <span className="font-medium text-foreground">{balance} credits</span>
    </div>
  );
}
