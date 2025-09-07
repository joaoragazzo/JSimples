import { Col, Row } from "antd";
import { Terminal } from "./tools/Terminal";
import { useAppData } from "@/contexts/AppContext";
import { ViewsTab } from "@/components/ViewsTab";
import { SyntaxTree } from "./tools/SyntaxTree";
import { CodeEditor } from "./tools/CodeEditor";
import styled from "styled-components";
import { MVSViewer } from "./tools/MVSViewer";
import { MachineStateViewer } from "./tools/MachineStateViewer";
import { SymbolTable } from "./SymbolTable";

const ExtendedRow = styled(Row)`
  flex: 1;
  min-height: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
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
  width: 100%;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
    height: auto;
    min-height: 700px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    min-height: 200px;
  }
`;

const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }
`;

export const Workspace = () => {
  const { tab } = useAppData();

  return (
    <div style={{gap: "12px", display: "flex", flexDirection: "column"}}>
    <ExtendedRow gutter={[12, 12]}>
      <ResponsiveCol xs={24} sm={24} md={12} lg={12} xl={12}>
        <StyledCard>
          {(tab === "terminal" ||
            tab === "syntaxTree" ||
            tab === "derivationTree") && <CodeEditor />}
          {tab === "mvs" && <MVSViewer/>}
        </StyledCard>
      </ResponsiveCol>
      
      <ResponsiveCol xs={24} sm={24} md={12} lg={12} xl={12}>
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
      </ResponsiveCol>
    </ExtendedRow>
    <ExtendedRow>
      <StyledCard>

        <SymbolTable />
      </StyledCard>
    </ExtendedRow>
    </div>
    
  );
};