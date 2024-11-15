import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from './providers/context';
import { isLoggedUser } from './api/auth';

import Routing from './routes/routing';
import LoginPage from './pages/Login';
import './app.scss';

function App() {

  const [user, setUser] = useState(null);
  const [loadUser, setLoadUser] = useState(false);
  const [refreshCheckLogin, setRefreshCheckLogin] = useState(false);

  const logged = isLoggedUser();

  useEffect(() => {
    setUser( logged );
    setLoadUser(true);

    return () => {
      setRefreshCheckLogin( false );
    }

  }, [refreshCheckLogin]);

  if(!loadUser) return null
  
  return (
    <AuthContext.Provider value={user}>
      {
        user ? (
          <Routing 
            setRefreshCheckLogin={ setRefreshCheckLogin }
          />
        ) : (
          <LoginPage  
            setRefreshCheckLogin={ setRefreshCheckLogin }
          />
        )
      }
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </AuthContext.Provider>
  )
}

export default App
