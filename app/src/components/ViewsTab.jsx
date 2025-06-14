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
        key: 'mvs',
        label: 'MVS Passo a passo'
    }
]

export const ViewsTab = () => {
    const { setTab } = useAppData(); 
    return <Tabs items={items} onChange={setTab} defaultActiveKey="terminal"/>
}