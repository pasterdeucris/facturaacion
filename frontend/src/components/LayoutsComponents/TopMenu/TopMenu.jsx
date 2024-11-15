import { Button } from 'antd'
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { logoutRemoveUser as logout } from '../../../api/auth';

import "./TopMenu.scss"

export default function TopMenu(props) {
  const { menuCollapse, setMenuCollapse } = props;

  const logoutUser = () => {
    toast.success('Has cerrado sesión...');
    logout();
    window.location.reload();
  }

  return (
    <div className="top-menu">
      <div className="top-menu__left">
        <Button type="link" onClick={() => setMenuCollapse(!menuCollapse)}>
        { menuCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
        </Button>
      </div>

      <div className="top-menu__right">
        <Button type="link" onClick={ logoutUser }>
          <LogoutOutlined />
        </Button>
      </div>
    </div>
  )
}
