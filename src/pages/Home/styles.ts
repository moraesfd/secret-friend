import styled from "styled-components";

export const HomeContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  min-height: calc(100vh - 80px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 2rem;

  @media (min-width: 640px) {
    padding: 2.5rem;
    padding-top: 3rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem;
    justify-content: flex-start;
  }

  @media (min-width: 1280px) {
    padding: 5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;

    @media (min-width: 640px) {
      gap: 3rem;
    }

    @media (min-width: 1024px) {
      gap: 3.5rem;
    }
  }
`;

export const BaseButton = styled.button`
  width: 100%;
  border: 0;
  padding: 1rem;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme['gray-100']};

  gap: 0.5rem;
  font-weight: bold;

  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const StartButton = styled(BaseButton)`
  background: ${props => props.theme['blue-500']};
  color: ${props => props.theme['gray-100']};

  &:not(:disabled):hover {
    background: ${props => props.theme['blue-700']};
  }
`;