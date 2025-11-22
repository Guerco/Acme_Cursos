export const ids = {
    canva: 'grafico-cursos'
};

export const idsCss = Object.fromEntries(
  Object.entries(ids).map(([c, id]) => [c, `#${id}`])
);