import React, { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import linkedinUrl from '@/assets/icon-linkedin.svg';
import twitterUrl from '@/assets/icon-x.svg';
import telegramUrl from '@/assets/icon-telegram.svg';
import githubUrl from '@/assets/icon-github.svg';
import mediumUrl from '@/assets/icon-medium.svg';

const FooterContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-gap: 32px;
  align-items: center;
  ${({ theme: { color, font } }) => css`
    background: ${color.paper};
    color: ${color.text.normal};
    font-size: ${font.size.tiny};
  `}
`;

const NaymsLinks = styled.div`
  display: flex;
  gap: 24px;
  justify-self: end;
  white-space: nowrap;
`;

const Copyright = styled.span``;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
`;

type ExternalLinkProps = {
  href: string;
  icon?: string;
};

const ExternalMediaIcon = styled.img`
  display: block;
  width: 24px;
  height: 24px;
`;

const ExternalLink: React.FC<PropsWithChildren<ExternalLinkProps>> = ({ icon, href, children }) => {
  const rel = href.match(/^https?:\/\/(?:www.)?nayms.com/i) ? undefined : 'noopener noreferrer';

  return (
    <a href={href} target="_blank" rel={rel}>
      {icon && <ExternalMediaIcon src={icon} />}
      {children}
    </a>
  );
};

export const Footer = () => {
  const copyrightLine = `©Nayms ${new Date().getFullYear()}`;

  return (
    <FooterContainer>
      <NaymsLinks>
        <ExternalLink href="https://www.nayms.com/agreements/terms-of-use">Terms and Conditions</ExternalLink>
        <ExternalLink href="https://www.nayms.com/agreements/privacy-policy">Privacy Policy</ExternalLink>
      </NaymsLinks>

      <Copyright>{copyrightLine}</Copyright>

      <SocialLinks>
        <ExternalLink icon={linkedinUrl} href="https://linkedin.com/company/nayms" />
        <ExternalLink icon={twitterUrl} href="https://twitter.com/nayms" />
        <ExternalLink icon={telegramUrl} href="https://t.me/naymscommunity" />
        <ExternalLink icon={mediumUrl} href="https://medium.com/nayms" />
        <ExternalLink icon={githubUrl} href="https://github.com/nayms" />
      </SocialLinks>
    </FooterContainer>
  );
};
