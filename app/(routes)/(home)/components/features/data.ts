import {
  Ticket,
  Clock,
  Cloud,
  BarChart3,
  TableProperties,
  Receipt,
} from "lucide-react";

export const FEATURES = [
  {
    icon: Receipt,
    title: "Registro de ventas",
    desc: "Registra ventas en segundos. Elige entre efectivo, tarjeta o pago dividido con calculadora de cambio integrada.",
  },
  {
    icon: TableProperties,
    title: "Gestión de mesas",
    desc: "Asigna productos a mesas, actualiza pedidos en tiempo real y cobra directamente desde la vista de mesa.",
  },
  {
    icon: BarChart3,
    title: "Estadísticas",
    desc: "Visualiza ventas del día, mes y año con gráficos claros. Compara periodos y detecta tendencias de tu negocio.",
  },
  {
    icon: Clock,
    title: "Cierre diario",
    desc: "Cierra tu jornada con un clic. EasyPos calcula el resumen automáticamente y guarda el historial.",
  },
  {
    icon: Ticket,
    title: "Tickets digitales",
    desc: "Envía los tickets de las ventas que registres a tus clientes por email.",
  },
  {
    icon: Cloud,
    title: "Datos en la nube",
    desc: "Tu información siempre segura y accesible. Nunca pierdas datos aunque cambies de dispositivo.",
  },
];
