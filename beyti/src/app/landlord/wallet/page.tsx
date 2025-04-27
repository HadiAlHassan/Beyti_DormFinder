"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export default function LandlordWalletPage() {
  const { token, role } = getCookie();
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const fetchWallet = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/my-wallet`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            ...(role ? { "x-user-role": role } : {}),
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
    if (token && role) {
      fetchWallet();
    }
  }, [token, role]);

  if (!wallet) {
    return <div className="p-6">Loading landlord wallet...</div>;
  }

  const getBadgeColor = (type: string) => {
    if (type === "payment") return "bg-green-500 text-white";
    if (type === "payout") return "bg-yellow-500 text-black";
    return "bg-gray-500 text-white";
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">My Wallet (Landlord)</h2>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-xl font-semibold">
            Balance: ${wallet.balance.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold">Transaction History</h3>
      <div className="space-y-4">
        {wallet.transactions.length ? (
          wallet.transactions.map((tx) => (
            <Card key={tx._id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{tx.description}</div>
                  <Badge className={getBadgeColor(tx.type)}>
                    {tx.type.toUpperCase()}
                  </Badge>
                </div>
                <div>Amount: ${tx.amount.toFixed(2)}</div>
                <div className="text-xs text-gray-500">
                  {new Date(tx.createdAt).toLocaleString()}
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
