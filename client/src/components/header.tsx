import { useState } from "react";
import { CheckSquare, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, signOut } = useSupabaseAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userMetadata = user?.user_metadata || {};
  const firstName = userMetadata.first_name || '';
  const lastName = userMetadata.last_name || '';
  const email = user?.email || '';

  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
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

  return (
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
                      src={userMetadata.avatar_url || undefined}
                      alt={firstName || "User"}
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
                      src={userMetadata.avatar_url || undefined}
                      alt={firstName || "User"}
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
                      {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'User'}
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
  );
}
