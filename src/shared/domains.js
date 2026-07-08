const VALID_DOMAINS = [
  'Recursos Humanos',
  'Financiero y Contable',
  'Operacional',
  'Estratégico',
  'Legal y Compliance',
  'Marketing y Comercial',
  'Datos y Sistemas',
  'Investigación y Desarrollo',
  'Calidad',
  'Comunicación Interna',
  'General',
];

function normalizeDomain(domain) {
  if (!domain || !VALID_DOMAINS.includes(domain)) {
    return 'General';
  }
  return domain;
}

module.exports = { VALID_DOMAINS, normalizeDomain };