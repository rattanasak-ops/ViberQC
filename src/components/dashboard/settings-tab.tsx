"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Globe,
  Clock,
  Bell,
  Palette,
  Save,
  Check,
  FolderKanban,
  GitBranch,
  Key,
  Upload,
  Download,
} from "lucide-react";

interface ProjectConfig {
  projectName: string;
  projectUrl: string;
  techStack: string;
  githubRepo: string;
  scanFrequency: string;
  notifications: boolean;
  autoScan: boolean;
}

const defaultConfig: ProjectConfig = {
  projectName: "ViberQC",
  projectUrl: "https://",
  techStack: "Next.js + React + TypeScript",
  githubRepo: "",
  scanFrequency: "weekly",
  notifications: true,
  autoScan: false,
};

export function SettingsTab() {
  const [config, setConfig] = useState<ProjectConfig>(defaultConfig);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Save to localStorage for now
    localStorage.setItem("viberqc-config", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExport() {
    const data = {
      config,
      checklist: localStorage.getItem("viberqc-checklist"),
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viberqc-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.config) {
            setConfig(data.config);
          }
          if (data.checklist) {
            localStorage.setItem("viberqc-checklist", data.checklist);
          }
        } catch {
          alert("Invalid file format");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  const sections = [
    {
      title: "Project Information",
      titleTh: "ข้อมูลโปรเจกต์",
      icon: FolderKanban,
      color: "#6C63FF",
      fields: [
        { key: "projectName" as const, label: "Project Name", labelTh: "ชื่อโปรเจกต์", icon: FolderKanban, placeholder: "My Project" },
        { key: "projectUrl" as const, label: "Project URL", labelTh: "URL โปรเจกต์", icon: Globe, placeholder: "https://my-app.com" },
        { key: "techStack" as const, label: "Tech Stack", labelTh: "เทคโนโลยีที่ใช้", icon: Settings, placeholder: "Next.js + React + TypeScript" },
        { key: "githubRepo" as const, label: "GitHub Repository", labelTh: "GitHub Repository", icon: GitBranch, placeholder: "username/repo" },
      ],
    },
    {
      title: "Scan Settings",
      titleTh: "ตั้งค่าการสแกน",
      icon: Clock,
      color: "#22C55E",
      fields: [],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ตั้งค่าโปรเจกต์และการสแกน
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Project Information */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span>Project Information</span>
                <p className="text-xs font-normal text-muted-foreground">ข้อมูลโปรเจกต์</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections[0].fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <field.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {field.label}
                  <span className="text-xs text-muted-foreground">({field.labelTh})</span>
                </Label>
                <Input
                  value={config[field.key]}
                  onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Scan Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <Clock className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <span>Scan Settings</span>
                <p className="text-xs font-normal text-muted-foreground">ตั้งค่าการสแกน</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Scan Frequency
                <span className="text-xs text-muted-foreground">(ความถี่การสแกน)</span>
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {["manual", "daily", "weekly", "monthly"].map((freq) => (
                  <button
                    key={freq}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      config.scanFrequency === freq
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                    onClick={() => setConfig({ ...config, scanFrequency: freq })}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">แจ้งเตือนผลสแกนทาง email</p>
                </div>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.notifications ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => setConfig({ ...config, notifications: !config.notifications })}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    config.notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Auto Scan on Deploy</p>
                  <p className="text-xs text-muted-foreground">สแกนอัตโนมัติเมื่อ deploy</p>
                </div>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.autoScan ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => setConfig({ ...config, autoScan: !config.autoScan })}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    config.autoScan ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API & Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Key className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <span>API & Integrations</span>
                <p className="text-xs font-normal text-muted-foreground">API และการเชื่อมต่อ</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Cursor IDE</p>
                    <p className="text-xs text-muted-foreground">เชื่อมต่อกับ Cursor สำหรับ AI-assisted QC</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Coming Soon
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">VS Code Extension</p>
                    <p className="text-xs text-muted-foreground">Real-time QC warnings ใน editor</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Coming Soon
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">GitHub App</p>
                    <p className="text-xs text-muted-foreground">QC score บน PR comments</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Coming Soon
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">LINE Notify</p>
                    <p className="text-xs text-muted-foreground">แจ้งเตือนผ่าน LINE เมื่อ score เปลี่ยน</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Coming Soon
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Slack Integration</p>
                    <p className="text-xs text-muted-foreground">QC alerts ใน Slack channels</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button onClick={handleSave} className="px-8">
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
