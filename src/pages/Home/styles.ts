import styled from "styled-components";

export const HomeContainer = styled.div`
  flex: 1;
  padding: 3.5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
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