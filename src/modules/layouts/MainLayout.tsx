import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router';
import { Navbar } from '@/components/Navbar.tsx';
import { Footer } from '@/components/Footer.tsx';
import { Toaster } from 'react-hot-toast';

const LayoutContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  //background-image: radial-gradient(
  //  circle at right center,
  //  #4b296980,
  //  #563277 25%,
  //  #4a378c 40%,
  //  #4066a8 65%,
  //  #32517380
  //);
  //mask-image: radial-gradient(ellipse 150% 30% at center center, #000 20%, #00000080 50%, #0000);
  //opacity: 0.5;
`;

const NavbarContainer = styled.div`
  position: relative;
  height: 64px;
  z-index: 3;
`;

const ContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  z-index: 2;
`;

const FooterContainer = styled.div`
  height: 50px;
  z-index: 2;
`;

export const MainLayout: React.FC = () => (
  <LayoutContainer>
    <Background />
    <Toaster position="top-center" reverseOrder={false} />

    <NavbarContainer>
      <Navbar />
    </NavbarContainer>

    <ContentContainer>
      <Outlet />
    </ContentContainer>

    <FooterContainer>
      <Footer />
    </FooterContainer>
  </LayoutContainer>
);
