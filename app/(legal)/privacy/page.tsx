import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
    title: "Política de Privacidad",
    description: "Conoce cómo se gestionan tus datos personales en el sistema",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            <BackButton />
            <h1 className="text-3xl font-bold">Política de Privacidad</h1>
            <p className="text-muted-foreground">Fecha de entrada en vigor: 7 de agosto de 2025</p>
            <Separator />

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">1. Responsable del tratamiento</h2>
                <p>
                    Responsable: [Easypos group]<br />
                    Correo electrónico: [easypos-manager@proton.me]<br />
                    Ubicación: España
                </p>

                <h2 className="text-xl font-semibold">2. Datos que se recopilan</h2>
                <p>
                    Se recogen datos personales como correo electrónico, número de teléfono y dirección del negocio.
                    Estos datos son proporcionados voluntariamente al registrarse en la Aplicación.
                </p>

                <h2 className="text-xl font-semibold">3. Finalidad del tratamiento</h2>
                <p>
                    Los datos se usan para gestionar el acceso, mantener el sistema operativo y facilitar la comunicación entre el usuario y el desarrollador.
                </p>

                <h2 className="text-xl font-semibold">4. Conservación de los datos</h2>
                <p>
                    Los datos se conservarán mientras exista una cuenta activa o sea necesario para el funcionamiento del sistema.
                </p>

                <h2 className="text-xl font-semibold">5. Seguridad de los datos</h2>
                <p>
                    Se aplican medidas técnicas y organizativas para garantizar la seguridad de los datos personales.
                </p>

                <h2 className="text-xl font-semibold">6. Cesión de datos a terceros</h2>
                <p>
                    No se cederán datos a terceros salvo obligación legal.
                    La aplicación no utiliza servicios externos de analítica ni publicidad.
                </p>

                <h2 className="text-xl font-semibold">7. Derechos del usuario</h2>
                <p>
                    Usted puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo al correo proporcionado.
                </p>

                <h2 className="text-xl font-semibold">8. Cambios en la política</h2>
                <p>
                    Esta política puede ser actualizada. Se notificará cualquier modificación sustancial dentro de la Aplicación.
                </p>

                <h2 className="text-xl font-semibold">9. Legislación aplicable</h2>
                <p>
                    Esta Política se rige por el Reglamento General de Protección de Datos (RGPD) y la legislación española.
                </p>
            </section>
        </div>
    );
}
