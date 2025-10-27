import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  ListItemButton, 
  Divider,       
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Book as BookIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  Group as GroupIcon, 
  SupervisorAccount as AdminUsersIcon,
  RateReview as AudienceIcon, 
  EditNote as WriterIcon,
  // User as AdminIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice'; 

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Writers', icon: <WriterIcon />, path: '/admin/writers' },
  { text: 'Stories', icon: <BookIcon />, path: '/admin/stories' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Target Audience', icon: <AudienceIcon />, path: '/admin/target-audience' }, 
  { text: 'Admin Profile', icon: <AdminUsersIcon />, path: '/admin/admin-profile' }, 
];

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActive = (path) => {
     if (path === '/admin/dashboard') {
         return location.pathname === path;
     }
    return location.pathname.startsWith(path) && path !== '/';
  };

  const drawer = (
    <div>
      {/* Sidebar Header */}
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          Versera Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleMenuClick(item.path)}
              sx={{ 
                  '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected, 
                      borderLeft: `4px solid ${theme.palette.primary.main}`, 
                      '& .MuiListItemIcon-root': { 
                          color: theme.palette.primary.main,
                      },
                      '& .MuiListItemText-primary': { 
                          fontWeight: '600',
                          color: theme.palette.primary.main,
                      },
                  },
                  '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                  },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.secondary }}> 
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? '600' : '400',
                    color: isActive(item.path) ? 'primary.main' : 'text.primary', 
                 }}
                />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
       <Divider sx={{ my: 1 }} />
       <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
             <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
               <LogoutIcon />
             </ListItemIcon>
             <ListItemText primary="Logout" />
          </ListItemButton>
       </ListItem>
    </div>
  );

  const currentPageTitle = menuItems.find(item => isActive(item.path))?.text || 'Admin Panel';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar
        position="fixed"
        elevation={1} 
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper', 
          color: 'text.primary', 
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
             {currentPageTitle}
          </Typography>
          <IconButton title="Logout" color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(0, 0, 0, 0.12)' }, 
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;