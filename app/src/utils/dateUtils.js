/**
 * Funções utilitárias para formatação de data/hora
 */

/**
 * Formata timestamp para hora local no formato HH:MM:SS
 * @param {number} timestamp - Timestamp em milissegundos
 * @returns {string} - Hora formatada
 */
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
