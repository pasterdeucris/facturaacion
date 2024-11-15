import React from 'react';
import { Form, Input, Button, Spin  } from 'antd';
import { toast } from 'react-toastify';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useForm } from '../../hooks/useForm';

import { loginApi, setUserOn } from '../../api/auth';
import "./LoginComponent.scss";

function LoginComponent({ setRefreshCheckLogin }) {

  let [ formValues, handleInputChange, reset ] = useForm({
    email: '',
    password: ''
  });

  const login = async() => {
    try {
      const response = await loginApi(formValues.email);
      if(response.length) {
        if(response[0].clave == formValues.password) {
          toast.success(`Bienvenido ${response[0].nombre}`);
          setUserOn({
            userID: response[0].usuario_id,
            name: response[0].nombre,
            email: response[0].correo,
            empresa_id: response[0].empresa_id,
          });
          setRefreshCheckLogin(true);
        } else {
          toast.warning("Contraseña incorrecta.");
        }
        
      } else {
        toast.warning("Credenciales incorrectas.");
      }
    } catch (err) {
      console.log(err)
    }
  }

	return (
		<Form className="signin-form" onFinish={ login }>
			<h4 className='signin-form__title'>Billing Facturación. Sistema de facturación e inventario.</h4>
			
      <Form.Item name="email">
        <Input 
          prefix={<UserOutlined/> }
          type="text" 
          name="email" 
          onChange={ handleInputChange }
          placeholder="Email" 
          className="signin-form__input"
        />
      </Form.Item>
      <Form.Item name="password" >
        <Input 
          prefix={<LockOutlined/> }
          type="password" 
          name="password" 
          onChange={ handleInputChange }
          placeholder="Contraseña" 
          className="signin-form__input"/>
      </Form.Item>
      <Form.Item>
        <Button 
          htmlType="submit"
					size='large'
					type='primary'
          className="signin-form__form-button">
          {/* {
            loading ? (
              <div style={{ textAlign: "center" }}>
                <Spin />
              </div>
            ) : "Ingresar"
          } */}
					<LoginOutlined />
					Ingresar
        </Button>

				<p className='signin-form__links'>
					<a href="#">
						Recordar contraseña
					</a>
					<a href="https://www.youtube.com/channel/UCFNW6X7RQHzJonlDgPlVyPA" target='_blank'>
						Tutoriales
					</a>
					<a href="#">
						Billingsoftware.com.co
					</a>
				</p>
      </Form.Item>
    </Form>
	)
}

export default LoginComponent