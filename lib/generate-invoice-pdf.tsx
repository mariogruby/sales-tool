import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer"

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: "Helvetica",
        color: "#1a1a1a",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        borderBottomStyle: "solid",
    },
    restaurantName: {
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        marginBottom: 4,
    },
    restaurantMeta: {
        fontSize: 9,
        color: "#555",
        marginBottom: 2,
    },
    invoiceInfo: {
        textAlign: "right",
    },
    invoiceTitle: {
        fontSize: 22,
        fontFamily: "Helvetica-Bold",
        marginBottom: 4,
    },
    invoiceMeta: {
        fontSize: 9,
        color: "#555",
        marginBottom: 2,
    },
    table: {
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        borderTopStyle: "solid",
    },
    tableHeader: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        borderBottomStyle: "solid",
        backgroundColor: "#f5f5f5",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ececec",
        borderBottomStyle: "solid",
    },
    colName: { flex: 3 },
    colQty: { flex: 1, textAlign: "center" },
    colPrice: { flex: 1, textAlign: "right" },
    colTotal: { flex: 1, textAlign: "right" },
    headerText: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        color: "#555",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 16,
        paddingHorizontal: 8,
        gap: 16,
    },
    totalLabel: {
        fontFamily: "Helvetica-Bold",
        fontSize: 13,
    },
    totalValue: {
        fontFamily: "Helvetica-Bold",
        fontSize: 13,
    },
    footer: {
        position: "absolute",
        bottom: 32,
        left: 40,
        right: 40,
        fontSize: 9,
        color: "#aaa",
        textAlign: "center",
    },
})

interface RestaurantInfo {
    name: string
    direction: string
    phoneNumber: string
    cif: string
    email: string
}

interface InvoiceItem {
    name: string
    quantity: number
    price: number
}

interface IvaConfig {
    enabled: boolean
    percent: number
}

interface InvoicePDFProps {
    items: InvoiceItem[]
    total: number
    invoiceNumber: string
    date: string
    restaurant: RestaurantInfo
    iva: IvaConfig
}

function InvoicePDF({ items, total, invoiceNumber, date, restaurant, iva }: InvoicePDFProps) {
    const baseTotal = iva.enabled ? total / (1 + iva.percent / 100) : total
    const ivaAmount = iva.enabled ? total - baseTotal : 0
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Cabecera: datos del restaurant + info de factura */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.restaurantName}>{restaurant.name}</Text>
                        {restaurant.direction ? (
                            <Text style={styles.restaurantMeta}>{restaurant.direction}</Text>
                        ) : null}
                        {restaurant.phoneNumber ? (
                            <Text style={styles.restaurantMeta}>Tel: {restaurant.phoneNumber}</Text>
                        ) : null}
                        {restaurant.cif ? (
                            <Text style={styles.restaurantMeta}>CIF: {restaurant.cif}</Text>
                        ) : null}
                        <Text style={styles.restaurantMeta}>{restaurant.email}</Text>
                    </View>
                    <View style={styles.invoiceInfo}>
                        <Text style={styles.invoiceTitle}>Factura</Text>
                        <Text style={styles.invoiceMeta}>Nº {invoiceNumber}</Text>
                        <Text style={styles.invoiceMeta}>Fecha: {date}</Text>
                    </View>
                </View>

                {/* Tabla de productos */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colName, styles.headerText]}>Producto</Text>
                        <Text style={[styles.colQty, styles.headerText]}>Cant.</Text>
                        <Text style={[styles.colPrice, styles.headerText]}>Precio</Text>
                        <Text style={[styles.colTotal, styles.headerText]}>Total</Text>
                    </View>

                    {items.map((item, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.colName}>
                                {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
                            </Text>
                            <Text style={styles.colQty}>{item.quantity}</Text>
                            <Text style={styles.colPrice}>€{item.price.toFixed(2)}</Text>
                            <Text style={styles.colTotal}>€{(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Total */}
                {iva.enabled ? (
                    <View style={{ marginTop: 16, paddingHorizontal: 8, alignItems: "flex-end", gap: 4 }}>
                        <View style={{ flexDirection: "row", gap: 16 }}>
                            <Text style={{ fontSize: 11, color: "#555" }}>Base imponible</Text>
                            <Text style={{ fontSize: 11, color: "#555" }}>€{baseTotal.toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 16 }}>
                            <Text style={{ fontSize: 11, color: "#555" }}>IVA ({iva.percent}%)</Text>
                            <Text style={{ fontSize: 11, color: "#555" }}>€{ivaAmount.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.totalRow, { marginTop: 4 }]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>€{total.toFixed(2)}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>€{total.toFixed(2)}</Text>
                    </View>
                )}

                <Text style={styles.footer}>Documento generado automáticamente — EasyPOS</Text>
            </Page>
        </Document>
    )
}

export async function generateInvoiceBuffer(props: InvoicePDFProps): Promise<Buffer> {
    return renderToBuffer(<InvoicePDF {...props} />) as Promise<Buffer>
}
