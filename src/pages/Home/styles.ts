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

  > * {
    width: 100%;
    max-width: 640px;
  }

  @media (min-width: 640px) {
    padding: 2rem;
    padding-top: 3rem;
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