import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../../assets/logo.png';
import { 
	HomeFilled,
	UserOutlined, 
	SnippetsOutlined, 
	FormOutlined, 
	ContainerFilled, 
	GroupOutlined,
	DesktopOutlined } from '@ant-design/icons';


import { activationsByUserApi, userSubmenusApi } from '../../../api/auth';
import { configBusinessApi } from '../../../api/business';
import useAuth from '../../../hooks/useAuth';

import "./SideMenu.scss";

function SideMenu(props) {
  const { menuCollapse } = props
  const { Sider } = Layout;

	const location = useLocation();
	const value = useAuth();

  const [submenu1, setSubmenu1] = useState([]);
	const [submenu2, setSubmenu2] = useState([]);
	const [submenu3, setSubmenu3] = useState([]);
	const [submenu4, setSubmenu4] = useState([]);
	const [submenu5, setSubmenu5] = useState([]);
	
	const usersSubmenu = async (userID, submenu) => {
		try {
			const response = await userSubmenusApi(userID, submenu);
			if(submenu == 1) {
				setSubmenu1(response);
			}

			if(submenu == 2) {
				setSubmenu2(response);
			}

			if(submenu == 3) {
				setSubmenu3(response);
			}

			if(submenu == 4) {
				setSubmenu4(response);
			}

			if(submenu == 5) {
				setSubmenu5(response);
			}
			
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		usersSubmenu(value.userID, 1);
		usersSubmenu(value.userID, 2);
		usersSubmenu(value.userID, 3);
		usersSubmenu(value.userID, 4);
		usersSubmenu(value.userID, 5);
	}, [value])
	

	const getItem = (label, key, icon, children) => {
		return {
			key,
			icon,
			children,
			label
		}
	}

	const menuItems = [
		getItem(<NavLink to='/'>Dashboard</NavLink>, '/', <HomeFilled /> ),
		getItem('Facturación', '1', <SnippetsOutlined />, 
			submenu1.length > 0 ? submenu1.map((item, index) => {
				return getItem(
					<NavLink 
						key={index} 
						to={item.url}
					>
						{item.nombre}
					</NavLink>, 
					// item.sub_menu_id + '/' + item.nombre
					item.url
				)
			}) : submenu1
		),
		getItem('Facturación electrónica', '2', <DesktopOutlined />,
			submenu2.length > 0 ? submenu2.map((item, index) => {
				return getItem(
					<NavLink 
						key={index} 
						to={item.url}
					>
						{item.nombre}
					</NavLink>, 
					// item.sub_menu_id + '/' + item.nombre
					item.url
				)
			}) : submenu2
		),
		getItem('Funciones', '3', <FormOutlined />, 
			submenu3.length > 0 ? submenu3.map((item, index) => {
				return getItem(
					<NavLink 
						key={index} 
						to={item.url}
					>
						{item.nombre}
					</NavLink>, 
					// item.sub_menu_id + '/' + item.nombre
					item.url
				)
			}) : submenu3
		),
		getItem('Terceros', '4', <UserOutlined />, 
			submenu4.length > 0 ? submenu4.map((item, index) => {
				return getItem(
					<NavLink 
						key={index} 
						to={item.url}
					>
						{item.nombre}
					</NavLink>, 
					// item.sub_menu_id + '/' + item.nombre
					item.url
				)
			}) : submenu4
		),
		getItem('Listados', '5', <ContainerFilled />, 
			submenu5.length > 0 ? submenu5.map((item, index) => {
				return getItem(
					<NavLink 
						key={index} 
						to={item.url}
					>
						{item.nombre}
					</NavLink>, 
					// item.sub_menu_id + '/' + item.nombre
					item.url
				)
			}) : submenu5
		),
		getItem('Contabilidad', '6', <GroupOutlined /> ),
	];

  return (
    <Sider className="side-menu" trigger={null} collapsed={menuCollapse}>
      {/* <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}> */}
			<Avatar 
				size={72}
				src={Logo}
			/>
			<h4 className='side-menu__title-text'>{ value.name }</h4>
			<Menu 
				theme="dark" 
				mode="vertical" 
				items={ menuItems } 
				defaultSelectedKeys={[location.pathname]}
			/>
    </Sider>
  )
}

export default SideMenu;