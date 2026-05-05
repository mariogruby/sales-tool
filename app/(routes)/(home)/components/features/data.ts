import {
  Smartphone,
  Clock,
  Cloud,
  BarChart3,
  TableProperties,
  Receipt,
} from "lucide-react";

export const FEATURES = [
  {
    icon: Receipt,
    title: "Punto de venta",
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
    icon: Smartphone,
    title: "Diseño responsive",
    desc: "Funciona igual en móvil, tablet y ordenador. Sin aplicaciones que instalar, solo abre el navegador.",
  },
  {
    icon: Cloud,
    title: "Datos en la nube",
    desc: "Tu información siempre segura y accesible. Nunca pierdas datos aunque cambies de dispositivo.",
  },
];
