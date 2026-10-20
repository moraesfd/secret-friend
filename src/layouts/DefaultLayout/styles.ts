import styled from "styled-components";

export const LayoutContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0;

  background: linear-gradient(135deg, 
    #f8fafc 0%, 
    #e2e8f0 25%,
    #f1f5f9 50%,
    #e7e5ff 75%,
    #f3f4f6 100%
  );
  
  display: flex;
  flex-direction: column;
`;