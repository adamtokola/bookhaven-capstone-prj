import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    notifyOn: {
      comments: true,
      replies: true,
      reactions: true,
      reviews: true,
      mentions: true,
      follows: true,
    },
    emailDigest: 'daily', // 'daily', 'weekly', 'never'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDigestDialog, setOpenDigestDialog] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5001/users/notification-settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (setting, value) => {
    try {
      const response = await fetch('http://localhost:5001/users/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ [setting]: value }),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      setSettings(prev => ({
        ...prev,
        [setting]: value,
      }));
      setSuccess('Settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update settings');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notification Settings
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <List>
          <ListItem>
            <ListItemText 
              primary="Email Notifications"
              secondary="Receive notifications via email"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText 
              primary="Push Notifications"
              secondary="Receive browser notifications"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText 
              primary="Notification Types"
              secondary="Choose what you want to be notified about"
            />
          </ListItem>

          <Box sx={{ pl: 2 }}>
            <FormGroup>
              {Object.entries(settings.notifyOn).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) => 
                        handleSettingChange(`notifyOn.${key}`, e.target.checked)
                      }
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </FormGroup>
          </Box>

          <Divider />

          <ListItem>
            <ListItemText 
              primary="Email Digest"
              secondary={`Currently set to: ${settings.emailDigest}`}
            />
            <ListItemSecondaryAction>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setOpenDigestDialog(true)}
              >
                Change
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Dialog 
          open={openDigestDialog} 
          onClose={() => setOpenDigestDialog(false)}
        >
          <DialogTitle>Email Digest Frequency</DialogTitle>
          <DialogContent>
            <List>
              {['daily', 'weekly', 'never'].map((option) => (
                <ListItem 
                  button
                  key={option}
                  onClick={() => {
                    handleSettingChange('emailDigest', option);
                    setOpenDigestDialog(false);
                  }}
                  selected={settings.emailDigest === option}
                >
                  <ListItemText 
                    primary={option.charAt(0).toUpperCase() + option.slice(1)}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDigestDialog(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default NotificationSettings; 