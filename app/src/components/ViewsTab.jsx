import { Tabs } from "antd"
import { useAppData } from "@/contexts/AppContext"


const items = [
    {
        key: 'terminal',
        label: 'Terminal',
    },
    {
        key: 'syntaxTree',
        label: 'Árvore Sintática',
    },
    {
        key: 'derivationTree',
        label: 'Árvore de Derivação',
    },
    {
        key: 'symbolTable',
        label: 'Tabela de Símbolos',
    }
]

export const ViewsTab = () => {
    const { setTab } = useAppData(); 
    return <Tabs items={items} onChange={setTab} defaultActiveKey="terminal"/>
}