import styled from 'styled-components';
import logo_unifal from '../assets/logo-unifal.png';
import article from "../assets/JSimples___Uma_ferramenta_web_didática_para_o_ensino_de_conceitos_de_teoria_de_linguagens_e_compiladores.pdf";

const FooterContainer = styled.footer`
    background: white;
    padding: 12px 0 12px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 -1px 4px rgba(0,0,0,0.03);
    font-size: 13px;
    border-top: 1px solid #e0e0e0;
`;

const LogoPlaceholder = styled.div`
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
`;

const NamesRow = styled.div`
    display: flex;
    gap: 8px;
    font-size: 13px;
    color: #555;
    margin-bottom: 4px;
    flex-wrap: wrap;
    justify-content: center;
`;

const ArticleLink = styled.a`
    color: #1976d2;
    text-decoration: none;
    font-size: 12px;
    margin-top: 2px;
    opacity: 0.85;

    &:hover {
        color: #0d47a1;
        text-decoration: underline;
        opacity: 1;
    }
`;

const Footer = () => (
    <FooterContainer>
        <LogoPlaceholder>
            <img src={logo_unifal} alt="Unifal Logo" style={{ maxHeight: '60px' }} />
        </LogoPlaceholder>
        <NamesRow>
            <span><a href="https://joaoragazzo.dev/">João Paulo M. Ragazzo</a></span>
            •
            <span>Prof. Dr. Luiz Eduardo da Silva</span>
        </NamesRow>
        <ArticleLink
            href={article}
            target="_blank"
            rel="noopener noreferrer"
        >
            Leia o artigo sobre o JSimples
        </ArticleLink>
    </FooterContainer>
);

export default Footer;