import { Col, Row, Table } from "antd";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { Stack } from "@/components/Stack";
import "@/styles/Table.css";

const Container = styled.div`
  padding: 20px;
`;

const SectionCard = styled.div`
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 32px;
  color: #262626;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 500;
    border-bottom: 1px solid #e8e8e8;
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: #8c8c8c;
  font-size: 14px;
`;

const MemoryInfo = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 8px;
`;

export const MachineStateViewer = () => {
  const { mvsState } = useAppData();
  
  const columns = [
    {
      title: "Endereço",
      dataIndex: "address",
      width: 100,
    },
    {
      title: "Valor",
      dataIndex: "value",
      render: (value) => value ?? 0,
    },
  ];

  const memoryData = mvsState.memory?.map((value, index) => ({
    key: index,
    address: index,
    value,
  })) || [];

  return (
    <Container>
      <Row gutter={16}>
        <Col span={14}>
          <SectionCard>
            <SectionTitle>Tabela de variáveis</SectionTitle>
            {memoryData.length > 0 ? (
              <>
                <StyledTable
                  dataSource={memoryData}
                  columns={columns}
                  pagination={false}
                  size="small"
                />
                <MemoryInfo>
                  {memoryData.length} posições alocadas
                </MemoryInfo>
              </>
            ) : (
              <EmptyState>
                Nenhuma variável alocada
              </EmptyState>
            )}
          </SectionCard>
        </Col>
        
        <Col span={10}>
          <SectionCard>
            <SectionTitle>Pilha (Stack)</SectionTitle>
            <Stack data={mvsState?.stack} />
          </SectionCard>
        </Col>
      </Row>
    </Container>
  );
};