import React from 'react';
import styled from 'styled-components';

const StyledNavbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  border-bottom: 1px solid ${props => props.theme.color.navbar.border};
  background-color: ${props => props.theme.color.navbar.background};
  font-family: ${props => props.theme.font.family};
`;

export const Navbar: React.FC = () => <StyledNavbar>Navbar</StyledNavbar>;
