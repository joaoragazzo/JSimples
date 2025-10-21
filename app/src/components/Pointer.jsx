import styled from "styled-components";
import { COLORS } from "@/constants/theme";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
`;

const LabelSide = styled.div`
  border-radius: 20px 0px 0px 20px;
  background-color: ${COLORS.pointer.background};
  width: 25px;
  align-items: center;
  justify-content: center;
  display: flex;
  color: white;
  font-weight: 600;
`;

const ValueSide = styled.div`
  border-radius: 0px 20px 20px 0px;
  border: 2px solid ${COLORS.pointer.border};
  width: 25px;
  display: flex;
  justify-content: center;
`;

/**
 * Componente de ponteiro para exibir registradores da MVS
 */
export const Pointer = ({ label, value }) => {
  return (
    <Wrapper>
      <LabelSide>{label}</LabelSide>
      <ValueSide>{value}</ValueSide>
    </Wrapper>
  );
};
