import React from 'react';
import { Badge, Space, Table } from 'antd';
import { useAppData } from '../contexts/AppContext';

const toPtBrType = (type) => {
    if (type === null || type === undefined) {
        return "-"
    }

    if (type === "INTEGER") {
        return "Inteiro"
    }

    if (type === "LOGIC") {
        return "Lógico"
    }

    return type
}

const toPtBrCategory = (category) => {
    if (category === null || category === undefined) {
        return "-"
    }

    if (category === "VARIABLE") {
        return "Variável"
    }

    if (category === "PROCEDURE") {
        return "Procedimento"
    }

    return category
}

const toPtBrMechanism = (mechanism) => {
    if (mechanism == null || mechanism === undefined) {
        return "-"
    }

    if (mechanism === "REFERENCE") {
        return "Referência"
    }

    if (mechanism === "VALUE") {
        return "Valor"
    }
}

const expandColumns = [
  {
    title: 'Tipo',
    dataIndex: 'type',
    key: 'type',
    render: (type) => <>{toPtBrType(type)}</>
  },
  {
    title: 'Identificador',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Endereço',
    dataIndex: 'address',
    key: 'address',
    render: (address) => address !== null ? address : '-'
  },
  {
    title: 'Escopo',
    dataIndex: 'scope',
    key: 'scope',
    render: (scope) => (
      <Badge 
        color={scope === 'LOCAL' ? 'blue' : 'green'} 
        text={scope} 
      />
    )
  },
  {
    title: 'Categoria',
    dataIndex: 'category',
    key: 'category',
    render: (category) => <>{toPtBrCategory(category)}</>
  },
  {
    title: 'Mecanismo',
    dataIndex: 'mechanism',
    key: 'mechanism',
    render: (mechanism) => <>{toPtBrMechanism(mechanism)}</>
  }
];

const columns = [
  {
    title: 'Tipo',
    dataIndex: 'type',
    key: 'type',
    render: (type) => <>{toPtBrType(type)}</>
  },
  {
    title: 'Identificador',
    dataIndex: 'name',
    key: 'name',
    render: (name) => <div style={{fontFamily: "monospace"}}>{name}</div>
  },
  {
    title: 'Endereço',
    dataIndex: 'address',
    key: 'address',
    render: (address) => address !== null ? address : '-'
  },
  {
    title: 'Escopo',
    dataIndex: 'scope',
    key: 'scope',
    render: (scope) => (
      <Badge 
        color={scope === 'GLOBAL' ? 'green' : 'blue'} 
        text={scope} 
      />
    )
  },
  {
    title: 'Rótulo',
    dataIndex: 'label',
    key: 'label',
    render: (label) => label !== null ? label : '-'
  },
  {
    title: 'Categoria',
    dataIndex: 'category',
    key: 'category',
    render: (category) => (
      <Badge 
        status={category === 'PROCEDURE' ? 'processing' : 'default'} 
        text={category === "VARIABLE" ?  "Variável" : "Procedimento"} 
      />
    )
  },
  {
    title: 'Parâmetros',
    dataIndex: 'parameter',
    key: 'parameter',
    render: (parameters) => {
      if (!parameters || parameters.length === 0) return '-';
      return (
        <Space direction="vertical" size="small">
          {parameters.map((param, index) => (
            <div key={index} style={{ fontSize: '12px' }}>
              {toPtBrType(param.type)} ({toPtBrMechanism(param.mechanism)})
            </div>
          ))}
        </Space>
      );
    }
  }
];

const expandedRowRender = (record) => {

  
    if (!record.subSymbolTree || record.subSymbolTree.length === 0) {
    return <div style={{ padding: '16px', fontStyle: 'italic', color: '#999' }}>Sem símbolos locais</div>;
  }

  return (
    <div style={{ backgroundColor: '#fafafa' , paddingRight: "10px", paddingLeft: "30px"}}>
      <h4 style={{ margin: '5px', color: '#1890ff' }}>
        Tabela local para o procedimento "{record.name}"
      </h4>
      <Table
        columns={expandColumns}
        dataSource={record.subSymbolTree.map((item, index) => ({ ...item, key: `sub-${index}` }))}
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );
};

export const SymbolTable = () => {
  const { parserResponse } = useAppData();
  const dataWithKeys = parserResponse.symbolTable.map((item, index) => ({ ...item, key: index.toString() }));

  return (
    <>
    <h2 style={{margin: 0, marginBottom: "12px"}}>Tabela de Símbolos</h2>
    <Table
        columns={columns}
        dataSource={dataWithKeys}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ['4'],
          rowExpandable: (record) => record.category === 'PROCEDURE' && record.subSymbolTree !== null
        }}
        pagination={false}
        bordered
        size="middle"
      />
    </>
      
  );
};