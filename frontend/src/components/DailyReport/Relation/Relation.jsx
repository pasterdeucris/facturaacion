import { useState, useEffect } from 'react';
import { Modal, Descriptions } from 'antd';

function Relation({ showModalRelation, setShowModalRelation, data, dataCompras }) {

  const [loading, setLoading] = useState(true);

  const [calcVent, setCalcVent] = useState({
    "total": 0,
    "gravable5": 0,
    "gravable19": 0,
    "iva5": 0,
    "iva19": 0,
    "excento": 0
  });

  const [calcCompra, setCalcCompra] = useState({
    "total": 0,
    "gravable5": 0,
    "gravable19": 0,
    "iva5": 0,
    "iva19": 0,
    "excento": 0
  });

  useEffect(() => {
    if (showModalRelation) {
      setValuesCalculations();
    }
  }, [showModalRelation])

  const setValuesCalculations = () => {
    let total = 0;
    let gravable5 = 0;
    let gravable19 = 0;
    let iva5 = 0;
    let iva19 = 0;
    let excento = 0;

    let totalC = 0;
    let gravable5C = 0;
    let gravable19C = 0;
    let iva5C = 0;
    let iva19C = 0;
    let excentoC = 0;

    data.forEach(item => {

      gravable5 += parseFloat(item.base_5);
      gravable19 += parseFloat(item.base_19);
      total += parseFloat(item.total);
      iva5 += parseFloat(item.iva_5);
      iva19 += parseFloat(item.iva_19);
      excento += parseFloat(item.excento);
    });

    dataCompras.forEach(item => {
      gravable5C += parseFloat(item.base_5);
      gravable19C += parseFloat(item.base_19);
      totalC += parseFloat(item.total);
      iva5C += parseFloat(item.iva_5);
      iva19C += parseFloat(item.iva_19);
      excentoC += parseFloat(item.excento);
    });

    setCalcVent({
      total: total,
      gravable5: gravable5,
      gravable19: gravable19,
      iva5: iva5,
      iva19: iva19,
      excento: excento
    });

    setCalcCompra({
      total: totalC,
      gravable5: gravable5C,
      gravable19: gravable19C,
      iva5: iva5C,
      iva19: iva19C,
      excento: excentoC
    });

    setLoading(false);
  }

  return (
    <Modal
      title="Relación entradas y salidas"
      visible={showModalRelation}
      onCancel={() => { setShowModalRelation(false); }}
      width={1000}
      forceRender
    >
      {
        loading ? (
          <>...</>
        ) : (
          <Descriptions
            className='relacion'
            size='large'
            bordered
            title=""
            layout='vertical'
            column={7}
          >
            <Descriptions.Item label="">

            </Descriptions.Item>
            <Descriptions.Item label="TOTAL">
            </Descriptions.Item>
            <Descriptions.Item label="Gravable 5%">
            </Descriptions.Item>
            <Descriptions.Item label="Gravable 19%">
            </Descriptions.Item>
            <Descriptions.Item label="IVA 5%">
            </Descriptions.Item>
            <Descriptions.Item label="IVA 19%">
            </Descriptions.Item>
            <Descriptions.Item label="Excento">
            </Descriptions.Item>


            <Descriptions.Item>
              Ventas
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcVent?.total)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcVent?.gravable5)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcVent?.gravable19)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcVent?.iva5)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcVent?.iva19)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcVent?.excento)}
            </Descriptions.Item>

            <Descriptions.Item>
              Compras
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcCompra?.total)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcCompra?.gravable5)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcCompra?.gravable19)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcCompra?.iva5)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcCompra?.iva19)}
            </Descriptions.Item>
            <Descriptions.Item>
              {new Intl.NumberFormat('es-ES').format(calcCompra?.excento)}
            </Descriptions.Item>

            <Descriptions.Item>
              Diferencia
            </Descriptions.Item>
            <Descriptions.Item>
              {Number(parseFloat(calcVent.total) - parseFloat(calcCompra.total)).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item>
              {Number(parseFloat(calcVent.gravable5) - parseFloat(calcCompra.gravable5)).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item>
              {Number(parseFloat(calcVent.gravable19) - parseFloat(calcCompra.gravable19)).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item>
              {Number(parseFloat(calcVent.iva5) - parseFloat(calcCompra.iva5)).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item>
              {Number(parseFloat(calcVent.iva19) - parseFloat(calcCompra.iva19)).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item>
              {Number(parseFloat(calcVent.excento) - parseFloat(calcCompra.excento)).toFixed(2)}
            </Descriptions.Item>

          </Descriptions>

        )

      }
    </Modal>
  )
}

export default Relation;