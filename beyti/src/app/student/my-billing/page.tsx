"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Wallet {
  balance: number;
  transactions: {
    _id: string;
    type: "topup" | "payment" | "refund" | "payout";
    amount: number;
    description: string;
    createdAt: string;
  }[];
}

export default function MyBillingPage() {
  const {token, role } = getCookie();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [topupAmount, setTopupAmount] = useState<string>(""); // ✅ store as string

  const fetchWallet = async () => {
    try {
      console.log(
        "✅ Attempting to fetch wallet with token:",
        token,
        "and role:",
        role
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/my-wallet`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            ...(role ? { "x-user-role": role } : {}), // ✅ only send if role exists
          },
        }
      );

      const data = await res.json();
      setWallet(data);
    } catch (error) {
      console.error("❌ Failed to fetch wallet:", error);
    }
  };

  useEffect(() => {
    console.log("✅ Inside useEffect, calling fetchWallet() now");
    if (token && role) {
      fetchWallet();
    } else {
      console.error("❌ Missing token or role, cannot fetch wallet.");
    }
  }, [token, role]);

  const handleTopup = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/topup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(role ? { "x-user-role": role } : {}), // ✅ only send if role exists
          },
          body: JSON.stringify({ amount: Number(topupAmount) }), // ✅ convert here
        }
      );

      if (!res.ok) throw new Error("Topup failed");

      setTopupAmount(""); // ✅ clear input after topup
      alert("✅ Wallet topped up!");

      await fetchWallet();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("❌ Failed to top up wallet.");
    }
  };

  if (!wallet) {
    return <div className="p-6">Loading wallet...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">My Wallet</h2>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-xl font-semibold">
            Balance: $
            {wallet?.balance !== undefined ? wallet.balance.toFixed(2) : "0.00"}
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Topup amount"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
            />
            <Button onClick={handleTopup}>Topup</Button>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold">Transaction History</h3>
      <div className="space-y-4">
        {wallet?.transactions?.length ? (
          wallet.transactions.map((tx) => (
            <Card key={tx._id}>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">{tx.type.toUpperCase()}</div>
                <div>
                  Amount: $
                  {tx?.amount !== undefined ? tx.amount.toFixed(2) : "0.00"}
                </div>
                <div>{tx.description}</div>
                <div className="text-xs text-gray-500">
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ""}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-gray-500">No transactions yet.</div>
        )}
      </div>
    </div>
  );
}
