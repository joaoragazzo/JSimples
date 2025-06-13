import { Button, Col, Row, Table } from "antd";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { Stack } from "@/components/Stack";
import "@/styles/Table.css";

const CellTitle = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`;

export const MachineStateViewer = () => {
  const { vmRef, runMvsStepByStep, setMvsState, mvsState } = useAppData();

  const columns = [
    {
      title: "Endereço",
      dataIndex: "address",
      width: 80,
    },
    {
      title: "Valor",
      dataIndex: "value",
      render: (value) => value ?? 0,
    },
  ];

  return (
    <Row gutter={24}>
      <Col span={14}>
        <div>
          <CellTitle>Tabela de variáveis</CellTitle>
          <Table
            dataSource={mvsState.memory?.map((value, index) => ({
              key: index,
              address: index,
              value,
            }))}
            columns={columns}
          />
        </div>
      </Col>
      <Col span={10}>
        <CellTitle>Pilha (Stack)</CellTitle>
        <Stack data={mvsState?.stack} />
      </Col>
      <Button onClick={runMvsStepByStep}>Começar</Button>
      <Button
        onClick={() => {
          setMvsState(vmRef.current?.next());
        }}
      >
        Próximo
      </Button>
    </Row>
  );
};
