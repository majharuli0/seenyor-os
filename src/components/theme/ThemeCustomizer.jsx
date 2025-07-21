import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Settings,
  Upload,
  RotateCcw,
  Save,
  Palette,
  Sun,
  Moon
} from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

import {
  selectTheme,
  setThemeMode,
  setPrimaryColor,
  setBrandColors,
  setCustomBranding,
  setBorderRadius,
  setFontSize,
  resetTheme,
} from '../../store/slices/themeSlice';

const ThemeCustomizer = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [localBranding, setLocalBranding] = useState(theme.customBranding);

  const handleThemeModeChange = (checked) => {
    dispatch(setThemeMode(checked ? 'dark' : 'light'));
  };

  const handlePrimaryColorChange = (color) => {
    dispatch(setPrimaryColor(color));
  };

  const handleBrandColorChange = (colorType, color) => {
    dispatch(setBrandColors({
      [colorType]: color
    }));
  };

  const handleBorderRadiusChange = (value) => {
    dispatch(setBorderRadius(value[0]));
  };

  const handleFontSizeChange = (value) => {
    dispatch(setFontSize(value));
  };

  const handleBrandingChange = (field, value) => {
    const newBranding = { ...localBranding, [field]: value };
    setLocalBranding(newBranding);
    dispatch(setCustomBranding(newBranding));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleBrandingChange('logo', e.target.result);
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetTheme = () => {
    dispatch(resetTheme());
    setLocalBranding({
      logo: null,
      favicon: null,
      companyName: 'Seenyor OS',
      customCSS: '',
    });
    toast.success('Theme reset to default');
  };

  const handleSaveTheme = () => {
    // In a real application, this would save the theme to the backend
    toast.success('Theme configuration saved');
  };

  const presetColors = [
    '#0ea5e9', // Sky Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#f97316', // Orange
  ];

  const ColorPicker = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-input cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm"
          placeholder="#000000"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {presetColors.map((color) => (
          <button
            key={color}
            className="w-6 h-6 rounded border border-input cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Theme Customizer
          </SheetTitle>
          <SheetDescription>
            Customize the appearance and branding of your application
          </SheetDescription>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetTheme}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              size="sm"
              onClick={handleSaveTheme}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Theme Mode */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Theme Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme.mode === 'dark' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <Label>Dark Mode</Label>
                </div>
                <Switch
                  checked={theme.mode === 'dark'}
                  onCheckedChange={handleThemeModeChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Primary Color */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Primary Color</CardTitle>
              <CardDescription className="text-sm">
                This color will be used for buttons, links, and other primary elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColorPicker
                value={theme.primaryColor}
                onChange={handlePrimaryColorChange}
                label="Primary Color"
              />
            </CardContent>
          </Card>

          {/* Brand Colors */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Brand Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker
                  value={theme.brandColors.success}
                  onChange={(color) => handleBrandColorChange('success', color)}
                  label="Success"
                />
                <ColorPicker
                  value={theme.brandColors.warning}
                  onChange={(color) => handleBrandColorChange('warning', color)}
                  label="Warning"
                />
                <ColorPicker
                  value={theme.brandColors.error}
                  onChange={(color) => handleBrandColorChange('error', color)}
                  label="Error"
                />
                <ColorPicker
                  value={theme.brandColors.secondary}
                  onChange={(color) => handleBrandColorChange('secondary', color)}
                  label="Secondary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select value={theme.fontSize} onValueChange={handleFontSizeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (12px)</SelectItem>
                    <SelectItem value="medium">Medium (14px)</SelectItem>
                    <SelectItem value="large">Large (16px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Border Radius */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Border Radius</CardTitle>
              <CardDescription className="text-sm">
                Controls the roundness of buttons, cards, and other elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={[theme.borderRadius]}
                  onValueChange={handleBorderRadiusChange}
                  max={20}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0px</span>
                  <span>6px</span>
                  <span>12px</span>
                  <span>20px</span>
                </div>
                <Badge variant="outline">{theme.borderRadius}px</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Custom Branding */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Custom Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={localBranding.companyName}
                  onChange={(e) => handleBrandingChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </Button>
                  {localBranding.logo && (
                    <img 
                      src={localBranding.logo} 
                      alt="logo" 
                      className="h-8 w-8 object-contain rounded border"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom CSS</Label>
                <Textarea
                  value={localBranding.customCSS}
                  onChange={(e) => handleBrandingChange('customCSS', e.target.value)}
                  placeholder="Enter custom CSS rules"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Advanced: Add custom CSS for additional styling
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preview</CardTitle>
              <CardDescription className="text-sm">
                Preview of how buttons will look with current settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg border bg-muted/50 space-x-2">
                <Button 
                  style={{ 
                    backgroundColor: theme.primaryColor,
                    borderRadius: `${theme.borderRadius}px`
                  }}
                >
                  Primary Button
                </Button>
                <Button 
                  variant="outline"
                  style={{ borderRadius: `${theme.borderRadius}px` }}
                >
                  Default Button
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ThemeCustomizer;


