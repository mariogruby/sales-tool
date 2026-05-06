import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconToolsKitchen3,
  IconHelp,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { MdOutlineTableRestaurant } from "react-icons/md";

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Productos",
      url: "/dashboard/product",
      icon: IconToolsKitchen3,
    },
    {
      title: "Mesas",
      url: "/dashboard/tables",
      icon: MdOutlineTableRestaurant,
    },
    {
      title: "Estadísticas",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Equipo",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Ayuda",
      url: "/dashboard/help",
      icon: IconHelp,
    },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  documents: [
    {
      name: "Historial de cierres",
      url: "/dashboard/documents/monthly-history",
      icon: IconDatabase,
    },
    {
      name: "Ventas diarias",
      url: "/dashboard/documents/sales-day",
      icon: IconReport,
    },
    // {
    //   name: "Word Assistant",
    //   url: "#",
    //   icon: IconFileWord,
    // },
  ],
};
