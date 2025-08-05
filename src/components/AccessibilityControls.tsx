'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Keyboard, 
  Contrast, 
  TextCursorInput,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react'

interface AccessibilityControlsProps {
  onSettingsChange?: (settings: AccessibilitySettings) => void
}

export interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  colorBlindSupport: boolean
  textToSpeech: boolean
}

export function AccessibilityControls({ onSettingsChange }: AccessibilityControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    colorBlindSupport: false,
    textToSpeech: false
  })

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange?.(newSettings)
    
    // Apply settings to document
    applySettingToDocument(key, value)
  }

  const applySettingToDocument = (key: keyof AccessibilitySettings, value: any) => {
    const root = document.documentElement
    
    switch (key) {
      case 'fontSize':
        root.style.fontSize = `${value}px`
        break
      case 'highContrast':
        root.classList.toggle('high-contrast', value)
        break
      case 'reducedMotion':
        root.classList.toggle('reduced-motion', value)
        break
      case 'colorBlindSupport':
        root.classList.toggle('color-blind-support', value)
        break
    }
  }

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 16,
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: false,
      colorBlindSupport: false,
      textToSpeech: false
    }
    
    setSettings(defaultSettings)
    onSettingsChange?.(defaultSettings)
    
    // Reset document
    const root = document.documentElement
    root.style.fontSize = ''
    root.classList.remove('high-contrast', 'reduced-motion', 'color-blind-support')
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Accessibility className="h-4 w-4" />
        Accessibility
      </Button>
    )
  }

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Accessibility Settings
        </CardTitle>
        <CardDescription>
          Customize the simulation experience to match your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="interaction">Interaction</TabsTrigger>
            <TabsTrigger value="assistive">Assistive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <TextCursorInput className="h-4 w-4" />
                Font Size: {settings.fontSize}px
              </label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSetting('fontSize', value[0])}
                  max={24}
                  min={12}
                  step={1}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                High Contrast
              </label>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Color Blind Support
              </label>
              <Switch
                checked={settings.colorBlindSupport}
                onCheckedChange={(checked) => updateSetting('colorBlindSupport', checked)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="interaction" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                Reduced Motion
              </label>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Keyboard Navigation
              </label>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="assistive" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                Screen Reader Support
              </label>
              <Switch
                checked={settings.screenReader}
                onCheckedChange={(checked) => updateSetting('screenReader', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Text-to-Speech
              </label>
              <Switch
                checked={settings.textToSpeech}
                onCheckedChange={(checked) => updateSetting('textToSpeech', checked)}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="gap-2 flex-1"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button 
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
