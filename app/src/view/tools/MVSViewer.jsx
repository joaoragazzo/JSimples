import { Table } from "antd";
import { FaArrowRight } from "react-icons/fa";
import styled from "styled-components";
import { useAppData } from "../../contexts/AppContext";

const ArrowCell = styled.div`
  text-align: center;
`;

const StyledTable = styled(Table)`
  overflow-y: auto;
`

export const MVSViewer = () => {
    let currentLine = 0;
    const { parserResponse, mvsState } = useAppData();
    const columns = [
    {
      title: "",
      dataIndex: "key",
      width: 30,
      render: (_, record, index) =>
        index === mvsState.instructionPointer ? (
          <ArrowCell>
            <FaArrowRight />
          </ArrowCell>
        ) : null,
    },
    {
      title: "Rótulo",
      dataIndex: "label",
      width: 100,
    },
    {
      title: "Instrução",
      dataIndex: "instruction",
      width: 120,
    },
    {
      title: "Parâmetro",
      dataIndex: "parameter",
    },
  ];

  return (
    <StyledTable
      columns={columns}
      dataSource={parserResponse.mvs}
      pagination={false}
      size="small"
      rowKey="key"
      virtual
      scroll={{y:600}}
      rowClassName={(_, index) =>
        index === currentLine ? "current-instruction-row" : ""
      }
    />
  );
};
