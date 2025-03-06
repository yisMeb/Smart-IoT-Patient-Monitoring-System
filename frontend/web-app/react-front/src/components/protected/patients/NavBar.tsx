import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebaseConfig";
import { clearCookies } from "@/lib/cookieUtils";
import { useUserRole } from "@/context/UserRoleContext";

export const NavBar = () => {
  const navigate = useNavigate();
  const { setRoleName, setIsAuthenticated } = useUserRole();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      clearCookies();
      setIsAuthenticated(false);
      setRoleName("");
      console.log("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <nav className="relative flex items-center justify-between p-4 bg-transparent z-50">
      <div className="flex items-center">
        <img src="/logo1.png" alt="logo" className="w-20" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-10 h-10 rounded-xl bg-white overflow-hidden flex justify-center items-center cursor-pointer">
            <User />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-center">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
