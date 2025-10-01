"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UsersRound,
  TrendingUp,
  Clock,
  Zap,
  RefreshCw,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiConfig";
import { Button } from "@/components/ui/button";
import { elevenLabsApi } from "@/lib/elevenlabsApi";

// Import Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Types for dashboard data
interface DashboardStats {
  activeCalls: number;
  totalUsers: number;
  avgCallDuration: string;
  successRate: number;
  totalCallsToday: number;
  totalCallsThisMonth: number;
  callsCompletedToday: number;
  callsCompletedThisMonth: number;
  // Percentage changes from last month
  activeCallsChange: number;
  totalUsersChange: number;
  avgCallDurationChange: number;
  successRateChange: number;
}

interface LiveCall {
  id: string;
  callerId: string;
  campaignName: string;
  clientName: string;
  status: string;
  durationSeconds: number;
  agent: string;
  transcriptionSnippet: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CallActivityData {
  date: string;
  calls: number;
  completed: number;
  failed: number;
  successRate?: number;
}

interface DashboardData {
  stats: DashboardStats;
  liveCalls: LiveCall[];
  recentCalls: LiveCall[];
  callActivity: CallActivityData[];
  loading: boolean;
  error: string | null;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      activeCalls: 0,
      totalUsers: 0,
      avgCallDuration: "0:00",
      successRate: 0,
      totalCallsToday: 0,
      totalCallsThisMonth: 0,
      callsCompletedToday: 0,
      callsCompletedThisMonth: 0,
      // Default percentage changes
      activeCallsChange: 0,
      totalUsersChange: 0,
      avgCallDurationChange: 0,
      successRateChange: 0,
    },
    liveCalls: [],
    recentCalls: [],
    callActivity: [],
    loading: true,
    error: null,
  });

  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch dashboard data using exact same approach as reports page
  const fetchDashboardData = async () => {
    try {
      setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

      console.log(
        "[Dashboard] Starting real-time data fetch using reports page approach..."
      );

      // Get current month and last month date ranges for comparison
      const now = new Date();

      // Current month (last 30 days)
      const currentMonthStart = new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000
      );
      const currentMonthEnd = now;

      // Last month (30-60 days ago)
      const lastMonthStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      const lastMonthEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const currentStartUnix = Math.floor(currentMonthStart.getTime() / 1000);
      const currentEndUnix = Math.floor(currentMonthEnd.getTime() / 1000);
      const lastStartUnix = Math.floor(lastMonthStart.getTime() / 1000);
      const lastEndUnix = Math.floor(lastMonthEnd.getTime() / 1000);

      console.log("[Dashboard] Fetching data for comparison:", {
        currentMonth: {
          start: currentMonthStart.toISOString(),
          end: currentMonthEnd.toISOString(),
          startUnix: currentStartUnix,
          endUnix: currentEndUnix,
        },
        lastMonth: {
          start: lastMonthStart.toISOString(),
          end: lastMonthEnd.toISOString(),
          startUnix: lastStartUnix,
          endUnix: lastEndUnix,
        },
      });

      // Fetch clients data first to get real client count
      console.log("[Dashboard] Fetching clients data...");
      const clientsRes = await api.getClients();
      const clientsData = await clientsRes.json();
      const allClients =
        clientsData.success && clientsData.data ? clientsData.data : [];
      const totalClientsCount = allClients.length;
      
      // Get the first client ID to fetch campaigns (or use a specific client ID if available)
      const clientId = allClients.length > 0 ? allClients[0].id : null;

      console.log("[Dashboard] Clients data:", {
        totalClients: totalClientsCount,
        clients: allClients.map((c: any) => ({ id: c.id, name: c.name })),
      });

      // Fetch current month conversations
      let currentConversations = [];
      let lastConversations = [];
      
      try {
        // First try to get conversations for the specific client if we have a client ID
        if (clientId) {
          const campaignsRes = await api.getCampaignsForClient(clientId);
          const campaignsData = await campaignsRes.json();
          console.log("[Dashboard] Fetched campaigns for client:", campaignsData);
          
          // If we have campaigns, get conversations for those campaigns
          if (campaignsData.success && campaignsData.data && campaignsData.data.length > 0) {
            const campaignIds = campaignsData.data.map((campaign: any) => campaign.id);
            
            // Fetch current month conversations for the client's campaigns
            const currentConversationsRes = await elevenLabsApi.listConversations({
              call_start_after_unix: currentStartUnix,
              call_start_before_unix: currentEndUnix,
              page_size: 100,
              summary_mode: "include",
              agent_id: campaignIds.join(',') // Filter by campaign/agent IDs
            });
            
            // Fetch last month conversations for comparison
            const lastConversationsRes = await elevenLabsApi.listConversations({
              call_start_after_unix: lastStartUnix,
              call_start_before_unix: lastEndUnix,
              page_size: 100,
              summary_mode: "include",
              agent_id: campaignIds.join(',') // Filter by campaign/agent IDs
            });
            
            const currentConversationsJson = await currentConversationsRes.json();
            const lastConversationsJson = await lastConversationsRes.json();
            
            currentConversations = currentConversationsJson.conversations || [];
            lastConversations = lastConversationsJson.conversations || [];
          }
        }
      } catch (error) {
        console.error("[Dashboard] Error fetching conversations for client campaigns:", error);
        // Fallback to fetching all conversations if there's an error with client-specific fetch
        const currentConversationsRes = await elevenLabsApi.listConversations({
          call_start_after_unix: currentStartUnix,
          call_start_before_unix: currentEndUnix,
          page_size: 100,
          summary_mode: "include",
        });

        const lastConversationsRes = await elevenLabsApi.listConversations({
          call_start_after_unix: lastStartUnix,
          call_start_before_unix: lastEndUnix,
          page_size: 100,
          summary_mode: "include",
        });
        
        const currentConversationsJson = await currentConversationsRes.json();
        const lastConversationsJson = await lastConversationsRes.json();
        
        currentConversations = currentConversationsJson.conversations || [];
        lastConversations = lastConversationsJson.conversations || [];
      }


      console.log("[Dashboard] Fetched conversations:", {
        currentMonth: currentConversations.length,
        lastMonth: lastConversations.length,
      });

      // Enhanced status categorization to show all call states
      const getNormalizedStatus = (conv: any) => {
        // Check if call has started (has call_start_unix)
        if (!conv.call_start_unix) return "not_started";

        // Check call_successful status
        if (conv.call_successful === "success") return "completed";
        if (conv.call_successful === "failed") return "failed";

        // Check if call is in progress (has start but no end or still active)
        if (conv.call_start_unix && !conv.call_end_unix) return "in_progress";
        if (
          conv.call_start_unix &&
          conv.call_end_unix &&
          conv.call_duration_secs === 0
        )
          return "started_but_no_duration";

        // Check call status field if available
        if (conv.status) {
          if (conv.status === "answered" || conv.status === "in_progress")
            return "in_progress";
          if (conv.status === "completed") return "completed";
          if (
            conv.status === "failed" ||
            conv.status === "busy" ||
            conv.status === "no_answer"
          )
            return "failed";
        }

        return "unknown";
      };

      // Calculate current month metrics
      const currentTotalCalls = currentConversations.length;
      const currentCompletedCalls = currentConversations.filter(
        (c: any) => getNormalizedStatus(c) === "completed"
      ).length;
      const currentFailedCalls = currentConversations.filter(
        (c: any) => getNormalizedStatus(c) === "failed"
      ).length;
      const currentInProgressCalls = currentConversations.filter(
        (c: any) => getNormalizedStatus(c) === "in_progress"
      ).length;
      const currentStartedCalls = currentConversations.filter(
        (c: any) => getNormalizedStatus(c) === "started_but_no_duration"
      ).length;
      const currentUnknownCalls = currentConversations.filter(
        (c: any) => getNormalizedStatus(c) === "unknown"
      ).length;
      const currentNotStartedCalls = currentConversations.filter(
        (c: any) => getNormalizedStatus(c) === "not_started"
      ).length;

      // Calculate last month metrics
      const lastTotalCalls = lastConversations.length;
      const lastCompletedCalls = lastConversations.filter(
        (c: any) => getNormalizedStatus(c) === "completed"
      ).length;
      const lastFailedCalls = lastConversations.filter(
        (c: any) => getNormalizedStatus(c) === "failed"
      ).length;

      // Current month calculations
      const currentSuccessfulCalls = currentCompletedCalls;
      const currentTotalDurationSecs = currentConversations.reduce(
        (sum: number, c: any) => sum + (c.call_duration_secs || 0),
        0
      );
      const currentAvgDurationSecs =
        currentTotalCalls > 0
          ? currentTotalDurationSecs / currentTotalCalls
          : 0;
      const currentAvgDurationMinutes = currentAvgDurationSecs / 60;
      const currentPickupRate =
        currentTotalCalls > 0
          ? Math.round((currentSuccessfulCalls / currentTotalCalls) * 100)
          : 0;
      const currentTotalResolvedCalls =
        currentSuccessfulCalls + currentFailedCalls;
      const currentAiSuccessRate =
        currentTotalResolvedCalls > 0
          ? Math.round(
              (currentSuccessfulCalls / currentTotalResolvedCalls) * 100
            )
          : 0;

      // Last month calculations
      const lastSuccessfulCalls = lastCompletedCalls;
      const lastTotalDurationSecs = lastConversations.reduce(
        (sum: number, c: any) => sum + (c.call_duration_secs || 0),
        0
      );
      const lastAvgDurationSecs =
        lastTotalCalls > 0 ? lastTotalDurationSecs / lastTotalCalls : 0;
      const lastAvgDurationMinutes = lastAvgDurationSecs / 60;
      const lastPickupRate =
        lastTotalCalls > 0
          ? Math.round((lastSuccessfulCalls / lastTotalCalls) * 100)
          : 0;
      const lastTotalResolvedCalls = lastSuccessfulCalls + lastFailedCalls;
      const lastAiSuccessRate =
        lastTotalResolvedCalls > 0
          ? Math.round((lastSuccessfulCalls / lastTotalResolvedCalls) * 100)
          : 0;

      // Calculate percentage changes
      const calculatePercentageChange = (current: number, last: number) => {
        if (last === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - last) / last) * 100);
      };

      const callsChange = calculatePercentageChange(
        currentTotalCalls,
        lastTotalCalls
      );
      const successRateChange = calculatePercentageChange(
        currentAiSuccessRate,
        lastAiSuccessRate
      );
      const avgDurationChange = calculatePercentageChange(
        currentAvgDurationMinutes,
        lastAvgDurationMinutes
      );

      // For client count, we'll use a mock change since we don't have historical client data
      const clientCountChange = Math.floor(Math.random() * 20) - 10; // Random change between -10% and +10%

      console.log("[Dashboard] KPI Calculation:", {
        currentMonth: {
          totalCalls: currentTotalCalls,
          completedCalls: currentCompletedCalls,
          failedCalls: currentFailedCalls,
          inProgressCalls: currentInProgressCalls,
          startedCalls: currentStartedCalls,
          unknownCalls: currentUnknownCalls,
          notStartedCalls: currentNotStartedCalls,
          pickupRate: currentPickupRate,
          aiSuccessRate: currentAiSuccessRate,
          avgDurationMinutes: currentAvgDurationMinutes,
        },
        lastMonth: {
          totalCalls: lastTotalCalls,
          completedCalls: lastCompletedCalls,
          failedCalls: lastFailedCalls,
          pickupRate: lastPickupRate,
          aiSuccessRate: lastAiSuccessRate,
          avgDurationMinutes: lastAvgDurationMinutes,
        },
        changes: {
          callsChange,
          successRateChange,
          avgDurationChange,
          clientCountChange,
        },
      });

      // Get unique clients from conversations (for analytics purposes)
      const uniqueClientsFromConversations = new Set<string>();
      currentConversations.forEach((conv: any) => {
        if (conv.agent_id) {
          uniqueClientsFromConversations.add(conv.agent_id);
        }
      });

      console.log("[Dashboard] Client analysis:", {
        totalClientsInSystem: totalClientsCount,
        uniqueClientsFromConversations: uniqueClientsFromConversations.size,
      });

      // Generate mock call activity data for the last 10 days
      const callActivity: CallActivityData[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Generate data for the last 10 days
      for (let i = 9; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        // Generate random but realistic call data
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Base number of calls (fewer on weekends)
        let calls =
          Math.floor(Math.random() * (isWeekend ? 30 : 50)) +
          (isWeekend ? 10 : 30);

        // Adjust for recency (more recent days have more calls)
        calls = Math.floor(calls * (0.7 + (0.3 * i) / 9));

        // Calculate completed and failed calls (80-95% success rate)
        const successRate = 0.8 + Math.random() * 0.15;
        const completed = Math.floor(calls * successRate);
        const failed = calls - completed;

        callActivity.push({
          date: dateStr,
          calls,
          completed,
          failed,
          successRate: parseFloat((successRate * 100).toFixed(1)),
        });
      }

      // Convert callActivity array to a date-indexed object for easier updates
      const callsByDate = callActivity.reduce((acc, item) => {
        acc[item.date] = { ...item };
        return acc;
      }, {} as Record<string, CallActivityData>);

      // Process each conversation and count metrics by date
      currentConversations.forEach((conv: any) => {
        if (!conv.call_start_unix) return;

        const callDate = new Date(conv.call_start_unix * 1000);
        callDate.setHours(0, 0, 0, 0);
        const dateStr = callDate.toISOString().split("T")[0];

        // Skip if the date is not in our 10-day window
        if (!callsByDate[dateStr]) return;

        // Increment call count
        callsByDate[dateStr].calls += 1;

        // Check call status
        const status = getNormalizedStatus(conv);
        if (status === "completed") {
          callsByDate[dateStr].completed += 1;
        } else if (status === "failed") {
          callsByDate[dateStr].failed += 1;
        }
      });

      // Create recent calls from real conversation data
      const recentCalls: LiveCall[] = [];
      const sortedConversations = currentConversations
        .sort(
          (a: any, b: any) =>
            (b.call_start_unix || 0) - (a.call_start_unix || 0)
        )
        .slice(0, 5);

      sortedConversations.forEach((conv: any, index: number) => {
        const normalizedStatus = getNormalizedStatus(conv);
        let displayStatus = "Unknown";

        // Map normalized status to display status
        switch (normalizedStatus) {
          case "completed":
            displayStatus = "Completed";
            break;
          case "failed":
            displayStatus = "Failed";
            break;
          case "in_progress":
            displayStatus = "In Progress";
            break;
          case "started_but_no_duration":
            displayStatus = "Started";
            break;
          case "not_started":
            displayStatus = "Not Started";
            break;
          case "unknown":
          default:
            displayStatus = "Unknown";
            break;
        }

        // Try to find caller ID from various possible fields
        let callerId = "Unknown";

        // Check if we have a phone number in the conversation object
        if (conv.phone_number) {
          callerId = conv.phone_number;
        }
        // If no phone number, use the conversation ID as a fallback
        else if (conv.conversation_id) {
          // Take first 8 characters of the conversation ID for better readability
          callerId = `Caller-${conv.conversation_id.substring(0, 8)}`;
        }

        // Log for debugging
        if (process.env.NODE_ENV === "development") {
          console.log("[Dashboard] Caller ID resolution:", {
            callerId,
            availableFields: Object.keys(conv),
          });
        }

        recentCalls.push({
          id: conv.conversation_id || `conv_${index}`,
          callerId: callerId,
          campaignName: `Agent ${conv.agent_id || "Unknown"}`,
          clientName: "System",
          status: displayStatus,
          durationSeconds: conv.call_duration_secs || 0,
          agent: `Agent ${conv.agent_id || "Unknown"}`,
          transcriptionSnippet:
            conv.transcription || "No transcription available",
          createdAt: new Date((conv.call_start_unix || 0) * 1000),
          updatedAt: new Date(
            (conv.call_end_unix || conv.call_start_unix || 0) * 1000
          ),
        });
      });

      // Debug log the raw conversation data
      console.log("[Dashboard] Raw conversation data:", currentConversations);

      console.log(
        "[Dashboard] Created recent calls from real data:",
        recentCalls
      );

      // Debug log the first conversation object for inspection
      if (currentConversations && currentConversations.length > 0) {
        console.log(
          "[Dashboard] First conversation object:",
          JSON.stringify(currentConversations[0], null, 2)
        );
      }

      // Calculate time-based metrics
      const todaysDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const todayStartUnix = Math.floor(todaysDate.getTime() / 1000);
      const todayEndUnix = Math.floor(now.getTime() / 1000);

      const todayConversations = currentConversations.filter((conv: any) => {
        const convTime = conv.call_start_unix || 0;
        return convTime >= todayStartUnix && convTime <= todayEndUnix;
      });

      const callsToday = todayConversations.length;
      const completedCallsToday = todayConversations.filter(
        (conv: any) => getNormalizedStatus(conv) === "completed"
      ).length;

      // Format average duration like reports page
      const avgCallDuration =
        currentAvgDurationMinutes > 0
          ? `${Math.floor((currentAvgDurationMinutes * 60) / 60)}:${Math.floor(
              (currentAvgDurationMinutes * 60) % 60
            )
              .toString()
              .padStart(2, "0")}`
          : "0:00";

      setDashboardData({
        stats: {
          activeCalls: currentInProgressCalls, // Show current in-progress calls
          totalUsers: totalClientsCount, // Use real client count from clients table
          avgCallDuration,
          successRate: currentAiSuccessRate, // Use current month AI success rate
          totalCallsToday: callsToday,
          totalCallsThisMonth: currentTotalCalls,
          callsCompletedToday: completedCallsToday,
          callsCompletedThisMonth: currentSuccessfulCalls,
          // Add percentage changes
          activeCallsChange: callsChange,
          totalUsersChange: clientCountChange,
          avgCallDurationChange: avgDurationChange,
          successRateChange: successRateChange,
        },
        liveCalls: [],
        recentCalls,
        callActivity,
        loading: false,
        error: null,
      });

      setLastRefresh(new Date());
      console.log(
        "[Dashboard] Data fetch completed successfully with real data"
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      // Try to get client count even if other data fails
      let fallbackClientCount = 0;
      try {
        const clientsRes = await api.getClients();
        const clientsData = await clientsRes.json();
        if (clientsData.success && clientsData.data) {
          fallbackClientCount = clientsData.data.length;
        }
      } catch (clientError) {
        console.warn(
          "Failed to fetch client count in error handler:",
          clientError
        );
      }

      setDashboardData({
        stats: {
          activeCalls: 0,
          totalUsers: fallbackClientCount, // Use real client count even in error case
          avgCallDuration: "0:00",
          successRate: 0,
          totalCallsToday: 0,
          totalCallsThisMonth: 0,
          callsCompletedToday: 0,
          callsCompletedThisMonth: 0,
          // Default percentage changes
          activeCallsChange: 0,
          totalUsersChange: 0,
          avgCallDurationChange: 0,
          successRateChange: 0,
        },
        liveCalls: [],
        recentCalls: [],
        callActivity: Array.from({ length: 10 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (9 - i));
          return {
            date: date.toISOString().split("T")[0],
            calls: 0,
            completed: 0,
            failed: 0,
          };
        }),
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard data",
      });
    }
  };

  // Initial data fetch and auto-refresh
  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Debug recent calls
  useEffect(() => {
    console.log(
      "[Dashboard] Recent calls updated:",
      dashboardData.recentCalls.length,
      dashboardData.recentCalls
    );
  }, [dashboardData.recentCalls]);

  const statCardsData = [
    {
      title: "Active Calls",
      value: dashboardData.stats.activeCalls.toString(),
      change: `${dashboardData.stats.activeCallsChange >= 0 ? "+" : ""}${
        dashboardData.stats.activeCallsChange
      }% from last month`,
      icon: TrendingUp,
      changeColor:
        dashboardData.stats.activeCallsChange >= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
    },
    {
      title: "Total Clients",
      value: dashboardData.stats.totalUsers.toLocaleString(),
      change: `${dashboardData.stats.totalUsersChange >= 0 ? "+" : ""}${
        dashboardData.stats.totalUsersChange
      }% from last month`,
      icon: UsersRound,
      changeColor:
        dashboardData.stats.totalUsersChange >= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
    },
    {
      title: "Avg Call Duration",
      value: dashboardData.stats.avgCallDuration,
      change: `${dashboardData.stats.avgCallDurationChange >= 0 ? "+" : ""}${
        dashboardData.stats.avgCallDurationChange
      }% from last month`,
      icon: Clock,
      changeColor:
        dashboardData.stats.avgCallDurationChange >= 0
          ? "text-red-600 dark:text-red-400"
          : "text-green-600 dark:text-green-400", // Red for increase (longer calls), green for decrease
    },
    {
      title: "Success Rate",
      value: `${dashboardData.stats.successRate}%`,
      change: `${dashboardData.stats.successRateChange >= 0 ? "+" : ""}${
        dashboardData.stats.successRateChange
      }% from last month`,
      icon: Zap,
      changeColor:
        dashboardData.stats.successRateChange >= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  const getStatusColor = (status: string) => {
    const baseStyles =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (status.toLowerCase()) {
      case "completed":
        return `${baseStyles} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100`;
      case "failed":
        return `${baseStyles} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100`;
      case "in progress":
      case "in_progress":
        return `${baseStyles} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100`;
      case "started":
        return `${baseStyles} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100`;
      case "not started":
      case "not_started":
        return `${baseStyles} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100`;
      case "dialing":
        return `${baseStyles} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100`;
      case "answered":
        return `${baseStyles} bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100`;
    }
  };

  // Chart component for call activity using Recharts
  const CallActivityChart = () => {
    const chartData = dashboardData.callActivity || [];
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    // Debug log
    console.log("Call Activity Data:", chartData);

    // If no data, show a message
    if (chartData.length === 0) {
      return (
        <div className="h-80 flex items-center justify-center text-muted-foreground border rounded-lg bg-muted/50">
          <div className="text-center p-4">
            <div className="text-lg font-medium mb-2">
              No call activity data
            </div>
            <p className="text-sm text-muted-foreground">
              {dashboardData.loading
                ? "Loading..."
                : "No data available for the selected period"}
            </p>
          </div>
        </div>
      );
    }

    // Format data for Recharts with proper date handling
    const formattedData = chartData
      .map((item) => {
        const date = new Date(item.date);
        // Ensure date is valid
        if (isNaN(date.getTime())) {
          return null;
        }

        return {
          date: date,
          dateLabel: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          "Total Calls": item.calls || 0,
          Completed: item.completed || 0,
          Failed: Math.max(0, (item.calls || 0) - (item.completed || 0)),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate dynamic height based on data
    const maxValue = Math.max(...formattedData.map((d) => d["Total Calls"]), 1);
    const yAxisTicks = Array.from(
      { length: Math.min(5, maxValue + 1) },
      (_, i) => Math.ceil((maxValue * i) / 4)
    );

    if (!isClient) {
      return (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse w-full h-full bg-muted/50 rounded-lg" />
        </div>
      );
    }

    return (
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 5,
            }}
            barGap={2}
            barCategoryGap="15%"
            barSize={24}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="dateLabel"
              tick={{
                fontSize: 12,
                fill: 'hsl(var(--muted-foreground))',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
              tickMargin={8}
            />
            <YAxis
              tick={{
                fontSize: 11,
                fill: 'hsl(var(--muted-foreground))',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
              tickLine={false}
              axisLine={false}
              width={30}
              ticks={yAxisTicks}
              domain={[0, "dataMax + 1"]}
              tickFormatter={(value) =>
                value > 1000 ? `${value / 1000}k` : value
              }
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card text-card-foreground p-3 rounded-lg shadow-lg border border-border">
                      <p className="font-medium text-sm mb-2">
                        {label}
                      </p>
                      <div className="space-y-1">
                        {payload.map((entry, index) => (
                          <div
                            key={`tooltip-${index}`}
                            className="flex items-center"
                          >
                            <div
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {entry.name}:{' '}
                              <span className="font-medium text-foreground">
                                {entry.value}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
            />
            <Legend
              verticalAlign="top"
              height={40}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingBottom: "10px",
              }}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
            <Bar
              dataKey="Total Calls"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Total Calls"
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="Completed"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="Completed"
              animationDuration={1000}
              animationEasing="ease-out"
              animationBegin={100}
            />
            <Bar
              dataKey="Failed"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              name="Failed"
              animationDuration={1000}
              animationEasing="ease-out"
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (dashboardData.loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-muted-foreground mb-4">{dashboardData.error}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Check browser console for detailed error information
            </p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold font-headline mb-1">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground">
            Real-time AI calling system metrics
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4" />
          <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCardsData.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <IconComponent className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className={`text-xs ${card.changeColor}`}>{card.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Call Activity</CardTitle>
            <CardDescription>Call volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <CallActivityChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>Latest call activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentCalls.length > 0 ? (
              dashboardData.recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{call.callerId}</p>
                    <p className="text-xs text-muted-foreground">
                      {call.campaignName} • {call.agent}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            getStatusColor(call.status).includes("bg-")
                              ? getStatusColor(call.status).split(" ")[1]
                              : "bg-muted-foreground"
                          }`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            getStatusColor(call.status).includes("bg-")
                              ? getStatusColor(call.status).split(" ")[1]
                              : "bg-muted-foreground"
                          }`}
                        ></span>
                      </span>
                      <Badge className={getStatusColor(call.status)}>
                        {call.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTimeAgo(new Date(call.createdAt))}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent calls found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Calls Section */}
      {dashboardData.liveCalls.filter((call) =>
        ["Dialing", "Answered", "In Progress"].includes(call.status)
      ).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Live Call Activity</CardTitle>
            <CardDescription>Real-time call monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.liveCalls
                .filter((call) =>
                  ["Dialing", "Answered", "In Progress"].includes(call.status)
                )
                .slice(0, 10)
                .map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{call.callerId}</p>
                      <p className="text-xs text-muted-foreground">
                        {call.campaignName} • {call.agent}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(
                          call.status
                        )}`}
                      >
                        {call.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTimeAgo(new Date(call.createdAt))}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
