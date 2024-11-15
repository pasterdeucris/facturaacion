import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';

import {
    getProductByName
} from '../../../api/sales';

const MIN_LENGTH_INPUT_VALUE = 2;

function NameProductSelect({
    setProductSelect,
    nameProductRef,
    productEnter,
    barcodeRef,
    productCodeRef,
    logged,
}) {
    const [timerId, setTimerId] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [products, setProducts] = useState([]);

    const isValidInput = (input) => {
        return input.trim().length === 1 || input == 'Backspace';
    };

    const handleKeyPress = (event) => {

        if (timerId) {
            clearTimeout(timerId);
        }

        if(event.key === 'Enter' && event.target.value.trim() == '') {
            // barcodeRef.current.focus();
            productCodeRef.current.focus();
        }

        if(!isValidInput(event.key)) {
            return true;
        }

        setInputValue(event.target.value)

        const newTimerId = setTimeout(() => {

            if(event.target.value.length >= MIN_LENGTH_INPUT_VALUE) {

                getProductByName(event.target.value, logged?.empresa_id)
                .then(response => {
                    setProducts(response)
                })

            } else {
                setProducts([])
            }

        }, 300);

        setTimerId(newTimerId);

    };

    const handleProductSelectChange = (val) => {
        setProductSelect(val);
        if (!val) {
            setProducts([]);
        }
    };

    const handlerDisplayText = () => {
        let message = '';
        if (inputValue.trim() === "") {
            message = "Ingrese un nombre";
        } else if (inputValue.length <= MIN_LENGTH_INPUT_VALUE) {
            message = "Ingrese un nombre más largo";
        } else {
            message = "No hay productos disponibles";
        }

        return message;
    }

    useEffect(() => {
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
            setInputValue('');
            setProducts([]); 
        };
    }, [timerId]);

  return (
    <div>
      <>
        <Form.Item name="nombre_producto">
        <Select
            showSearch
            name="nombre_producto"
            size="middle"
            placeholder="Nombre de producto"
            onChange={handleProductSelectChange}
            onKeyDown={handleKeyPress}
            defaultActiveFirstOption={false}
            style={{ width: 300 }}
            notFoundContent={handlerDisplayText()}
            onInputKeyDown={(e) => e.key == 'Enter' && productEnter(e)}
            filterOption={false}
            ref={nameProductRef}
        >

            { products.map((item, idx) => (
            <Option
                key={idx}
                value={item.producto_id}
            >
                {item.nombre}
                <br />
                <small style={{ fontSize: '12px' }} >
                    {/* Costo: {item.costo} | */}
                    Público: {item.costo_publico} |
                    Cantidad: {item.cantidad} |
                    ID: {item.producto_id}
                </small>
            </Option>
            ))
		}
        </Select>
    </Form.Item>
    </>

    </div>
  );
}

export default NameProductSelect;
