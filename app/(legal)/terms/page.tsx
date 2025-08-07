/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
    title: "Términos de Servicio",
    description: "Consulta los términos de uso del sistema de gestión de ventas",
};

export default function TermsOfServicePage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            <BackButton />
            <h1 className="text-3xl font-bold">Términos de Servicio</h1>
            <p className="text-muted-foreground">Fecha de entrada en vigor: 7 de agosto de 2025</p>
            <Separator />

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">1. Aceptación de los términos</h2>
                <p>
                    Al acceder o utilizar la Aplicación, usted acepta cumplir con estos Términos de Servicio.
                    Si no está de acuerdo con alguna parte de los mismos, no debe acceder ni utilizar la Aplicación.
                </p>

                <h2 className="text-xl font-semibold">2. Uso autorizado</h2>
                <p>
                    La Aplicación está destinada exclusivamente para uso interno por parte del restaurante o negocio al que se le haya concedido acceso.
                    Cualquier otro uso, incluyendo pero no limitado a la redistribución, sublicenciamiento o modificación sin consentimiento, está prohibido.
                </p>

                <h2 className="text-xl font-semibold">3. Registro y acceso</h2>
                <p>
                    Se requiere crear una cuenta y proporcionar información como correo electrónico, teléfono y dirección del negocio.
                    El acceso está restringido a usuarios autorizados, quienes son responsables de mantener la confidencialidad de sus credenciales.
                </p>

                <h2 className="text-xl font-semibold">4. Disponibilidad del servicio</h2>
                <p>
                    El Desarrollador se reserva el derecho a modificar, suspender o interrumpir temporal o permanentemente la Aplicación por motivos técnicos,
                    mantenimiento u otras razones justificadas, sin previo aviso.
                </p>

                <h2 className="text-xl font-semibold">5. Propiedad intelectual</h2>
                <p>
                    Todo el código, diseño y funcionalidades de la Aplicación son propiedad intelectual del Desarrollador, salvo que se haya pactado lo contrario.
                </p>

                <h2 className="text-xl font-semibold">6. Responsabilidad</h2>
                <p>
                    La Aplicación se proporciona "tal cual", sin garantías de ningún tipo.
                    El Desarrollador no será responsable por cualquier pérdida de datos, interrupción del servicio o daños derivados del uso.
                </p>

                <h2 className="text-xl font-semibold">7. Protección de datos</h2>
                <p>
                    El tratamiento de datos personales se regirá conforme a la Política de Privacidad vigente y la normativa aplicable (RGPD).
                </p>

                <h2 className="text-xl font-semibold">8. Modificaciones</h2>
                <p>
                    El Desarrollador se reserva el derecho de modificar estos términos.
                    En caso de cambios sustanciales, se notificará a los usuarios registrados.
                </p>

                <h2 className="text-xl font-semibold">9. Legislación aplicable</h2>
                <p>
                    Estos Términos se rigen por la legislación española.
                    Cualquier conflicto será resuelto ante los tribunales del lugar de residencia del Desarrollador.
                </p>
            </section>
        </div>
    );
}
