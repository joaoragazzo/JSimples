import { Table } from "antd";
import { FaArrowRight } from "react-icons/fa"; // ícone de seta
import styled from "styled-components";
import { useAppData } from "../../contexts/AppContext";

const ArrowCell = styled.div`
  text-align: center;
`;

export const MVSViewer = ({ currentLine = 1 }) => {
    const { parserResponse } = useAppData();
    const columns = [
    {
      title: "",
      dataIndex: "key",
      width: 40,
      render: (_, record, index) =>
        index === currentLine ? (
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
    <Table
      columns={columns}
      dataSource={parserResponse.mvs}
      pagination={false}
      size="small"
      rowKey="key"
      rowClassName={(_, index) =>
        index === currentLine ? "current-instruction-row" : ""
      }
    />
  );
};
