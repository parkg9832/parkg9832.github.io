(() => {
  'use strict';
  const categories = ['all', 'news', 'press'];
  const categoryOf = story => story.category === 'press' ? 'press' : 'news';
  const normalize = text => String(text || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
  const published = (data, story) => story.publishedDate || data.publishedDate;
  const displayDate = (data, story) => story.dateUnconfirmed ? '' : (story.eventDate || published(data, story));
  const ordered = data => data.stories.filter(story => story.archiveVisible !== false).sort((a, b) => displayDate(data, b).localeCompare(displayDate(data, a)));
  function archive(data, { language = 'ES', category = 'all', query = '', page = 1 } = {}) {
    if (['events', 'collaborations'].includes(category)) category = 'news';
    category = categories.includes(category) ? category : 'all';
    query = String(query).trim().slice(0, 150);
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const matches = ordered(data).filter(story => {
      if (category !== 'all' && categoryOf(story) !== category) return false;
      const copy = story[language] || story.ES;
      const text = normalize([copy.title, copy.summary, story.location, ...copy.sections.flat()].join(' '));
      return terms.every(term => text.includes(term));
    });
    const pageSize = 9;
    const pages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(pages, Math.max(1, Number.parseInt(page, 10) || 1));
    return { category, query, page, pages, pageSize, total: matches.length, matches, visible: matches.slice((page - 1) * pageSize, page * pageSize) };
  }
  const featured = data => ordered(data).filter(story => story.homeFeatured).sort((a, b) => (a.homeOrder || 99) - (b.homeOrder || 99)).slice(0, 3);
  window.MOKDA_NEWS_MODEL = { archive, ordered, featured, published, displayDate, categoryOf };
})();
