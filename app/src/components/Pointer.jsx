import styled from "styled-components"

const Wrapper = styled.div`
    display:flex;
    flex-direction: row;
    width: fit-content;
    height: fit-content
`

const RightSide = styled.div`
    border-radius: 20px 0px 0px 20px;
    background-color: rgb(53, 56, 231);
    width: 25px;
    align-items: center;
    justify-content: center;
    display:flex;
    color:white;
    font-weight: 600;
`


const LeftSide = styled.div`
    border-radius: 0px 20px 20px 0px;
    border: 2px solid rgb(53, 56, 231);
    width: 25px;
    display: flex;
    justify-content: center;
`


export const Pointer = ({ label, value }) => {
    return (
        <Wrapper>
            <RightSide>
                {label}
            </RightSide>
            <LeftSide>
                {value}
            </LeftSide>
        </Wrapper>
    )
}