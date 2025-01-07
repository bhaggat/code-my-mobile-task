import { TextCursorInputIcon, FormInputIcon, LogOutIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useUser } from "@/context/UserContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const items = [
  {
    title: "Fields",
    url: "/fields",
    icon: TextCursorInputIcon,
  },
  {
    title: "Forms",
    url: "/forms",
    icon: FormInputIcon,
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { removeUser, userData } = useUser();
  const handleLogout = () => {
    removeUser();
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url.includes(pathname)}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {userData?.name && (
          <div className="px-2 py-2 mb-2 rounded-md bg-sidebar-accent/50">
            <span className="text-sm font-medium">
              👋 Hello, {userData.name}!
            </span>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild className="w-full">
                  <Button className="w-full">
                    <LogOutIcon />
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
