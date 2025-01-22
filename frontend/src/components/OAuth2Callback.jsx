import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';

function OAuth2Callback() {
  const location = useLocation();

  useEffect(() => {
    const handleCallback = () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');

      if (error) {
        window.opener.postMessage({
          type: 'oauth2_callback',
          error
        }, window.location.origin);
        return;
      }

      if (code && state) {
        // Verify state matches stored state
        const storedState = sessionStorage.getItem('oauth2_state');
        if (state !== storedState) {
          window.opener.postMessage({
            type: 'oauth2_callback',
            error: 'Invalid state parameter'
          }, window.location.origin);
          return;
        }

        window.opener.postMessage({
          type: 'oauth2_callback',
          code
        }, window.location.origin);
      }
    };

    if (window.opener) {
      handleCallback();
    }
  }, [location]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>
        Completing authentication...
      </Typography>
    </Box>
  );
}

export default OAuth2Callback; 