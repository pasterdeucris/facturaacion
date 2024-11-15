import HomePage from "../pages/Home";

/** Facturación */
import CarteraClientes from "../pages/carteraClientes";
import CarteraProveedores from "../pages/carteraProveedores";
import EntradasAlmacen from "../pages/entradasAlmacen";
import GestionOrden from "../pages/gestionOrden";
import InventarioFisico from "../pages/inventarioFisico";
import Nomina from "../pages/nomina";
import OT from "../pages/ot";
import VentasDia from '../pages/ventasDia';

/** Facturación electronica */
import EnvioDocumentos from '../pages/envioDocumentos';
import EstadoDocumentos from '../pages/estadoDocumentos';

/** Funciones */
import Cierre from '../pages/cierre';
import InformeDiario from '../pages/informeDiario';
import Kardex from '../pages/kardex';
import LiberarCuadre from '../pages/liberarCuadre';
import RetirosCaja from '../pages/retirosCaja';

/** Terceros */
import Cliente from '../pages/cliente';
import Empleado from '../pages/empleado';
import Proveedor from '../pages/proveedor';
import Usuario from '../pages/usuario';

/** Listados */
import ControlInventario from '../pages/controlInventario';
import InfoGanancia from '../pages/infoganancia';
import InfoMovimiento from '../pages/infoMovimiento';
import MovimientoProductos from '../pages/movimientoProductos';
import ReporteProductos from '../pages/reporteProductos';
import ReporteTercero from '../pages/reporteTerceros';
import Auditoria from '../pages/auditoria';

export default [
    {
        path: "/",
        exact: true,
        page: HomePage,
    },
    {
        path: "/carteraClientes",
        exact: true,
        page: CarteraClientes,
    },
    {
        path: "/carteraProveedores",
        exact: true,
        page: CarteraProveedores,
    },
    {
        path: "/entradasAlmacen",
        exact: true,
        page: EntradasAlmacen,
    },
    {
        path: "/gestionOrden",
        exact: true,
        page: GestionOrden,
    },
    {
        path: "/inventarioFisico",
        exact: true,
        page: InventarioFisico,
    },
    {
        path: "/nomima",
        exact: true,
        page: Nomina,
    },
    {
        path: "/ot",
        exact: true,
        page: OT,
    },
    {
        path: "/ventasDia",
        exact: true,
        page: VentasDia,
    },
    {
        path: "/envioDocumentos",
        exact: true,
        page: EnvioDocumentos,
    },
    {
        path: "/estadoDocumentos",
        exact: true,
        page: EstadoDocumentos,
    },
    {
        path: "/Cierre",
        exact: true,
        page: Cierre,
    },
    {
        path: "/informeDiario",
        exact: true,
        page: InformeDiario,
    },
    {
        path: "/kardex",
        exact: true,
        page: Kardex,
    },
    {
        path: "/liberarCuadre",
        exact: true,
        page: LiberarCuadre,
    },
    {
        path: "/retirosCaja",
        exact: true,
        page: RetirosCaja,
    },
    {
        path: "/cliente",
        exact: true,
        page: Cliente,
    },
    {
        path: "/empleado",
        exact: true,
        page: Empleado,
    },
    {
        path: "/proveedor",
        exact: true,
        page: Proveedor,
    },
    {
        path: "/usuario",
        exact: true,
        page: Usuario,
    },
    {
        path: "/controlImventario",
        exact: true,
        page: ControlInventario,
    },
    {
        path: "/infoganancia",
        exact: true,
        page: InfoGanancia,
    },
    {
        path: "/infoMovimiento",
        exact: true,
        page: InfoMovimiento,
    },
    {
        path: "/movimientoProductos",
        exact: true,
        page: MovimientoProductos,
    },
    {
        path: "/reporteProductos",
        exact: true,
        page: ReporteProductos,
    },
    {
        path: "/reporteTerceros",
        exact: true,
        page: ReporteTercero,
    },
    {
        path: "/auditoria",
        exact: true,
        page: Auditoria,
    }
]