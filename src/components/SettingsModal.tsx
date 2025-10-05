import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  User, 
  Palette, 
  Shield, 
  Bell, 
  Download, 
  Upload, 
  Trash2, 
  Moon, 
  Sun, 
  Monitor,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Keyboard,
  Globe,
  Zap,
  Contrast,
  Square
} from "lucide-react";
import { useTheme, themeConfig, type ThemeVariant } from "@/contexts/ThemeContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const { theme: currentTheme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    soundEnabled: true,
    animationsEnabled: true,
    compactMode: false,
    showTypingIndicator: true,
    language: "en",
    fontSize: "medium",
    autoSave: true,
    notifications: true,
    userName: "User",
    aiModel: "gpt-4"
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "general", label: "General", icon: <Settings className="h-4 w-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
    { id: "account", label: "Account", icon: <User className="h-4 w-4" /> },
    { id: "privacy", label: "Privacy", icon: <Shield className="h-4 w-4" /> },
    { id: "advanced", label: "Advanced", icon: <Zap className="h-4 w-4" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] bg-gray-900/95 backdrop-blur-sm border-gray-700 p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800/50 border-r border-gray-700 p-4">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                Settings
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Customize your Grok experience
              </DialogDescription>
            </DialogHeader>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "general" && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                      
                      <div className="grid gap-6">
                        <Card className="bg-gray-800/30 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Globe className="h-5 w-5" />
                              Language & Region
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="language" className="text-gray-300">Interface Language</Label>
                              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="de">German</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-800/30 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Bell className="h-5 w-5" />
                              Notifications
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-gray-300">Enable Notifications</Label>
                                <p className="text-sm text-gray-400">Receive notifications for new messages</p>
                              </div>
                              <Switch 
                                checked={settings.notifications}
                                onCheckedChange={(checked) => updateSetting('notifications', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-gray-300">Sound Effects</Label>
                                <p className="text-sm text-gray-400">Play sounds for interactions</p>
                              </div>
                              <Switch 
                                checked={settings.soundEnabled}
                                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "appearance" && (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Appearance & Display</h3>
                      
                      <div className="grid gap-6">
                        <Card className="surface-elevated">
                          <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                              <Palette className="h-5 w-5" />
                              Theme Variants
                            </CardTitle>
                            <CardDescription className="text-foreground-muted">
                              Choose from our curated noir theme collection
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Object.entries(themeConfig).map(([themeKey, config]) => {
                                const isActive = currentTheme === themeKey;
                                const getThemeIcon = (key: string) => {
                                  switch (key) {
                                    case 'noir': return <Moon className="h-4 w-4" />;
                                    case 'pure-noir': return <Square className="h-4 w-4 fill-current" />;
                                    case 'high-contrast': return <Contrast className="h-4 w-4" />;
                                    case 'mono-pro': return <Monitor className="h-4 w-4" />;
                                    default: return <Palette className="h-4 w-4" />;
                                  }
                                };
                                
                                return (
                                  <motion.button
                                    key={themeKey}
                                    onClick={() => setTheme(themeKey as ThemeVariant)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex flex-col items-start gap-3 p-4 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group ${
                                      isActive
                                        ? "border-primary bg-primary/5 shadow-lg"
                                        : "border-border bg-background-alt/30 hover:border-border-strong hover:bg-background-alt/60"
                                    }`}
                                  >
                                    {/* Theme preview bar */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-foreground/30 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="flex items-center gap-3 w-full">
                                      <div className={`p-2 rounded-xl transition-all ${
                                        isActive 
                                          ? "bg-primary/20 text-primary" 
                                          : "bg-accent/30 text-foreground-muted group-hover:text-foreground"
                                      }`}>
                                        {getThemeIcon(themeKey)}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className={`font-bold text-sm ${
                                            isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                                          }`}>
                                            {config.name}
                                          </span>
                                          <span className="text-lg">{config.icon}</span>
                                        </div>
                                        <p className="text-xs text-foreground-muted group-hover:text-foreground-dim transition-colors">
                                          {config.description}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {/* Active indicator */}
                                    {isActive && (
                                      <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"
                                      />
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-800/30 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white">Display Options</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-gray-300">Compact Mode</Label>
                                <p className="text-sm text-gray-400">Reduce spacing and padding</p>
                              </div>
                              <Switch 
                                checked={settings.compactMode}
                                onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-gray-300">Animations</Label>
                                <p className="text-sm text-gray-400">Enable smooth animations</p>
                              </div>
                              <Switch 
                                checked={settings.animationsEnabled}
                                onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
                              />
                            </div>
                            
                            <div>
                              <Label className="text-gray-300">Font Size</Label>
                              <Select value={settings.fontSize} onValueChange={(value) => updateSetting('fontSize', value)}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="small">Small</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "account" && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                      
                      <div className="grid gap-6">
                        <Card className="bg-gray-800/30 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Profile
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="userName" className="text-gray-300">Display Name</Label>
                              <Input
                                id="userName"
                                value={settings.userName}
                                onChange={(e) => updateSetting('userName', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="Enter your display name"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-800/30 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Download className="h-5 w-5" />
                              Data Management
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-gray-300">Auto-save Conversations</Label>
                                <p className="text-sm text-gray-400">Automatically save your chat history</p>
                              </div>
                              <Switch 
                                checked={settings.autoSave}
                                onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                              />
                            </div>
                            
                            <Separator className="bg-gray-700" />
                            
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                                <Download className="h-4 w-4 mr-2" />
                                Export Data
                              </Button>
                              <Button variant="outline" className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                                <Upload className="h-4 w-4 mr-2" />
                                Import Data
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "privacy" && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Privacy & Security</h3>
                      
                      <Card className="bg-gray-800/30 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Privacy Controls
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-gray-300">Show Typing Indicator</Label>
                              <p className="text-sm text-gray-400">Show when you're typing a message</p>
                            </div>
                            <Switch 
                              checked={settings.showTypingIndicator}
                              onCheckedChange={(checked) => updateSetting('showTypingIndicator', checked)}
                            />
                          </div>
                          
                          <Separator className="bg-gray-700" />
                          
                          <Button 
                            variant="destructive" 
                            className="w-full bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All Chat History
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}

                {activeTab === "advanced" && (
                  <motion.div
                    key="advanced"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Advanced Settings</h3>
                      
                      <Card className="bg-gray-800/30 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            AI Model Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-gray-300">Preferred AI Model</Label>
                            <Select value={settings.aiModel} onValueChange={(value) => updateSetting('aiModel', value)}>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                                <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="claude">Claude</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-sm text-gray-400 mt-1">Choose the AI model for responses</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700 p-6 bg-gray-800/20">
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;