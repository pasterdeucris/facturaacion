import React, { useState } from 'react'
import { Layout } from 'antd'

import TopMenu from '../../components/LayoutsComponents/TopMenu'
import MenuSider from '../../components/LayoutsComponents/SideMenu'
import "./AdminLayout.scss"

export default function AdminLayout({ children }) {
  const [menuCollapse, setMenuCollapse] = useState(false)
  const { Header, Content, Footer } = Layout;

	return (
		<Layout>
			<MenuSider menuCollapse={menuCollapse} />
			<Layout className="admin-layout" style={{ marginLeft: menuCollapse ? '80px' : '200px' }}>
				<Header className="admin-layout__header">
					<TopMenu menuCollapse={menuCollapse} setMenuCollapse={setMenuCollapse} />
				</Header>
				<Content className="admin-layout__content">
					{ children }
				</Content>
				<Footer className="admin-layout__footer">
					Billing Facturación, Sistema de facturación e inventario. &copy
				</Footer>
			</Layout>
		</Layout>
	)
}
