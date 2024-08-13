import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; 

const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const navigate = useNavigate();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      const accessToken = Cookies.get('access-token');
      if (!accessToken) {
        navigate('/login');
    } else {
          setVerified(true);
      }
    }, [navigate]);

    if (verified) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };

  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuth;
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;
