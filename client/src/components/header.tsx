import { useState } from "react";
import { CheckSquare, LogOut, Settings, Camera, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Header() {
  const { user, signOut } = useSupabaseAuth();
  const { profile, uploadAvatar, updateProfile, isUploadingAvatar, isUpdating } = useProfile();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [editName, setEditName] = useState('');

  const email = user?.email || '';
  const displayName = profile?.full_name || user?.user_metadata?.first_name || email.split('@')[0];
  const avatarUrl = profile?.avatar_url || null;

  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() || 'U';

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      setIsLoggingOut(false);
    } else {
      setLocation('/');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    uploadAvatar(file, {
      onSuccess: () => {
        toast({
          title: "Avatar updated",
          description: "Your profile photo has been updated.",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
    e.target.value = '';
  };

  const handleUpdateName = () => {
    if (editName.trim()) {
      updateProfile({ full_name: editName.trim() }, {
        onSuccess: () => {
          toast({
            title: "Profile updated",
            description: "Your name has been updated.",
          });
          setShowProfileSheet(false);
        },
        onError: (error: Error) => {
          toast({
            title: "Update failed",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const openProfileSheet = () => {
    setEditName(profile?.full_name || '');
    setShowProfileSheet(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight" data-testid="text-app-title">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="gap-2"
              data-testid="button-signout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </span>
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={avatarUrl || undefined}
                        alt={displayName}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={avatarUrl || undefined}
                        alt={displayName}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p
                        className="text-sm font-medium leading-none"
                        data-testid="text-user-name"
                      >
                        {displayName}
                      </p>
                      <p
                        className="text-xs text-muted-foreground leading-none"
                        data-testid="text-user-email"
                      >
                        {email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={openProfileSheet}
                    className="cursor-pointer"
                    data-testid="button-edit-profile"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                    data-testid="button-logout-dropdown"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <Sheet open={showProfileSheet} onOpenChange={setShowProfileSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>
              Update your profile photo and display name.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || undefined} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-avatar-file"
              />
              
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploadingAvatar}
                data-testid="button-upload-avatar"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Display Name</Label>
                <Input
                  id="fullName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  data-testid="input-display-name"
                />
              </div>
              <Button 
                className="w-full"
                onClick={handleUpdateName}
                disabled={isUpdating || !editName.trim()}
                data-testid="button-save-name"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
