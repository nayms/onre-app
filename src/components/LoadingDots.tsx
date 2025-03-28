import styled, { keyframes } from 'styled-components';

const jumpAnimation = keyframes`
  0%, 50%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-5px);
  }
`;

const StyledLoadingDots = styled.svg`
  vertical-align: middle;
  path:nth-child(1) {
    animation: ${jumpAnimation} 1.25s infinite;
    animation-delay: 0s;
  }

  path:nth-child(2) {
    animation: ${jumpAnimation} 1.25s infinite;
    animation-delay: 0.15s;
  }

  path:nth-child(3) {
    animation: ${jumpAnimation} 1.25s infinite;
    animation-delay: 0.3s;
  }
`;

type LoadingDotsProps = {
  color?: string | undefined;
};

export const LoadingDots = ({ color }: LoadingDotsProps) => (
  <StyledLoadingDots xmlns="http://www.w3.org/2000/svg" width="22" height="17" viewBox="0 0 22 7" fill="none">
    <path
      d="M0 4.5C0 5.16304 0.263393 5.79893 0.732234 6.26777C1.20107 6.73661 1.83696 7 2.5 7C3.16304 7 3.79893 6.73661 4.26777 6.26777C4.73661 5.79893 5 5.16304 5 4.5C5 3.83696 4.73661 3.20107 4.26777 2.73223C3.79893 2.26339 3.16304 2 2.5 2C1.83696 2 1.20107 2.26339 0.732234 2.73223C0.263393 3.20107 0 3.83696 0 4.5Z"
      fill={color ?? '#1b37f2'}
    />
    <path
      d="M8.16699 4.5C8.16699 5.16304 8.43038 5.79893 8.89923 6.26777C9.36807 6.73661 10.004 7 10.667 7C11.33 7 11.9659 6.73661 12.4348 6.26777C12.9036 5.79893 13.167 5.16304 13.167 4.5C13.167 3.83696 12.9036 3.20107 12.4348 2.73223C11.9659 2.26339 11.33 2 10.667 2C10.004 2 9.36807 2.26339 8.89923 2.73223C8.43038 3.20107 8.16699 3.83696 8.16699 4.5Z"
      fill={color ?? '#1b37f2'}
    />
    <path
      d="M16.3335 4.5C16.3335 5.16304 16.5969 5.79893 17.0657 6.26777C17.5346 6.73661 18.1705 7 18.8335 7C19.4965 7 20.1324 6.73661 20.6013 6.26777C21.0701 5.79893 21.3335 5.16304 21.3335 4.5C21.3335 3.83696 21.0701 3.20107 20.6013 2.73223C20.1324 2.26339 19.4965 2 18.8335 2C18.1705 2 17.5346 2.26339 17.0657 2.73223C16.5969 3.20107 16.3335 3.83696 16.3335 4.5Z"
      fill={color ?? '#1b37f2'}
    />
  </StyledLoadingDots>
);
