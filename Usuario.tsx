import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  ListItemIcon,
  Fade,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import PublicIcon from '@mui/icons-material/Public';

import { logout, getUserProfile } from '@/services/authService';

interface Perfil {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  cargo: { id: number; nombre: string };
  pais: { id: number; nombre: string };
}

const Usuario: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openPerfil, setOpenPerfil] = useState(false);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setPerfil(data);
      })
      .catch(() => {
        setPerfil(null);
      });
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleOpenPerfil = () => {
    setOpenPerfil(true);
    handleCloseMenu();
  };

  const handleClosePerfil = () => {
    setOpenPerfil(false);
  };

  return (
    <>
      <Tooltip title={`${perfil?.first_name?.trim() || perfil?.username || 'Usuario'}`}>
        <IconButton onClick={handleOpenMenu} size="small" sx={{ ml: 2 }}>
          <Avatar sx={{ width: 32, height: 32 }} />
        </IconButton>
      </Tooltip>


      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 4,
          sx: { mt: 1.5, borderRadius: 2, minWidth: 200 },
        }}
      >
        <MenuItem disabled>
          <Typography variant="body1" fontWeight="bold">
            {perfil ? `${perfil.first_name} ${perfil.last_name}` : 'Usuario'}
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleOpenPerfil}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Perfil
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Salir
        </MenuItem>
      </Menu>

      {/* Popup modal para mostrar el perfil */}
      <Dialog open={openPerfil} onClose={handleClosePerfil} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Perfil del Usuario
        </DialogTitle>
        <DialogContent dividers>
          {perfil ? (
            <Stack spacing={2}>
              <Typography><BadgeIcon fontSize="small" sx={{ mr: 1 }} />{perfil.first_name} {perfil.last_name}</Typography>
              <Typography><EmailIcon fontSize="small" sx={{ mr: 1 }} />{perfil.email}</Typography>
              <Typography><Person fontSize="small" sx={{ mr: 1 }} />{perfil.username}</Typography>
              <Typography><WorkIcon fontSize="small" sx={{ mr: 1 }} />{perfil.cargo.nombre}</Typography>
              <Typography><PublicIcon fontSize="small" sx={{ mr: 1 }} />{perfil.pais.nombre}</Typography>
            </Stack>
          ) : (
            <Typography>No se pudo cargar el perfil.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePerfil} variant="contained" color="primary" fullWidth>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Usuario;
