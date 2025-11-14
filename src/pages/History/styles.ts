import styled from "styled-components";

export const HistoryContainer = styled.div`
  flex: 1;
  padding: 1rem;
  min-height: calc(100vh - 80px);

  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    padding: 2rem;
  }

  @media (min-width: 1024px) {
    padding: 3.5rem;
  }

  h1 {
    font-size: 1.5rem;
    color: ${props => props.theme['gray-100']};

    @media (min-width: 640px) {
      font-size: 1.875rem;
    }
  }
`;

export const HistoryList = styled.div`
  flex: 1;
  overflow: auto;
  margin-top: 1rem;

  @media (min-width: 640px) {
    margin-top: 2rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    th {
      background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
      padding: 1rem 1.5rem;
      text-align: left;
      color: white;
      font-size: 0.875rem;
      font-weight: 700;
      line-height: 1.6;
      border-bottom: none;
      text-transform: uppercase;
      letter-spacing: 0.05em;

      @media (min-width: 640px) {
        padding: 1.25rem 1.5rem;
        font-size: 0.9rem;
      }

      &:first-child {
        padding-left: 2rem;
      }

      &:last-child {
        padding-right: 2rem;
      }
    }

    td {
      background-color: rgba(255, 255, 255, 0.8);
      border-bottom: 1px solid rgba(229, 231, 235, 0.3);
      padding: 1rem 1.5rem;
      font-size: 0.875rem;
      line-height: 1.6;
      color: #374151;
      transition: all 0.2s ease;

      @media (min-width: 640px) {
        padding: 1.25rem 1.5rem;
        font-size: 0.9rem;
      }

      &:first-child {
        padding-left: 2rem;
        font-weight: 600;
        color: #1f2937;
      }

      &:last-child {
        padding-right: 2rem;
      }
    }

    tbody tr {
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba(139, 92, 246, 0.05);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.1);
      }
      
      &:hover td {
        background-color: transparent;
      }
    }

    tbody tr:last-child td {
      border-bottom: none;
    }
  }
`;

const STATUS_COLORS = {
  yellow: '#eab308',
  green: '#3b82f6',
  red: '#ef4444',
} as const;

interface StatusProps {
  statusColor: keyof typeof STATUS_COLORS;
}

export const Status = styled.span<StatusProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: ${props => STATUS_COLORS[props.statusColor]};
  }
`;