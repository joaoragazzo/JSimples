import { Col, Row } from "antd";
import { Terminal } from "./tools/Terminal";
import { useAppData } from "@/contexts/AppContext";
import { ViewsTab } from "@/components/ViewsTab";
import { SyntaxTree } from "./tools/SyntaxTree";
import { CodeEditor } from "./tools/CodeEditor";
import styled from "styled-components";
import { MVSViewer } from "./tools/MVSViewer";
import { MachineStateViewer } from "./tools/MachineStateViewer";

const ExtendedRow = styled(Row)`
  flex: 1;
  min-height: 0;
`;

const StyledCard = styled.div`
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255);
  height: 100%;
  min-height: 0;
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

export const Workspace = () => {
  const { tab } = useAppData();
  return (
    <ExtendedRow gutter={12}>
      <Col span={12}>
        <StyledCard>
          {(tab === "terminal" ||
            tab === "syntaxTree" ||
            tab === "derivationTree") && <CodeEditor />}
          {tab === "mvs" && <MVSViewer />}
        </StyledCard>
      </Col>
      <Col span={12}>
        <StyledCard>
          <ViewsTab />
          <ContentWrapper>
            {(tab === "syntaxTree" || tab === "derivationTree") && (
              <SyntaxTree />
            )}
            {tab === "terminal" && <Terminal />}
            {tab === "mvs" && <MachineStateViewer />}
          </ContentWrapper>
        </StyledCard>
      </Col>
    </ExtendedRow>
  );
};
