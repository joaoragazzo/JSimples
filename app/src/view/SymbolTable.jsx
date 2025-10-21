import { useState, useEffect } from 'react';
import { Badge, Space, Table, Drawer, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
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

    if (category === "FUNCTION") {
       return "Função"
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

const desktopColumns = [
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
        text={toPtBrCategory(category)} 
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

const mobileColumns = [
  {
    title: 'Info',
    key: 'info',
    render: (_, record) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontFamily: "monospace", fontWeight: 'bold', fontSize: '14px' }}>
          {record.name}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge 
            color={record.scope === 'GLOBAL' ? 'green' : 'blue'} 
            text={record.scope} 
          />
          <Badge 
            text={toPtBrCategory(record.category)} 
          />
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {toPtBrType(record.type)} | End: {record.address !== null ? record.address : '-'}
        </div>
      </div>
    )
  },
  {
    title: 'Ações',
    key: 'actions',
    width: 80,
    render: (_, record) => (
      <DetailButton record={record} />
    )
  }
];

const DetailButton = ({ record }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <div style={{display: "flex", justifyContent: 'center'}}>
      <Button 
        type="text" 
        icon={<EyeOutlined width={1}/>} 
        onClick={() => setDrawerVisible(true)}
        size="small"
      />
      <Drawer
        title={`Detalhes: ${record.name}`}
        placement="bottom"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        height="60vh"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div><strong>Tipo:</strong> {toPtBrType(record.type)}</div>
          <div><strong>Identificador:</strong> <code>{record.name}</code></div>
          <div><strong>Endereço:</strong> {record.address !== null ? record.address : '-'}</div>
          <div><strong>Escopo:</strong> 
            <Badge 
              color={record.scope === 'GLOBAL' ? 'green' : 'blue'} 
              text={record.scope} 
              style={{ marginLeft: '8px' }}
            />
          </div>
          <div><strong>Rótulo:</strong> {record.label !== null ? record.label : '-'}</div>
          <div><strong>Categoria:</strong>
            <Badge 
              text={toPtBrCategory(record.category)} 
              style={{ marginLeft: '8px' }}
            />
          </div>
          {record.parameter && record.parameter.length > 0 && (
            <div>
              <strong>Parâmetros:</strong>
              <div style={{ marginTop: '8px' }}>
                {record.parameter.map((param, index) => (
                  <div key={index} style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px',
                    marginBottom: '4px',
                    fontSize: '12px' 
                  }}>
                    {toPtBrType(param.type)} ({toPtBrMechanism(param.mechanism)})
                  </div>
                ))}
              </div>
            </div>
          )}
          {record.category === 'PROCEDURE' && record.subSymbolTree && record.subSymbolTree.length > 0 && (
            <div>
              <strong>Símbolos Locais:</strong>
              <div style={{ marginTop: '8px' }}>
                {record.subSymbolTree.map((symbol, index) => (
                  <div key={index} style={{
                    padding: '8px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    fontSize: '12px'
                  }}>
                    <div><strong>{symbol.name}</strong> ({toPtBrType(symbol.type)})</div>
                    <div>End: {symbol.address !== null ? symbol.address : '-'} | 
                    Escopo: {symbol.scope} | 
                    Cat: {toPtBrCategory(symbol.category)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

const expandedRowRender = (record) => {
  if (!record.subSymbolTree || record.subSymbolTree.length === 0) {
    return <div style={{ padding: '16px', fontStyle: 'italic', color: '#999' }}>Sem símbolos locais</div>;
  }

  return (
    <div style={{ backgroundColor: '#fafafa', paddingRight: "10px", paddingLeft: "30px"}}>
      <h4 style={{ margin: '5px', color: '#1890ff' }}>
        Tabela local para o procedimento "{record.name}"
      </h4>
      <Table
        columns={expandColumns}
        dataSource={record.subSymbolTree.map((item, index) => ({ ...item, key: `sub-${index}` }))}
        pagination={false}
        size="small"
        bordered
        scroll={{ x: 600 }}
      />
    </div>
  );
};

export const SymbolTable = () => {
  const { parserResponse } = useAppData();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const dataWithKeys = parserResponse.symbolTable.map((item, index) => ({ ...item, key: index.toString() }));

  return (
    <>
      <h2 style={{margin: 0, marginBottom: "12px"}}>Tabela de Símbolos</h2>
      <Table
        columns={isMobile ? mobileColumns : desktopColumns}
        dataSource={dataWithKeys}
        expandable={!isMobile ? {
          expandedRowRender,
          defaultExpandedRowKeys: ['4'],
          rowExpandable: (record) => (record.category === 'PROCEDURE' || record.category === "FUNCTION") && record.subSymbolTree !== null
        } : false}
        pagination={false}
        bordered
        size={isMobile ? "small" : "middle"}
        scroll={{ x: isMobile ? undefined : 'max-content' }}
      />
    </>
  );
};