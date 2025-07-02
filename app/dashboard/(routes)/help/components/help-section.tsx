/* eslint-disable react/no-unescaped-entities */
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function HelpSection() {
    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
        // defaultValue="item-1"
        >
            <AccordionItem value="item-1">
                <AccordionTrigger>¿Cómo creo un producto?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Para crear un producto, debes estar en la sección de productos y tocar el botón
                        <strong> "Crear producto"</strong>. Una vez abierto el formulario, debes ingresar el nombre del producto, su precio y
                        asignarle una categoría. Cuando hayas completado todos los campos, guarda
                        el producto y aparecerá en la lista.
                    </p>
                    <p>
                        <strong>Nota:</strong> Si no tienes categorías creadas, no podrás crear un producto.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
                <AccordionTrigger>¿Cómo creo una categoría?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Para crear una categoría, debes estar en la sección de productos y tocar el botón
                        <strong> "Crear categoría"</strong>. Una vez abierto el formulario, simplemente elige un nombre para la categoría y guarda.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
                <AccordionTrigger>¿Cómo realizo una venta?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Para realizar una venta, debes estar en la sección de productos y tocar sobre algún producto.
                        Automáticamente se abrirá un panel inferior con los productos seleccionados. Podrás editar la cantidad
                        directamente en el panel o tocando varias veces sobre el producto.
                    </p>
                    <p>
                        Dentro del panel encontrarás información como el total de los productos seleccionados y un
                        selector para elegir el método de pago (<strong>tarjeta, efectivo o dividido</strong>).
                        Una vez que la venta esté lista, solo debes hacer clic en <strong>"Realizar venta"</strong>
                        y se guardará en el registro de ventas diarias.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
                <AccordionTrigger>¿Cómo agrego productos a una mesa?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Para agregar productos a una mesa, debes estar en la sección de productos y seleccionar
                        los productos que deseas comandar. Luego, en el panel inferior, selecciona el número de mesa
                        al que deseas asignarlos y toca el botón <strong>"Agregar a mesa"</strong>. Los productos quedarán comandados
                        en la mesa seleccionada.
                    </p>
                    <p>
                        <strong>Importante:</strong> Antes de poder comandar productos, debes haber creado un grupo de mesas
                        correspondiente al área del negocio donde se encuentran.
                    </p>
                    <p>
                        Podrás editar las cantidades directamente desde la sección de mesas,
                        tocando sobre la mesa ocupada y habilitando el <strong>modo Editor</strong> dentro de sus detalles.
                    </p>
                    <p>
                        También puedes seguir añadiendo productos a una mesa ocupada desde la sección de productos,
                        seleccionando nuevamente el número de mesa.
                    </p>
                    <p>
                        <strong>Nota:</strong> Comandar productos no genera una venta inmediata. Para confirmar la venta,
                        debes ir a la sección de <strong>"Mesas"</strong> y finalizarla desde ahí.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
                <AccordionTrigger>¿Cómo realizo una venta desde una mesa?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Para realizar la venta de una mesa ocupada con productos comandados, toca sobre la mesa
                        correspondiente para ver sus detalles. Luego selecciona el método de pago y confirma la venta.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
                <AccordionTrigger>¿Cómo calculo el cambio si un cliente paga en efectivo?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Para calcular el cambio a devolver cuando un cliente paga en efectivo, selecciona el método de pago
                        <strong> "Efectivo"</strong> desde el panel inferior o desde los detalles de la mesa.
                        A continuación, verás un botón que te permitirá calcular el cambio a entregar al cliente.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
                <AccordionTrigger>¿Qué hago si un cliente quiere pagar en partes con efectivo y tarjeta?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Para registrar correctamente un pago dividido entre efectivo y tarjeta, selecciona el método de pago
                        <strong> "Dividido"</strong> desde el panel inferior o desde los detalles de la mesa. Luego pulsa el botón
                        que te permitirá ingresar las cantidades en efectivo y en tarjeta, y confirma la venta.
                    </p>
                    <p>
                        <strong>Nota:</strong> Si las cantidades ingresadas no coinciden con el total de la venta,
                        no se podrá confirmar hasta que estén correctas.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
                <AccordionTrigger>¿Cómo puedo ver el detalle de los productos seleccionados?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        En el panel inferior, donde se realiza la venta, encontrarás un botón que dice
                        <strong> "Ver detalles"</strong>. Ahí podrás ver todos los productos seleccionados,
                        sus cantidades y los subtotales.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
                <AccordionTrigger>¿Cómo cierro el día de ventas?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        En la sección <strong>Dashboard</strong>, encontrarás un botón que dice
                        <strong> "Cerrar día"</strong>. Deberás confirmar la acción y, una vez cerrado,
                        se actualizará el panel principal y los datos del día quedarán registrados.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
                <AccordionTrigger>¿Qué pasa si se me olvidó cerrar un día de ventas?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Si olvidaste cerrar un día de ventas, en la sección de <strong>Dashboard</strong> encontrarás,
                        en la parte inferior, una lista con los días pendientes por cerrar y un botón
                        <strong> "Cerrar día"</strong>.
                        Es recomendable cerrar los días pendientes antes de comenzar a registrar ventas en un nuevo día,
                        para evitar inconsistencias en los totales o posibles errores en la contabilidad.
                    </p>
                    <p>
                        <strong>Nota:</strong> Debes cerrar el día pendiente directamente desde la lista donde aparecen
                        los días sin cerrar. El botón <strong>"Cerrar día"</strong> ubicado en la parte superior del <strong>Dashboard</strong> <u>no cerrará </u>
                        un día pendiente; ese botón solo cierra el día actual en curso.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11">
                <AccordionTrigger>¿Cómo veo el historial de cierres?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        En la sección <strong>Historial de cierres</strong> encontrarás la lista de todos los días
                        de ventas que has cerrado junto con sus detalles.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12">
                <AccordionTrigger>¿Cómo elimino una venta realizada por error?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        En la sección <strong>Ventas diarias</strong> verás la lista de todas las ventas realizadas en el día actual.
                        Desde allí podrás eliminar cualquier venta que hayas realizado por error.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-13">
                <AccordionTrigger>¿Cómo restrinjo áreas de la aplicación?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Desde <strong>Configuración</strong>, debes crear un código de 6 dígitos y habilitar la opción
                        <strong> "Requerir código de seguridad"</strong>. Luego selecciona las secciones de tu aplicación
                        que deseas restringir.
                    </p>
                    <p>
                        Una vez guardados los cambios, la sesión se cerrará automáticamente. Al volver a iniciar sesión,
                        las áreas seleccionadas estarán protegidas con el código de seguridad.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-14">
                <AccordionTrigger>¿Para qué es el botón de "Venta extraordinaria"?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Esta opción permite crear una venta ingresando manualmente las cantidades de efectivo y tarjeta.
                        Está pensada para situaciones en las que la contabilidad no se puede gestionar directamente desde la aplicación,
                        como en eventos especiales u otras circunstancias excepcionales.
                    </p>
                    <p>
                        <strong>Nota:</strong> Esta opción genera una venta sin productos asociados.
                    </p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
