"use client";

import { ClaudeChat } from "@/components/claude-chat";
import { Terminal } from "@/components/terminal";
import NativeTerminal from "@/components/NativeTerminal";
import { FileBrowserEnhanced } from "@/components/file-browser-enhanced";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { MacOSDock } from "@/components/macos-dock";
import {
  FinderIcon,
  MessagesIcon,
  TerminalIcon as MacTerminalIcon,
  SystemPreferencesIcon,
} from "@/components/macos-icons";
import { GlassEffect, GlassWindow, GlassFilter } from "@/components/ui/glass-effect";
import { Toaster } from "@/components/ui/sonner";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Apple, Wifi, Battery } from "lucide-react";

export function Desktop() {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [showClaude, setShowClaude] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showNativeTerminal, setShowNativeTerminal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const dockApps = [
    { id: "finder", name: "Finder", icon: <FinderIcon /> },
    { id: "claude", name: "mae", icon: <MessagesIcon /> },
    { id: "terminal", name: "Command Palette", icon: <MacTerminalIcon /> },
    { id: "native-terminal", name: "Terminal", icon: <MacTerminalIcon /> },
    { id: "settings", name: "System Preferences", icon: <SystemPreferencesIcon /> },
  ];

  return (
    <main
      className="h-screen w-screen overflow-hidden relative flex flex-col"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 30, 0.95), rgba(20, 20, 50, 0.95))`,
        backgroundColor: "#0a0a1e",
      }}
    >
      <GlassFilter />

      {/* Menu Bar */}
      <GlassEffect className="fixed top-0 left-0 right-0 h-7 z-[100] rounded-none">
        <div className="h-full w-full flex items-center justify-between px-4 text-white text-xs font-medium">
          <div className="flex items-center gap-4">
            <Apple className="w-4 h-4" />
            <span className="font-semibold">mae</span>
          </div>
          <div className="flex items-center gap-3">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </GlassEffect>

      {/* Desktop */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {activeApp === "finder" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute top-10 left-10 z-20"
            >
              <GlassWindow
                title="Files"
                onClose={() => setActiveApp(null)}
                className="w-[800px]"
              >
                <FileBrowserEnhanced />
              </GlassWindow>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <MacOSDock
        items={dockApps}
        activeItem={
          activeApp ||
          (showClaude
            ? "claude"
            : showTerminal
            ? "terminal"
            : showNativeTerminal
            ? "native-terminal"
            : null)
        }
        onItemClick={(item) => {
          if (item.id === "claude") {
            setShowClaude((prev) => !prev);
          } else if (item.id === "terminal") {
            setShowTerminal(true);
          } else if (item.id === "native-terminal") {
            setShowNativeTerminal(true);
          } else if (item.id === "settings") {
            // no-op for now
          } else {
            setActiveApp(activeApp === item.id ? null : item.id);
          }
        }}
      />

      <ClaudeChat
        position="bottom-right"
        size="lg"
        isOpen={showClaude}
        onClose={() => setShowClaude(false)}
      />
      <Terminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} />
      <NativeTerminal
        isOpen={showNativeTerminal}
        onClose={() => setShowNativeTerminal(false)}
      />

      <div style={{ display: "none" }}>
        <DarkModeToggle />
      </div>

      <Toaster position="top-center" />
    </main>
  );
}
