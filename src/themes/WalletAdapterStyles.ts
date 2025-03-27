import { createGlobalStyle, withTheme } from 'styled-components';

export const WalletAdapterStyles = withTheme(createGlobalStyle`
  .wallet-adapter-dropdown {
    position: relative;
    display: inline-block;
    font: ${({ theme }) => theme.font.short()};
    color: ${({ theme }) => theme.color.text.normal};

    button {
      font: ${({ theme }) => theme.font.short()};
    }

    .wallet-adapter-button {
    }

    .wallet-adapter-button-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      width: 100%;
      padding: 0 16px;
      border: none;
      border-radius: 8px;
      color: white;

      background-color: ${({ theme }) => theme.color.text.control};

      font-size: 14px;
      font-weight: 500;

      cursor: pointer;

      &:not(:disabled) {
        &:focus {
          box-shadow: 0 0 8px 4px #293bba40;
        }

        &:focus-visible {
          outline: #ffffff80 solid 3px;
        }

        &:hover {
          background-color: ${({ theme }) => theme.color.text.active};
        }
      }

      &:disabled {
        background-color: #d8dbf9;
        cursor: not-allowed;
      }
    }
  }

  .wallet-adapter-button-end-icon,
  .wallet-adapter-button-start-icon,
  .wallet-adapter-button-end-icon img,
  .wallet-adapter-button-start-icon img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .wallet-adapter-button-end-icon {
    margin-left: 12px;
  }

  .wallet-adapter-button-start-icon {
    margin-right: 12px;
  }

  .wallet-adapter-collapse {
    width: 100%;
  }

  .wallet-adapter-dropdown-list {
    position: absolute;
    z-index: 99;
    display: grid;
    grid-template-rows: 1fr;
    grid-row-gap: 10px;
    padding: 10px;
    top: 100%;
    right: 0;
    margin: 0;
    list-style: none;
    background: white;
    border: 1px solid #E5E7F6;
    border-radius: 12px;
    box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.10);
    opacity: 0;
    visibility: hidden;
    transition: opacity 200ms ease, transform 200ms ease, visibility 200ms;
  }

  .wallet-adapter-dropdown-list-active {
    opacity: 1;
    visibility: visible;
    transform: translateY(10px);
  }

  .wallet-adapter-dropdown-list-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border: none;
    outline: none;
    cursor: pointer;
    white-space: nowrap;
    box-sizing: border-box;
    padding: 10px 20px;
    width: 100%;
    border-radius: 8px;
    font-size: 14px;

    &:not(:disabled):hover {
      background-color: #F5F7FF;
    }
  }

  // *** Modal ***
  .wallet-adapter-modal-collapse-button {
    svg {
      align-self: center;
      fill: #999;
    }

    &.wallet-adapter-modal-collapse-button-active svg {
      transform: rotate(180deg);
      transition: transform ease-in 150ms;
    }
  }

  .wallet-adapter-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    font-family: Inter, sans-serif;
    font-size: 14px;
    transition: opacity linear 150ms;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1040;
    overflow-y: auto;

    &.wallet-adapter-modal-fade-in {
      opacity: 1;
    }
  }


  .wallet-adapter-modal-button-close {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 12px;
    right: 18px;
    padding: 12px;
    cursor: pointer;
    border: none;
    border-radius: 50%;

    background-color: transparent;
    will-change: background-color;
    transition: background-color .2s;
    z-index: 2;

    &:focus-visible {
      outline-color: white;
      background-color: #E5E7F6
    }

    svg {
      fill: #777;
      transition: fill 200ms ease 0s;
    }

    &:hover {
      background-color: #e5e7f6;

      svg {
        fill: #333;
      }
    }
  }

  .wallet-adapter-modal-overlay {
    position: fixed;
    background: #ffffff80;
    backdrop-filter: blur(3px);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .wallet-adapter-modal-container {
    display: flex;
    margin: 3rem;
    min-height: calc(100vh - 6rem); /* 100vh - 2 * margin */
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 480px) {
    .wallet-adapter-modal-container {
      margin: 1rem;
      min-height: calc(100vh - 2rem); /* 100vh - 2 * margin */
    }
  }

  .wallet-adapter-modal-wrapper {
    position: relative;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    flex-direction: column;
    z-index: 1050;
    max-width: 400px;
    border-radius: 10px;
    background: white;
    box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.6);
    flex: 1;
  }

  .wallet-adapter-modal-title {
    position: relative;
    display: block;
    width: 100%;
    font: ${({ theme }) => theme.font.short({ weight: 'medium', lineHeight: 1.5 })};
    padding: 20px;
    border-bottom: 1px solid #e5e7f6;
    z-index: 1;
  }

  .wallet-adapter-modal-list {
    position: relative;
    margin: 20px 0;
    padding: 0 20px;
    width: 100%;
    list-style: none;

    .wallet-adapter-button {
      display: flex;
      align-items: center;
      height: 48px;
      width: 100%;
      padding: 8px 16px;
      border: none;
      border-radius: 8px;

      color: #5c6175;
      background-color: transparent;

      font-size: 14px;
      font-weight: 500;

      cursor: pointer;

      &:not(:disabled) {
        &:focus {
          box-shadow: 0 0 8px 4px #293bba40;
        }

        &:focus-visible {
          outline: #ffffff80 solid 3px;
        }

        &:hover {
          background-color: #e5e7f6;

        }
      }

      &:disabled {
        background-color: #d8dbf9;
        cursor: not-allowed;
      }

      span {
        margin-left: auto;
        font-size: 14px;
        opacity: .6;
      }
    }

    .wallet-adapter-button-end-icon,
    .wallet-adapter-button-start-icon,
    .wallet-adapter-button-end-icon img,
    .wallet-adapter-button-start-icon img {
      width: 28px;
      height: 28px;
    }
  }

  .wallet-adapter-modal-list-more {
    cursor: pointer;
    border: none;
    padding: 12px 24px 24px 12px;
    align-self: flex-end;
    display: flex;
    align-items: center;
    background-color: transparent;

    svg {
      transition: all 0.1s ease;
      fill: ${({ theme }) => theme.color.text.normal};
      margin-left: 0.5rem;
    }
  }

  .wallet-adapter-modal-list-more-icon-rotate {
    transform: rotate(180deg);
  }

  .wallet-adapter-modal-middle {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
    z-index: 1;

    > svg:first-child:last-child {
      margin: 40px auto;
    }
  }

  .wallet-adapter-modal-middle-button {
    display: block;
    cursor: pointer;
    margin-top: 48px;
    width: 100%;
    background-color: #1b37f2;
    padding: 12px;
    font-size: 18px;
    border: none;
    border-radius: 8px;
  }
`);
