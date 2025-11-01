import { Button, Col, Collapse, List, Row, Table } from "antd";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { Stack } from "@/components/Stack";
import "@/styles/Table.css";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { IoWarning } from "react-icons/io5";
import { AiFillCaretRight } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";
import { Pointer } from "@/components/Pointer";
import { COLORS } from "@/constants/theme";

const Container = styled.div`
  min-height: 70px;
  padding: 0 10px;

  @media (max-width: 768px) {
    padding: 0 5px;
  }
`;

const SectionCard = styled.div`
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PointersCard = styled(SectionCard)`
  padding: 8px 0px;
  height: max-content;
  width: 100%;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const PointersTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  margin-right: 25px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
    font-size: 14px;
  }
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #262626;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SecondarySection = styled.div`
  background: #fff;
  margin-top: 16px;
  border-radius: 8px;
  display: flex;
  height: auto;
  min-height: 310px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  @media (max-width: 768px) {
    margin-top: 10px;
    padding: 5px;
  }
`;

const ArrowCell = styled.div`
  text-align: center;
`;

const ControlBar = styled.div`
  margin: 20px 0px;
  display: flex;
  gap: 15px;
  flex-direction: column;
  width: 100%;

  @media (max-width: 768px) {
    margin: 15px 0;
    gap: 10px;
  }
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 100%;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 1200px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;

const StackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 120px;

  @media (max-width: 768px) {
    min-width: 100px;
  }
`;

const MarginRightArrow = styled(FaArrowRight)`
  margin-right: 30px;

  @media (max-width: 768px) {
    margin-right: 15px;
  }
`;

const JustExecutedArrow = styled(MarginRightArrow)`
  fill: ${COLORS.arrow.justExecuted};
`;

const NextToExecuteArrow = styled(MarginRightArrow)`
  fill: ${COLORS.arrow.nextToExecute};
`;

const Warning = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 5px;
  }
`;

const WarningWrapper = styled.div`
  padding: 15px;
  background-color: oklch(95.4% 0.038 75.164);
  color: oklch(55.3% 0.195 38.402);
  border-radius: 10px;
  border: 1px solid oklch(55.3% 0.195 38.402);

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const PointersContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const ResponsiveTable = styled(Table)`
  .ant-table-thead > tr > th {
    @media (max-width: 768px) {
      font-size: 12px;
      padding: 8px 4px;
    }
  }

  .ant-table-tbody > tr > td {
    @media (max-width: 768px) {
      font-size: 12px;
      padding: 6px 4px;
    }
  }

  @media (max-width: 768px) {
    .ant-table-container {
      font-size: 12px;
    }
  }
`;

const ResponsiveRow = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

/**
 * Configuração das colunas da tabela de instruções
 */
const getInstructionColumns = (executed, lastExecuted) => [
  {
    title: "",
    dataIndex: "key",
    width: 30,
    render: (_, record, index) => {
      if (index === executed) {
        return (
          <ArrowCell>
            <NextToExecuteArrow />
          </ArrowCell>
        );
      }
      if (index === lastExecuted) {
        return (
          <ArrowCell>
            <JustExecutedArrow />
          </ArrowCell>
        );
      }
      return null;
    },
  },
  {
    title: "Endereço",
    dataIndex: "address",
    width: 60,
    render: (_, __, index) => index,
  },
  {
    title: "Rótulo",
    dataIndex: "label",
    width: 40,
  },
  {
    title: "Instrução",
    dataIndex: "instruction",
    width: 50,
  },
  {
    title: "Parâmetro",
    dataIndex: "parameter",
    width: 60,
  },
];

/**
 * Legenda das setas de execução
 */
const getLegendItems = () => [
  <div key="next">
    <NextToExecuteArrow /> Ponteiro para a próxima instrução
  </div>,
  <div key="last">
    <JustExecutedArrow /> Última instrução executada
  </div>,
];

/**
 * Componente para visualização do estado da máquina MVS
 */
export const MachineStateViewer = () => {
  const controlBarRef = useRef(null);
  const legendRef = useRef(null);
  const [lastExecuted, setLastExecuted] = useState(-1);
  const [executed, setExecuted] = useState(0);
  const { mvsState, parserResponse, vmRef, resetVm, setMvsState } = useAppData();

  // Atualiza os ponteiros de execução
  useEffect(() => {
    setLastExecuted(executed);
    setExecuted(mvsState.instructionPointer);
  }, [mvsState.instructionPointer]);

  const columnsInstructions = getInstructionColumns(executed, lastExecuted);
  const legendItems = getLegendItems();
  const hasMvsCode = parserResponse?.mvs?.length > 0;

  /**
   * Executa a próxima instrução
   */
  const handleExecuteNext = () => {
    setMvsState(vmRef.current?.next());
  };

  return (
    <Container>
      <ResponsiveRow>
        <PointersCard>
          <PointersTitle>Registradores:</PointersTitle>
          <PointersContainer>
            <Pointer value={mvsState?.instructionPointer} label={"I"} />
            <Pointer
              value={mvsState?.stack.length + (mvsState?.memory?.length || 0)}
              label={"S"}
            />
            <Pointer value={mvsState?.dPointer || -1} label={"D"} />
          </PointersContainer>
        </PointersCard>
      </ResponsiveRow>

      <ResponsiveRow>
        <SecondarySection>
          {hasMvsCode && (
            <TableWrapper>
              <ResponsiveTable
                columns={columnsInstructions}
                dataSource={parserResponse.mvs}
                pagination={false}
                size="small"
                rowKey="key"
                scroll={{ y: 460, x: "max-content" }}
              />

              <StackWrapper>
                <SectionTitle>Pilha M</SectionTitle>
                <Stack variables={mvsState?.memory || []} data={mvsState?.stack} />
              </StackWrapper>
            </TableWrapper>
          )}

          <ControlBar ref={controlBarRef}>
            {!hasMvsCode && (
              <WarningWrapper>
                <Warning>
                  <IoWarning size={30} />
                  <strong>Atenção: </strong>Não existe nenhum código MVS para ser executado. É
                  necessário compilar o algoritmo primeiro.
                </Warning>
              </WarningWrapper>
            )}
            {hasMvsCode && (
              <Collapse
                items={[
                  {
                    key: '1',
                    label: <strong>Legenda</strong>,
                    children: (
                      <List
                        ref={legendRef}
                        dataSource={legendItems}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                        size="small"
                      />
                    ),
                  },
                ]}
                defaultActiveKey={['1']}
                size="small"
              />
            )}
            <ResponsiveRow gutter={[16, 16]} align={"center"} justify="center">
              <ResponsiveCol>
                <Button onClick={resetVm} disabled={!hasMvsCode}>
                  <VscDebugRestart />
                  Reiniciar
                </Button>
              </ResponsiveCol>
              <ResponsiveCol>
                <Button onClick={handleExecuteNext} disabled={!hasMvsCode}>
                  Executar Instrução
                  <AiFillCaretRight />
                </Button>
              </ResponsiveCol>
            </ResponsiveRow>
          </ControlBar>
        </SecondarySection>
      </ResponsiveRow>
    </Container>
  );
};
