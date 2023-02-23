import React from 'react';
import logo from '../../../logo.svg';
import './Header.css';
import {IconButton, Menu, MenuItem, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const settings = ['Login', 'Register'];

function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <header className="header">
      <div className="header-wrapper">
        <a className="header-logo" href="/" rel="noopener noreferrer">
          <img src={logo} alt="logo" />
        </a>
        <IconButton className={"header-menu-button"} onClick={handleOpenUserMenu} color={"primary"}>
          <MenuIcon/>
        </IconButton>
        <Menu
          sx={{ mt: '45px' }}
          id="header-menu"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography textAlign="center">{setting}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </header>
  );
}

export default Header;
