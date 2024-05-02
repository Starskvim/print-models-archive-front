import _ from 'lodash';

export function paginate(items: any[], currentPage: number, maxItemsPerPage: number): any[] {
  const startIndex = (currentPage - 1) * maxItemsPerPage;
  return _(items)
    .slice(startIndex)
    .take(maxItemsPerPage)
    .value();
}

export const preparePages = (currentPage: number, pagesCount: number): (number | string)[] => {
  if (pagesCount < 12) {
    return _.range(1, pagesCount + 1);
  }
  if (currentPage < 7) {
    return [..._.range(1, 9), '...', pagesCount - 1, pagesCount];
  } else if (pagesCount - 6 < currentPage) {
    return [1, 2, '...', ..._.range(pagesCount - 7, pagesCount + 1)];
  } else {
    return [1, 2, '...', ..._.range(currentPage - 2, currentPage + 3), '...', pagesCount - 1, pagesCount];
  }
};