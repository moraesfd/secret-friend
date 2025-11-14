import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: linear-gradient(135deg, ${props => props.theme['purple-600'] || '#9333ea'} 0%, ${props => props.theme['blue-600'] || '#2563eb'} 100%);
  box-shadow: 0 4px 20px 0 rgba(147, 51, 234, 0.2);
  border-bottom: 3px solid rgba(255, 255, 255, 0.1);

  @media (min-width: 640px) {
    padding: 1.25rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 1.5rem 3.5rem;
  }

  nav {
    display: flex;
    gap: 0.5rem;

    @media (min-width: 640px) {
      gap: 0.75rem;
    }

    a {
      width: 2.75rem; 
      height: 2.75rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.2);

      display: flex;
      align-items: center;
      justify-content: center;

      color: white;
      transition: all 0.3s ease-in-out;

      @media (min-width: 640px) {
        width: 3.25rem;
        height: 3.25rem;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      }

      &.active {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.6);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }
    }
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (min-width: 640px) {
    gap: 1rem;
  }
  
  img {
    width: 32px;
    height: 32px;
    
    @media (min-width: 640px) {
      width: 40px;
      height: 40px;
    }
  }

  span {
    font-size: 1.1rem;
    font-weight: 800;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: -0.5px;
    
    @media (min-width: 480px) {
      font-size: 1.25rem;
    }
    
    @media (min-width: 640px) {
      font-size: 1.4rem;
    }
    
    @media (max-width: 480px) {
      display: none;
    }
  }
`