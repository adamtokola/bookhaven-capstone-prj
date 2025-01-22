import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Link,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link as RouterLink } from 'react-router-dom';

function ReportsManager() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [moderationNote, setModerationNote] = useState('');

  useEffect(() => {
    fetchReports();
  }, [currentTab]);

  const fetchReports = async () => {
    try {
      const status = currentTab === 0 ? 'pending' : currentTab === 1 ? 'resolved' : 'dismissed';
      const response = await fetch(`http://localhost:5001/admin/reports?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setModerationNote('');
    setOpenDialog(true);
  };

  const handleModerateReport = async (action) => {
    try {
      const response = await fetch(`http://localhost:5001/admin/reports/${selectedReport.id}/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          action,
          moderationNote,
        }),
      });

      if (!response.ok) throw new Error('Failed to moderate report');

      fetchReports();
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to moderate report');
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      case 'dismissed': return 'error';
      default: return 'default';
    }
  };

  const getReportTypeDetails = (report) => {
    switch (report.type) {
      case 'review':
        return {
          title: 'Review Report',
          content: report.review.comment,
          link: `/books/${report.review.bookId}`,
        };
      case 'book':
        return {
          title: 'Book Report',
          content: report.book.title,
          link: `/books/${report.book.id}`,
        };
      default:
        return {
          title: 'Unknown Report Type',
          content: '',
          link: '',
        };
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Content Reports</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Pending" />
        <Tab label="Resolved" />
        <Tab label="Dismissed" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Chip
                    label={report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{report.reportedBy.username}</TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>
                  {new Date(report.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.status}
                    color={getStatusChipColor(report.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewReport(report)}
                    color="primary"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    No {currentTab === 0 ? 'pending' : currentTab === 1 ? 'resolved' : 'dismissed'} reports
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedReport && (
          <>
            <DialogTitle>Report Details</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {getReportTypeDetails(selectedReport).title}
                  </Typography>
                  <Typography variant="body1">
                    {getReportTypeDetails(selectedReport).content}
                  </Typography>
                  <Link
                    component={RouterLink}
                    to={getReportTypeDetails(selectedReport).link}
                    sx={{ mt: 1, display: 'block' }}
                  >
                    View Content
                  </Link>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Report Reason
                  </Typography>
                  <Typography variant="body1">
                    {selectedReport.reason}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Moderation Note"
                  multiline
                  rows={3}
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  disabled={selectedReport.status !== 'pending'}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              {selectedReport.status === 'pending' && (
                <>
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={() => handleModerateReport('dismiss')}
                    color="error"
                  >
                    Dismiss
                  </Button>
                  <Button
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleModerateReport('resolve')}
                    variant="contained"
                    color="success"
                  >
                    Resolve
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default ReportsManager; 