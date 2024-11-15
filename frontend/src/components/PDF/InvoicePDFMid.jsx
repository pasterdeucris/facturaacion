import { useState, useEffect } from 'react';

import useDayjs from '../../hooks/useDays';
/* eslint-disable react/prop-types */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import opensansRegular from "../../assets/fonts/open-sans.regular.ttf";
import opensansBold from "../../assets/fonts/open-sans.bold.ttf";
import logo from "../../assets/logoempresa.jpg";

Font.register({
  family: "OpenSans",
  fonts: [{ src: opensansRegular }, { src: opensansBold, fontWeight: "bold" }],
});

// Definimos los estilos para el documento PDF
const styles = StyleSheet.create({
  logo: {
    width: 130,
    height: 90,
    alignItems: "center",
  },
  tabla: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    border: "1px solid #000",
    marginTop: "3px",
    borderRadius: "4px",
  },

  tablaFila: { flexDirection: "row" },

  tablaColumna: {
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },

  tablaCeldaHeader: {
    margin: "1",
    fontSize: "8px",
    textAlign: "center",
  },

  tablaCelda: { margin: "2", fontSize: "7px" },

  informacionNegocio: {
    textAlign: "center",
    fontSize: "8px",
  },

  informacionVenta: {
    textAlign: "center",
    fontSize: "8px",
  },

  informacionCliente: {
    fontSize: "7px",
  },

  pagination: {
    position: "absolute",
    left: 0,
    top: 0,
    fontSize: 8,
  },
});

// Definimos el componente PDF
const PDF = ({
  document,
  totalToPay,
  productsDocument,
  discountTotal,
  resolutions,
  productsOpt,
  businessData,
  invoice,
  total,
	totalKG,
	showIva,
	showTotalSoloIVA,
	totalSinIVA
}) => {
  const itemsPorPagina = 5;

  // Función para dividir los productos en páginas
  const dividirProductosEnPaginas = (items) => {
    const operator = discountTotal > 0 ? 1 : -1

    const newProducts = items.map(product => {
      const pct = Math.abs(discountTotal) / 100;
      const pctValueParcial = Number(product.parcial) * Number(pct);
      const pctValueUnit = Number(product.unitario) * Number(pct);

      return {
        ...product,
        parcial: operator === -1 ? (Number(product.parcial) - Number(pctValueParcial)) : (Number(product.parcial) + Number(pctValueParcial)),
        unitario: operator === -1 ? (Number(product.unitario) - Number(pctValueUnit)) : (Number(product.unitario) + Number(pctValueUnit)),
      };
    });

    const paginas = [];
    for (let i = 0; i < newProducts.length; i += itemsPorPagina) {
      paginas.push(newProducts.slice(i, i + itemsPorPagina));
    }
    return paginas;
  };

  const dayjs = useDayjs();
  const payments = JSON.parse(localStorage.getItem('paymentInPrint')) || [];

  const equalTypePayment = (val = null) => {
    let data = [
      { val: 1, text: 'Efectivo' },
      { val: 2, text: 'Crédito' },
      { val: 3, text: 'Cheque' },
      { val: 4, text: 'Consignación' },
      { val: 5, text: 'Tarjeta' },
      { val: 6, text: 'Vale' }
    ];

    return data.find(item => item.val == val)?.text || null;
  }

  const paginasProductos = dividirProductosEnPaginas(productsDocument);

  return (
    // Creamos un nuevo documento PDF
    <Document>
      {paginasProductos.map((items, pageIndex) => (
        <Page
          key={pageIndex}
          // Definimos el tamaño y la orientación de la página
          size={[5.5 * 72, 8.5 * 72]}
          style={styles.page}
          orientation="landscape"
        >
          <View style={{ padding: "15px" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* Agregamos el logo de la empresa */}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image style={styles.logo} src={logo} />
              </View>
              {/* Informacion del negocio */}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.informacionNegocio}>{businessData[0]?.nombre}</Text>
                  <Text style={styles.informacionNegocio}>
                    {businessData[0]?.regimen}
                  </Text>
                  <Text style={styles.informacionNegocio}>
                    NIT. {businessData[0]?.nit} - {businessData[0]?.digito_verificacion}
                  </Text>
                  <Text style={styles.informacionNegocio}>{businessData[0]?.direccion} - {businessData[0]?.barrio}</Text>
                  <Text style={styles.informacionNegocio}>{businessData[0]?.ciudad} ({businessData[0]?.departamento}) </Text>
                </View>
              </View>

              {/* Informacion de venta */}
              <View style={{ flex: 1 }}>
                <Text style={styles.informacionVenta}>
                  Comprobante de venta
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "3px",
                    border: "1px solid #000",
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  <Text style={styles.informacionVenta}>
                    Nº {
                      document?.tipo_documento_id == 10 ? 'FACTURA DE VENTA SISTEMA POS' :
                        document?.tipo_documento_id == 9 ? 'NO DE GUIA' :
                          document?.tipo_documento_id == 4 ? 'COTIZACIÓN' :
                            'FACTURA'
                    } : {resolutions?.letra_consecutivo}{resolutions.consecutivo + 1}
                  </Text>
                </View>
                <Text style={styles.informacionVenta}>Fecha de expedicion</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "3px",
                    border: "1px solid #000",
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  <Text style={styles.informacionVenta}>
                    {
                      dayjs.utc(document?.fecha_registro)
                        // .subtract(5, 'hours')
                        .tz(dayjs.tz.guess())
                        .format("YYYY-MM-DD HH:mm:ss")
                    }
                  </Text>
                </View>
              </View>
            </View>

            {/* Informacion del cliente */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "1px",
                border: "1px solid #000",
                padding: "5px",
                borderRadius: "5px",
                marginTop: "5px",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.informacionCliente}>
                  NOMBRE: {document?.c_nombre} {document?.c_apellido}
                </Text>
                <Text style={styles.informacionCliente}>
                  EMPRESA: {businessData[0]?.nombre}
                </Text>
                {/* <Text style={styles.informacionCliente}>
                    DIRECCION: {facturaData.direccion}
                  </Text> */}
                <Text style={styles.informacionCliente}>
                  FORMA/MEDIO PAGO: 
                  {
                    payments.length ? payments.map(item => equalTypePayment(item.type)).join(', ') : ""
                  }
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.informacionCliente}>
                  CC o NIT: {document?.doc_cliente}
                </Text>
                <Text style={styles.informacionCliente}>
                  TELEFONO: {businessData[0]?.cel} - {businessData[0]?.telefono_fijo || ""}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.informacionCliente}>
                  VENCIMIENTO:
                  {
                    dayjs.utc(document?.fecha_registro)
                      // .subtract(5, 'hours')
                      .tz(dayjs.tz.guess())
                      .format("YYYY-MM-DD HH:mm:ss")
                  }
                </Text>
                <Text style={styles.informacionCliente}>
                  VENDEDOR: {document?.u_nombre} {document?.u_apellido}
                </Text>
              </View>
            </View>
            {/* Tabla de productos */}
            <View style={styles.tabla}>
              <View style={styles.tablaFila}>
                <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                  <Text style={styles.tablaCeldaHeader}>CODIGO</Text>
                </View>
                <View style={[styles.tablaColumna, { flex: 0.1 }]}>
                  <Text style={styles.tablaCeldaHeader}>IVA</Text>
                </View>
                <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                  <Text style={styles.tablaCeldaHeader}>VARIOS</Text>
                </View>
                <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                  <Text style={styles.tablaCeldaHeader}>CANT</Text>
                </View>
                <View style={[styles.tablaColumna, { flex: 1.2 }]}>
                  <Text style={styles.tablaCeldaHeader}>DESCRIPCION</Text>
                </View>
                <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                  <Text style={styles.tablaCeldaHeader}>V.UNT.FIT</Text>
                </View>
                <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                  <Text style={styles.tablaCeldaHeader}>VR. TOTAL</Text>
                </View>
              </View>
              {items.map((item) => (
                <View style={styles.tablaFila} wrap={false} key={item.codigo_barras}>
                  <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                    <Text style={styles.tablaCelda}>{item.codigo_barras}</Text>
                  </View>
                  <View style={[styles.tablaColumna, { flex: 0.1 }]}>
                    <Text style={styles.tablaCelda}>{item.impuesto_producto}</Text>
                  </View>
                  <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                    <Text style={styles.tablaCelda}>""</Text>
                  </View>
                  <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                    <Text style={styles.tablaCelda}>{item.cantidad}</Text>
                  </View>
                  <View style={[styles.tablaColumna, { flex: 1.2 }]}>
                    <Text style={styles.tablaCelda}>{item.descripcion}</Text>
                  </View>
                  <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                    <Text style={styles.tablaCelda}>{item.unitario}</Text>
                  </View>
                  <View style={[styles.tablaColumna, { flex: 0.2 }]}>
                    <Text style={styles.tablaCelda}>{item.parcial}</Text>
                  </View>
                </View>
              ))}
            </View>
            {/* Si es la última página, renderiza el total */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "5px",
              }}
            >
              <View style={{ flex: 2 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "1px",
                    border: "1px solid #000",
                    padding: "20px",
                    borderRadius: "3px",
                  }}
                >
                  <Text style={styles.informacionCliente}>
                    Observación:
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "1px",
                    padding: "5px",
                    border: "1px solid #000",
                    borderRadius: "3px",
                  }}
                >
                  <Text style={styles.informacionCliente}>
                    SUBTOTAL: {new Intl.NumberFormat('es-ES').format(total)}
                  </Text>
                  <Text style={styles.informacionCliente}>
                    DESCUENTO: 0
                  </Text>
                  <Text style={styles.informacionCliente}>
                    TOTAL: {new Intl.NumberFormat('es-ES').format(totalToPay)}
                  </Text>
                  <Text style={styles.informacionCliente}>
                    TOTAL IVA 5: {parseFloat(showIva?.totalWithoutIVA5).toFixed(2) ?? 0}
                    <p>
                      ivaivaivaivaivai: {showIva?.totalWithoutIVA5}
                    </p>
                  </Text>
                  <Text style={styles.informacionCliente}>
                    TOTAL IVA 19: {parseFloat(showIva?.totalWithoutIVA19).toFixed(2) ?? 0}
                  </Text>
                </View>
              </View>
            </View>

            <View fixed style={styles.pagination}>
              <Text
                render={({ pageNumber, totalPages }) =>
                  `${pageNumber}/${totalPages}`
                }
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "4px",
              }}
            >
              <Text style={{ fontSize: 5 }}>
                Sistema POS. Res. 1876405704220 de Fecha: 2023 -09- 29T05
                :00:00.000Z Vigencia resolucion 6 meses Rango autorizado :
                Post40086 a Post100000 FACTURA IMPRESAPOR COMPUTADOR admin **
                Gracias por su compra ** Software desarrollado por : Sofmate
                soporte software 3112864974 Lic.by Johan Ordoñez nit . 10305527
                -6
              </Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PDF;
