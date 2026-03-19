"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Transaction {
  id: string;
  transactionType: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}

export function CreditHistoryTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/credits/history?limit=20")
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        ยังไม่มีประวัติ credits
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40 text-left text-xs text-muted-foreground">
            <th className="pb-2 pr-4">Date</th>
            <th className="pb-2 pr-4">Type</th>
            <th className="pb-2 pr-4 text-right">Amount</th>
            <th className="pb-2 pr-4 text-right">Balance</th>
            <th className="pb-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const date = new Date(tx.createdAt).toLocaleDateString("th-TH", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const isPositive = tx.amount > 0;

            return (
              <tr key={tx.id} className="border-b border-border/20">
                <td className="py-2 pr-4 text-muted-foreground">{date}</td>
                <td className="py-2 pr-4 capitalize">{tx.transactionType}</td>
                <td
                  className={`py-2 pr-4 text-right font-medium ${
                    isPositive ? "text-emerald-500" : "text-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {tx.amount}
                </td>
                <td className="py-2 pr-4 text-right">{tx.balanceAfter}</td>
                <td className="py-2 text-muted-foreground">
                  {tx.description ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
