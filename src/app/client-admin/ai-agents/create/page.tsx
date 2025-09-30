
"use client";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { elevenLabsApi } from "@/lib/elevenlabsApi";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/cn";
import { ChevronsUpDown } from "lucide-react";
import { api } from "@/lib/apiConfig";
import { useUser } from '@/lib/utils';
import { tokenStorage } from "@/lib/tokenStorage";

const MAX_LENGTH = 50;

export default function CreateAgentPage() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const isValid = name.trim().length > 0 && name.length <= MAX_LENGTH;

  const handleCreateAgent = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError("");
    setSuccess(false);
    console.log("User object:", user);
    console.log("client_id being sent:", (user as any)?.id ?? (user as any)?.clientId);
    try {
      const res = await fetch("/api/elevenlabs/create-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
          'Authorization': `Bearer ${tokenStorage.getToken()}`,
        },
        credentials: "include",
        body: JSON.stringify({
          conversation_config: { agent: {} },
          name: name.trim(),
          client_id: user?.userId, // use correct property for client id
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setTimeout(() => {
          router.push(`/client-admin/ai-agents/create/details/${data.agent_id}`);
        }, 500);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Failed to create agent.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-xl md:text-2xl font-bold mb-1 w-full text-left">Name your agent</h1>
        <p className="text-sm text-muted-foreground mb-4 w-full text-left">
          Choose a name that reflects your agent's purpose
        </p>
        {/* Client Dropdown */}
        {/* End Client Dropdown */}
        <input
          type="text"
          placeholder="Enter agent name..."
          value={name}
          maxLength={MAX_LENGTH}
          onChange={e => setName(e.target.value)}
          className="w-full text-base px-4 py-3 border border-border bg-background text-foreground rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-center font-semibold"
          style={{ boxSizing: "border-box" }}
        />
        <div className="w-full text-center text-xs text-muted-foreground mb-5">{name.length}/{MAX_LENGTH} characters</div>
        <button
          className={`w-full max-w-md flex items-center justify-center gap-2 py-2 rounded-lg text-base font-medium transition-colors mb-6 ${isValid && !loading ? 'bg-primary text-primary-foreground cursor-pointer' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
          disabled={!isValid || loading}
          onClick={handleCreateAgent}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Create Agent
        </button>
        {success && <div className="text-green-400 text-sm mb-2">Agent created successfully!</div>}
        {error && <div className="text-destructive text-sm mb-2">{error}</div>}
      </div>
    </div>
  );
}
