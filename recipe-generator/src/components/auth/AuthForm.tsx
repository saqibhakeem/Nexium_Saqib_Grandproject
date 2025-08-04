"use client";

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await login(email);

      if (result.success) {
        setMessage("✨ " + result.message);
      } else {
        setMessage(result.message);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🍳</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome to Recipe Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in with your email to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Send Magic Link 🪄
          </Button>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("✨")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We&apos;ll send you a secure link to sign in without a password
          </p>
        </div>
      </Card>
    </div>
  );
}
