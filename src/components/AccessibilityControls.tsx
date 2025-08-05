'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  TextCursorInput, 
  MousePointer,
  Keyboard,
  Palette,
  Moon,
  Sun
} from 'lucide-react'
import { toast } from 'sonner'

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  colorBlind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  fontSize: number
  announcements: boolean
}

export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    colorBlind: 'none',
    fontSize: 16,
    announcements: true
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
        applySettings(parsed)
      } catch (error) {
        console.error('Error loading accessibility settings:', error)
      }
    }
  }, [])

  // Apply settings to the document
  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement
    
    // High contrast
    if (newSettings.highContrast) {
      root.style.setProperty('--background', '#000000')
      root.style.setProperty('--foreground', '#ffffff')
      root.style.setProperty('--primary', '#ffffff')
      root.style.setProperty('--primary-foreground', '#000000')
    } else {
      root.style.removeProperty('--background')
      root.style.removeProperty('--foreground')
      root.style.removeProperty('--primary')
      root.style.removeProperty('--primary-foreground')
    }

    // Font size
    root.style.setProperty('--font-size', `${newSettings.fontSize}px`)
    document.body.style.fontSize = `${newSettings.fontSize}px`

    // Large text
    if (newSettings.largeText) {
      root.style.setProperty('--text-scale', '1.2')
    } else {
      root.style.removeProperty('--text-scale')
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s')
      root.style.setProperty('--transition-duration', '0s')
    } else {
      root.style.removeProperty('--animation-duration')
      root.style.removeProperty('--transition-duration')
    }

    // Color blind filters
    const colorBlindFilters = {
      none: 'none',
      protanopia: 'url(#protanopia)',
      deuteranopia: 'url(#deuteranopia)',
      tritanopia: 'url(#tritanopia)'
    }
    
    // Remove existing SVG filters
    const existingFilters = document.getElementById('colorblind-filters')
    if (existingFilters) {
      existingFilters.remove()
    }

    if (newSettings.colorBlind !== 'none') {
      // Add SVG filters for color blindness
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('id', 'colorblind-filters')
      svg.style.display = 'none'
      
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      
      // Protanopia filter
      const protanopia = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
      protanopia.setAttribute('id', 'protanopia')
      protanopia.innerHTML = `
        <feColorMatrix type=\"matrix\" values=\"0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0\"/>
      `
      
      // Deuteranopia filter
      const deuteranopia = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
      deuteranopia.setAttribute('id', 'deuteranopia')
      deuteranopia.innerHTML = `
        <feColorMatrix type=\"matrix\" values=\"0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0\"/>
      `
      
      // Tritanopia filter
      const tritanopia = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
      tritanopia.setAttribute('id', 'tritanopia')
      tritanopia.innerHTML = `
        <feColorMatrix type=\"matrix\" values=\"0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0\"/>
      `
      
      defs.appendChild(protanopia)
      defs.appendChild(deuteranopia)
      defs.appendChild(tritanopia)
      svg.appendChild(defs)
      document.head.appendChild(svg)
      
      // Apply filter to body
      document.body.style.filter = colorBlindFilters[newSettings.colorBlind]
    } else {
      document.body.style.filter = 'none'
    }

    // Keyboard navigation
    if (newSettings.keyboardNavigation) {
      document.body.setAttribute('tabindex', '0')
      // Add keyboard navigation hints
      addKeyboardNavigationHints()
    } else {
      document.body.removeAttribute('tabindex')
      removeKeyboardNavigationHints()
    }
  }

  // Save settings to localStorage and apply them
  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings))
    applySettings(newSettings)
    
    // Announce change for screen readers
    if (settings.announcements) {
      announceSettingChange(key, value)
    }
  }

  const announceSettingChange = (key: string, value: any) => {
    const messages = {
      highContrast: `High contrast ${value ? 'enabled' : 'disabled'}`,
      largeText: `Large text ${value ? 'enabled' : 'disabled'}`,
      reducedMotion: `Reduced motion ${value ? 'enabled' : 'disabled'}`,
      screenReader: `Screen reader mode ${value ? 'enabled' : 'disabled'}`,
      keyboardNavigation: `Keyboard navigation ${value ? 'enabled' : 'disabled'}`,
      colorBlind: `Color blind mode set to ${value}`,
      fontSize: `Font size set to ${value}px`,
      announcements: `Announcements ${value ? 'enabled' : 'disabled'}`
    }
    
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = messages[key as keyof typeof messages]
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  const addKeyboardNavigationHints = () => {
    const hints = document.createElement('div')
    hints.id = 'keyboard-hints'
    hints.className = 'fixed bottom-4 right-4 bg-background border rounded-lg p-4 text-sm max-w-xs z-50'
    hints.innerHTML = `
      <h4 class=\"font-semibold mb-2\">Keyboard Navigation</h4>
      <ul class=\"space-y-1\">
        <li><kbd>Tab</kbd> - Navigate elements</li>
        <li><kbd>Enter</kbd> - Activate buttons</li>
        <li><kbd>Space</kbd> - Toggle switches</li>
        <li><kbd>Arrow Keys</kbd> - Adjust sliders</li>
        <li><kbd>Escape</kbd> - Close dialogs</li>
      </ul>
    `
    document.body.appendChild(hints)
  }

  const removeKeyboardNavigationHints = () => {
    const hints = document.getElementById('keyboard-hints')
    if (hints) {
      hints.remove()
    }
  }

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: false,
      colorBlind: 'none',
      fontSize: 16,
      announcements: true
    }
    
    setSettings(defaultSettings)
    localStorage.removeItem('accessibilitySettings')
    applySettings(defaultSettings)
    toast.success('Accessibility settings reset to default')
  }

  if (!isOpen) {
    return (
      <Button
        variant=\"outline\"
        size=\"sm\"
        onClick={() => setIsOpen(true)}
        className=\"fixed bottom-4 right-4 z-50 shadow-lg\"
      >
        <Keyboard className=\"h-4 w-4 mr-2\" />
        Accessibility
      </Button>
    )
  }

  return (
    <div className=\"fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto\">
      <Card>
        <CardHeader>
          <div className=\"flex items-center justify-between\">
            <div>
              <CardTitle className=\"flex items-center gap-2\">
                <Keyboard className=\"h-5 w-5\" />
                Accessibility Settings
              </CardTitle>
              <CardDescription>
                Customize the interface for your needs
              </CardDescription>
            </div>
            <Button
              variant=\"ghost\"
              size=\"sm\"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className=\"space-y-6\">
          {/* Visual Settings */}
          <div className=\"space-y-4\">
            <h3 className=\"font-semibold flex items-center gap-2\">
              <Eye className=\"h-4 w-4\" />
              Visual Settings
            </h3>
            
            <div className=\"flex items-center justify-between\">
              <div className=\"space-y-0.5\">
                <Label>High Contrast</Label>
                <p className=\"text-xs text-muted-foreground\">Increase color contrast</p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>
            
            <div className=\"flex items-center justify-between\">
              <div className=\"space-y-0.5\">
                <Label>Large Text</Label>
                <p className=\"text-xs text-muted-foreground\">Increase text size</p>
              </div>
              <Switch
                checked={settings.largeText}
                onCheckedChange={(checked) => updateSetting('largeText', checked)}
              />
            </div>
            
            <div className=\"space-y-2\">
              <Label>Font Size: {settings.fontSize}px</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => updateSetting('fontSize', value[0])}
                max={24}
                min={12}
                step={1}
                className=\"w-full\"
              />
            </div>
            
            <div className=\"space-y-2\">
              <Label>Color Blind Mode</Label>
              <div className=\"grid grid-cols-2 gap-2\">
                {(['none', 'protanopia', 'deuteranopia', 'tritanopia'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={settings.colorBlind === type ? 'default' : 'outline'}
                    size=\"sm\"
                    onClick={() => updateSetting('colorBlind', type)}
                    className=\"capitalize\"
                  >
                    {type === 'none' ? 'None' : type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Motion Settings */}
          <div className=\"space-y-4\">
            <h3 className=\"font-semibold flex items-center gap-2\">
              <MousePointer className=\"h-4 w-4\" />
              Motion Settings
            </h3>
            
            <div className=\"flex items-center justify-between\">
              <div className=\"space-y-0.5\">
                <Label>Reduced Motion</Label>
                <p className=\"text-xs text-muted-foreground\">Minimize animations</p>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Navigation Settings */}
          <div className=\"space-y-4\">
            <h3 className=\"font-semibold flex items-center gap-2\">
              <Keyboard className=\"h-4 w-4\" />
              Navigation Settings
            </h3>
            
            <div className=\"flex items-center justify-between\">
              <div className=\"space-y-0.5\">
                <Label>Keyboard Navigation</Label>
                <p className=\"text-xs text-muted-foreground\">Enable keyboard shortcuts</p>
              </div>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
              />
            </div>
            
            <div className=\"flex items-center justify-between\">
              <div className=\"space-y-0.5\">
                <Label>Screen Reader</Label>
                <p className=\"text-xs text-muted-foreground\">Optimize for screen readers</p>
              </div>
              <Switch
                checked={settings.screenReader}
                onCheckedChange={(checked) => updateSetting('screenReader', checked)}
              />
            </div>
            
            <div className=\"flex items-center justify-between\">
              <div className=\"space-y-0.5\">
                <Label>Announcements</Label>
                <p className=\"text-xs text-muted-foreground\">Announce setting changes</p>
              </div>
              <Switch
                checked={settings.announcements}
                onCheckedChange={(checked) => updateSetting('announcements', checked)}
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Actions */}
          <div className=\"space-y-2\">
            <Button onClick={resetSettings} variant=\"outline\" className=\"w-full\">
              Reset to Default
            </Button>
            <Button onClick={() => setIsOpen(false)} className=\"w-full\">
              Close Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}