import { Layout, Avatar, Image } from 'antd';
import Logo from '../../assets/logo.png'
import Nice from '../../assets/nice.jpeg'
import LoginComponent from '../../components/LoginComponent'
import "./Login.scss"

export default function SignIn({setRefreshCheckLogin}) {
  const { Content } = Layout;

  return (
    <Layout className="login">
      <Content className="login__content">
        <h1 className="login__content-logo">
        <Avatar
          size={ 200 }
          src={ Logo }
        />
        </h1>
        <div className="login__content-form">
          <LoginComponent  
            setRefreshCheckLogin={ setRefreshCheckLogin }
          />
        </div>
      <Image 
        className='login__content-nice'
        src={ Nice }
        preview={ false }
      />
      </Content>
    </Layout>
  )
}

