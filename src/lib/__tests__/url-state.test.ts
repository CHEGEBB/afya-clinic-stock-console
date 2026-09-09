import { parseStockUrlState } from '../url-state';

describe('parseStockUrlState', () => {
  it('returns sensible defaults when the URL has no query params', () => {
    const result = parseStockUrlState('');
    expect(result).toEqual({
      search: '',
      category: '',
      sortBy: 'title',
      order: 'asc',
      page: 1,
    });
  });

  it('parses search, category, sort, and page from the query string', () => {
    const result = parseStockUrlState(
      '?q=paracetamol&category=skin-care&sortBy=stock&order=desc&page=3'
    );
    expect(result).toEqual({
      search: 'paracetamol',
      category: 'skin-care',
      sortBy: 'stock',
      order: 'desc',
      page: 3,
    });
  });

  it('falls back to page 1 when the page param is invalid or missing', () => {
    const result = parseStockUrlState('?page=notanumber');
    expect(result.page).toBe(1);
  });
});
