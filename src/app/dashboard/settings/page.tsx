
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ShieldCheck,
  Bell,
  Database,
  FileCode,
  Link as LinkIcon,
  BookUser,
  Cookie,
  Paintbrush,
  SettingsIcon,
  Building2,
  Users,
  CreditCard,
  Package,
  ChevronRight,
  Palette,
  Vibrate,
  CircleDot,
  Lightbulb,
  BellRing,
  Trash2,
  Wifi,
  BarChart3,
  Fingerprint,
  MessageSquareQuote,
  FileText,
  HelpCircle,
  Eye,
  Type,
  LogOut,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ThemeToggle } from '@/components/theme-toggle';

const SettingsItem = ({
  label,
  value,
  isSecret = false,
}: {
  label: string;
  value: string;
  isSecret?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border-b">
    <Label className="text-sm font-medium mb-1 sm:mb-0">{label}</Label>
    <div className="flex items-center gap-2">
      <Input
        readOnly
        value={value}
        type={isSecret ? 'password' : 'text'}
        className="w-full sm:w-auto bg-muted/50 border-0"
      />
      <Button variant="ghost" size="sm">
        Copy
      </Button>
    </div>
  </div>
);

const SettingsRow = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
}) => {
  const Icon = icon;
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your application and project settings.
        </p>
      </header>

      <div className="space-y-8">
        <Accordion type="multiple" className="space-y-8" defaultValue={['app-settings']}>
          {/* Application Settings */}
          <AccordionItem value="app-settings" className="border-b-0">
            <Card>
              <AccordionTrigger className="p-6 text-lg font-semibold [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Application Settings
                </div>
              </AccordionTrigger>
              <AccordionContent asChild>
                <CardContent className="pt-2 px-0">
                  <SettingsRow
                    icon={Palette}
                    title="Display"
                    description="Wallpaper, font size, dark mode"
                  >
                    <Button variant="outline" size="sm">
                      Customize <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </SettingsRow>
                  <SettingsRow
                    icon={Bell}
                    title="Notifications"
                    description="Tone, vibration, popups"
                  >
                     <Button variant="outline" size="sm">
                      Manage <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </SettingsRow>
                  <SettingsRow
                    icon={Database}
                    title="Storage and Data"
                    description="Network usage, auto-download"
                  >
                     <Button variant="outline" size="sm">
                      Manage <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </SettingsRow>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
          
           {/* Privacy and Security */}
          <AccordionItem value="privacy" className="border-b-0">
            <Card>
              <AccordionTrigger className="p-6 text-lg font-semibold [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Privacy & Security
                </div>
              </AccordionTrigger>
              <AccordionContent asChild>
                <CardContent className="pt-2 px-0">
                   <SettingsRow
                    icon={Eye}
                    title="Last Seen & Online"
                    description="Control who sees your activity"
                  >
                    <Switch />
                  </SettingsRow>
                   <SettingsRow
                    icon={MessageSquareQuote}
                    title="Read Receipts"
                    description="Let others know you've read their messages"
                  >
                    <Switch defaultChecked/>
                  </SettingsRow>
                   <SettingsRow
                    icon={Users}
                    title="Blocked Contacts"
                    description="Manage your blocked users"
                  >
                     <Button variant="outline" size="sm">
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </SettingsRow>
                   <SettingsRow
                    icon={Fingerprint}
                    title="App Lock"
                    description="Secure the app with your fingerprint"
                  >
                    <Switch />
                  </SettingsRow>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Project Settings */}
          <AccordionItem value="project-settings" className="border-b-0">
            <Card>
              <AccordionTrigger className="p-6 text-lg font-semibold [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Project Settings
                </div>
              </AccordionTrigger>
              <AccordionContent asChild>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4 px-1">
                    Basic information to identify your project.
                  </p>
                  <SettingsItem label="Project Name" value="AgriAssist" />
                  <SettingsItem
                    label="Project ID"
                    value="agriassist-prod-a1b2c"
                  />
                  <SettingsItem label="Project Number" value="123456789012" />
                  <SettingsItem
                    label="Contact Email"
                    value="contact@agriassist.com"
                  />
                   <div className="flex items-center justify-between p-3 border-b">
                      <Label className="text-sm font-medium">Billing</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Linked to: Personal Billing
                        </span>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* App Registration */}
          <AccordionItem value="app-registration" className="border-b-0">
            <Card>
              <AccordionTrigger className="p-6 text-lg font-semibold [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  App Registration
                </div>
              </AccordionTrigger>
              <AccordionContent asChild>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4 px-1">
                    Your apps connected to this Firebase project.
                  </p>
                  <SettingsItem label="Web App API Key" value="AIzaSy...4321" isSecret />
                  <SettingsItem label="Web App ID" value="1:1234...web:5678" />
                  <Separator className="my-4" />
                   <div className="flex items-center justify-between p-3">
                    <Label className="text-sm font-medium">Android App Config</Label>
                    <Button variant="outline" size="sm">Download google-services.json</Button>
                  </div>
                   <div className="flex items-center justify-between p-3 border-t">
                    <Label className="text-sm font-medium">iOS App Config</Label>
                    <Button variant="outline" size="sm">Download GoogleService-Info.plist</Button>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Integrations and Services */}
          <AccordionItem value="integrations" className="border-b-0">
            <Card>
              <AccordionTrigger className="p-6 text-lg font-semibold [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Integrations & Services
                </div>
              </AccordionTrigger>
              <AccordionContent asChild>
                <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-4 px-1">
                    Manage the Firebase services enabled for your project.
                  </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <Label className="flex items-center gap-2 font-medium"><Users className="h-4 w-4"/> Authentication</Label>
                            <span className="text-sm font-semibold text-primary">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <Label className="flex items-center gap-2 font-medium"><Database className="h-4 w-4"/> Firestore</Label>
                            <span className="text-sm font-semibold text-primary">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <Label className="flex items-center gap-2 font-medium"><FileCode className="h-4 w-4"/> Hosting</Label>
                            <span className="text-sm font-semibold text-primary">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <Label className="flex items-center gap-2 font-medium"><Bell className="h-4 w-4"/> Notifications (FCM)</Label>
                             <Button variant="secondary" size="sm">Enable</Button>
                        </div>
                   </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
          
           {/* Help & About */}
          <AccordionItem value="help-about" className="border-b-0">
            <Card>
              <AccordionTrigger className="p-6 text-lg font-semibold [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Help & About
                </div>
              </AccordionTrigger>
              <AccordionContent asChild>
                <CardContent className="pt-2 px-0">
                   <SettingsRow
                    icon={HelpCircle}
                    title="Help Center"
                    description="Find FAQs and contact support"
                  >
                     <Button variant="outline" size="sm">
                      Visit <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </SettingsRow>
                   <SettingsRow
                    icon={FileText}
                    title="Terms and Privacy Policy"
                    description="Read our terms of service"
                  >
                     <Button variant="outline" size="sm">
                      Read <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </SettingsRow>
                   <SettingsRow
                    icon={Cookie}
                    title="Legal & Cookies"
                    description="Manage your cookie settings"
                  >
                     <Button variant="outline" size="sm">
                      Manage <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </SettingsRow>
                  <div className="p-4 text-sm text-muted-foreground">
                    App Version: 1.0.0
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}
