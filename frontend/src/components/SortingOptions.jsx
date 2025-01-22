import { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Sort as SortIcon,
  TrendingUp as TrendingUpIcon,
  StarRate as StarRateIcon,
  DateRange as DateRangeIcon,
  Title as TitleIcon,
  Person as PersonIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  SwapVert as SwapVertIcon,
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';

const sortOptions = [
  {
    id: 'relevance',
    label: 'Relevance',
    icon: <TrendingUpIcon />,
    group: 'default',
    noDirection: true
  },
  {
    id: 'rating',
    label: 'Rating',
    icon: <StarRateIcon />,
    group: 'metrics'
  },
  {
    id: 'date',
    label: 'Publication Date',
    icon: <DateRangeIcon />,
    group: 'metrics'
  },
  {
    id: 'title',
    label: 'Title',
    icon: <TitleIcon />,
    group: 'alphabetical'
  },
  {
    id: 'author',
    label: 'Author',
    icon: <PersonIcon />,
    group: 'alphabetical'
  },
  {
    id: 'popularity',
    label: 'Popularity',
    icon: <ThumbUpIcon />,
    group: 'metrics'
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: <CommentIcon />,
    group: 'metrics'
  }
];

const groupLabels = {
  default: 'Default',
  metrics: 'Metrics',
  alphabetical: 'Alphabetical'
};

function SortingOptions() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const currentSort = searchParams.get('sort')?.split('_')[0] || 'relevance';
  const currentDirection = searchParams.get('sort')?.includes('_desc') ? 'desc' : 'asc';
  
  const currentSortOption = sortOptions.find(option => option.id === currentSort);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (sortId) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const option = sortOptions.find(opt => opt.id === sortId);
    
    if (option.noDirection) {
      newSearchParams.set('sort', sortId);
    } else {
      // If changing to a new sort type, use default direction (desc for metrics, asc for alphabetical)
      const defaultDirection = option.group === 'metrics' ? 'desc' : 'asc';
      newSearchParams.set('sort', `${sortId}_${defaultDirection}`);
    }
    
    newSearchParams.set('page', '1');
    navigate(`/search?${newSearchParams.toString()}`);
    handleClose();
  };

  const toggleDirection = () => {
    if (currentSortOption?.noDirection) return;
    
    const newSearchParams = new URLSearchParams(searchParams);
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    newSearchParams.set('sort', `${currentSort}_${newDirection}`);
    newSearchParams.set('page', '1');
    navigate(`/search?${newSearchParams.toString()}`);
  };

  const renderSortGroups = () => {
    const groups = [...new Set(sortOptions.map(option => option.group))];
    return groups.map((group, index) => {
      const groupOptions = sortOptions.filter(option => option.group === group);
      return (
        <Box key={group}>
          {index > 0 && <Divider />}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ px: 2, py: 1, display: 'block' }}
          >
            {groupLabels[group]}
          </Typography>
          {groupOptions.map((option) => (
            <MenuItem
              key={option.id}
              onClick={() => handleSortChange(option.id)}
              selected={currentSort === option.id}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText 
                primary={option.label}
                secondary={
                  currentSort === option.id && !option.noDirection
                    ? `Sorted ${currentDirection === 'asc' ? 'ascending' : 'descending'}`
                    : null
                }
              />
              {currentSort === option.id && !option.noDirection && (
                <Box component="span" sx={{ ml: 1 }}>
                  {currentDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </Box>
              )}
            </MenuItem>
          ))}
        </Box>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        startIcon={<SortIcon />}
        endIcon={currentSortOption?.icon}
        onClick={handleClick}
        color="inherit"
        sx={{ textTransform: 'none' }}
      >
        <Typography variant="body2" sx={{ mr: 1 }}>
          Sort by:
        </Typography>
        <Typography variant="body2" color="primary">
          {currentSortOption?.label}
        </Typography>
      </Button>

      {!currentSortOption?.noDirection && (
        <Tooltip title="Toggle sort direction">
          <IconButton
            size="small"
            onClick={toggleDirection}
            sx={{ ml: 1 }}
          >
            {currentDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </IconButton>
        </Tooltip>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {renderSortGroups()}
      </Menu>
    </Box>
  );
}

export default SortingOptions; 