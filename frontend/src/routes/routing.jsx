import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import router from './router';

function routing({ setRefreshCheckLogin }) {
  return (
    <Router>
      <Routes>
        {
          router.map((route,index) => (
            <Route 
              key={index} 
              path={route.path} 
              exact={route.exact}
              element={
                <route.page 
                  setRefreshCheckLogin={ setRefreshCheckLogin }
                />
              }
            />
          ))
        }
      </Routes>
    </Router>
  )
}

export default routing;