/**
 * Funções utilitárias para manipulação de árvores sintáticas
 */

/**
 * Remove nós marcados como "IGNORE" da árvore
 * @param {Object} node - Nó da árvore a ser processado
 * @returns {Object|null} - Nó processado ou null se deve ser removido
 */
export const removeIgnoreNodes = (node) => {
  if (!node) {
    return null;
  }

  if (node.name === 'IGNORE') {
    return null;
  }

  if (!node.children || node.children.length === 0) {
    return node;
  }

  node.children = node.children
    .map((child) => removeIgnoreNodes(child))
    .filter((child) => child !== null);

  if (node.children.length === 0) {
    delete node.children;
  }

  return node;
};

/**
 * Comprime nós que possuem apenas um filho
 * @param {Object} node - Nó da árvore a ser processado
 * @returns {Object|null} - Nó processado ou null
 */
export const compressSingleChildNodes = (node) => {
  if (!node) {
    return null;
  }

  if (!node.children || node.children.length === 0) {
    return node;
  }

  node.children = node.children
    .map((child) => compressSingleChildNodes(child))
    .filter((child) => child !== null);

  if (node.children.length === 0) {
    delete node.children;
    return node;
  }

  if (node.children.length === 1) {
    return node.children[0];
  }

  return node;
};

/**
 * Converte a estrutura de árvore para o formato do Ant Design Tree
 * @param {Object} data - Dados da árvore
 * @returns {Array} - Array de nós no formato Ant Design
 */
export const convertToAntdTree = (data) => {
  const convertNode = (node, key) => {
    const isLeaf = !node.children || node.children.length === 0;
    const treeNode = {
      title: isLeaf ? <code>{node.name}</code> : node.name,
      key: key,
    };

    if (node.children && node.children.length > 0) {
      treeNode.children = node.children.map((child, index) =>
        convertNode(child, `${key}-${index}`)
      );
    }

    return treeNode;
  };

  return [convertNode(data, '0')];
};
