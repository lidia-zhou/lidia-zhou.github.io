const content = window.SITE_CONTENT;

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const renderLinkedText = (item) => {
  const text = escapeHtml(item.text);
  if (!item.href || !item.linkText) return text;
  return text.replace(
    escapeHtml(item.linkText),
    `<a href="${escapeHtml(item.href)}">${escapeHtml(item.linkText)}</a>`
  );
};

const renderContent = () => {
  if (!content) return;

  const brandText = document.querySelector('.brand span:last-child');
  if (brandText) brandText.textContent = content.profile.brand;

  const kicker = document.querySelector('#about .section-kicker');
  if (kicker) kicker.textContent = content.home.kicker;

  const title = document.querySelector('#about h2');
  if (title) title.textContent = content.home.title;

  const existingLeads = document.querySelectorAll('#about .lead');
  existingLeads.forEach((lead) => lead.remove());
  if (title) {
    content.home.paragraphs
      .slice()
      .reverse()
      .forEach((paragraph, index) => {
        const lead = document.createElement('p');
        lead.className = index === content.home.paragraphs.length - 1 ? 'lead' : 'lead compact';
        lead.textContent = paragraph;
        title.insertAdjacentElement('afterend', lead);
      });
  }

  const role = document.querySelector('.profile-panel .role');
  if (role) role.textContent = content.profile.role.replaceAll(' / ', '\n');

  const facts = document.querySelector('.quick-facts');
  if (facts) {
    facts.innerHTML = `
      <p><span>Affiliation</span> ${escapeHtml(content.profile.affiliation)}</p>
      <p><span>Email</span> ${escapeHtml(content.profile.emailDisplay || content.profile.email)}</p>
      <p><span>ORCID</span> ${escapeHtml(content.profile.orcid)}</p>
    `;
  }

  const linksGrid = document.querySelector('.link-grid');
  if (linksGrid) {
    linksGrid.innerHTML = `
      <a href="mailto:${escapeHtml(content.profile.email)}">Email</a>
      <a href="https://orcid.org/${escapeHtml(content.profile.orcid)}">ORCID</a>
      <a href="https://bsky.app/profile/lidiazhou.bsky.social">Bluesky</a>
      <a href="https://x.com/LidiaZhou93">X</a>
    `;
  }

  const keywordStrip = document.querySelector('.keyword-strip');
  if (keywordStrip) {
    keywordStrip.innerHTML = content.home.interests.map((interest) => `<span>${escapeHtml(interest)}</span>`).join('');
  }

  const interestList = document.querySelector('.brief-list');
  if (interestList) {
    interestList.innerHTML = content.home.interests.map((interest) => `<li>${escapeHtml(interest)}</li>`).join('');
  }

  const homeNews = document.querySelector('.brief-news');
  if (homeNews) {
    homeNews.innerHTML = content.home.news
      .map((item) => `<li><span>${escapeHtml(item.date)}</span><p>${renderLinkedText(item)}</p></li>`)
      .join('');
  }

  const topicGrid = document.querySelector('.topic-grid');
  if (topicGrid) {
    topicGrid.innerHTML = content.researchAreas
      .map(
        (item) => `
          <article class="topic-card">
            <span class="topic-index">${escapeHtml(item.number)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </article>
        `
      )
      .join('');
  }

  const projectGrid = document.querySelector('.project-grid');
  if (projectGrid) {
    projectGrid.innerHTML = content.projects
      .map(
        (project) => `
          <article class="project-card${project.featured ? ' featured-project' : ''}">
            <div class="project-meta">
              <span>${escapeHtml(project.role)}</span>
              <span>${escapeHtml(project.period)}</span>
              ${project.amount ? `<span>${escapeHtml(project.amount)}</span>` : ''}
            </div>
            <div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.text)}</p>
            </div>
            <div class="project-tags">
              ${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
            </div>
          </article>
        `
      )
      .join('');
  }

  const newsList = document.querySelector('.news-list');
  if (newsList) {
    newsList.innerHTML = content.news
      .map((item) => `<li><time>${escapeHtml(item.date)}</time><p>${renderLinkedText(item)}</p></li>`)
      .join('');
  }

  const groupLabels = {
    preprint: 'Preprints',
    journal: 'Journal Articles',
    chapter: 'Book Chapters',
    proceeding: 'Conference Proceedings',
    conference: 'Conference Papers',
    review: 'Book Reviews'
  };
  const publicationList = document.querySelector('.publication-list');
  if (publicationList) {
    publicationList.innerHTML = Object.entries(groupLabels)
      .map(([type, label]) => {
        const items = content.publications.filter((publication) => publication.type === type);
        if (!items.length) return '';
        return `
          <h3 class="pub-group-heading">${escapeHtml(label)}</h3>
          ${items
            .map(
              (publication) => `
                <article class="publication-card" data-type="${escapeHtml(publication.type)}">
                  <div class="tag ${escapeHtml(publication.type)}">${escapeHtml(publication.typeLabel)}</div>
                  <div>
                    <h3>${escapeHtml(publication.title)}</h3>
                    <p>${escapeHtml(publication.citation)}</p>
                    ${
                      publication.links
                        ? `<div class="pub-links">${publication.links
                            .map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`)
                            .join('')}</div>`
                        : ''
                    }
                  </div>
                </article>
              `
            )
            .join('')}
        `;
      })
      .join('');
  }

  const teachingList = document.querySelector('.teaching-list');
  if (teachingList) {
    teachingList.innerHTML = content.teaching
      .map((item) => `<article><span>${escapeHtml(item.title)}</span><p>${escapeHtml(item.text)}</p></article>`)
      .join('');
  }

  const grantGrid = document.querySelector('.grant-grid');
  if (grantGrid) {
    grantGrid.innerHTML = (content.grants || [])
      .map(
        (grant) => `
          <article class="topic-card">
            <span class="topic-index">${escapeHtml(grant.year)}</span>
            <h3>${escapeHtml(grant.title)}</h3>
            <p>${escapeHtml(grant.text)}</p>
          </article>
        `
      )
      .join('');
  }

  const contactHeading = document.querySelector('#contact h2');
  if (contactHeading) contactHeading.textContent = content.contact.heading;
  const contactButton = document.querySelector('#contact .button');
  if (contactButton) {
    contactButton.textContent = content.contact.emailDisplay || content.contact.email;
    contactButton.href = `mailto:${content.contact.email}`;
  }
};

renderContent();

let filterButtons = document.querySelectorAll('.filter-button');
let publications = document.querySelectorAll('.publication-card[data-type]');
let publicationGroups = document.querySelectorAll('.pub-group-heading');

const links = document.querySelectorAll('.site-nav a, .side-nav a');
const sections = [...links].map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = `#${entry.target.id}`;
      const activeLinks = document.querySelectorAll(`.site-nav a[href="${id}"], .side-nav a[href="${id}"]`);
      if (entry.isIntersecting) {
        links.forEach((link) => link.removeAttribute('aria-current'));
        activeLinks.forEach((link) => link.setAttribute('aria-current', 'page'));
      }
    });
  },
  { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
);

sections.forEach((section) => observer.observe(section));


const updatePublicationGroups = () => {
  publicationGroups.forEach((heading) => {
    let next = heading.nextElementSibling;
    let hasVisibleItem = false;

    while (next && !next.classList.contains('pub-group-heading')) {
      if (next.matches?.('.publication-card') && !next.classList.contains('is-hidden')) {
        hasVisibleItem = true;
        break;
      }
      next = next.nextElementSibling;
    }

    heading.classList.toggle('is-hidden', !hasVisibleItem);
  });
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    publications.forEach((publication) => {
      const shouldShow = filter === 'all' || publication.dataset.type === filter;
      publication.classList.toggle('is-hidden', !shouldShow);
    });

    updatePublicationGroups();
  });
});

updatePublicationGroups();

const newsSection = document.querySelector('.news-section');
const newsToggle = document.querySelector('.news-toggle');

newsToggle?.addEventListener('click', () => {
  const isExpanded = newsSection.classList.toggle('is-expanded');
  newsToggle.setAttribute('aria-expanded', String(isExpanded));
  newsToggle.textContent = isExpanded ? 'Show fewer news' : 'Show more news';
});

const viewLinks = document.querySelectorAll('.site-nav a, .brand, .hero-actions a[href^="#"]');
const views = document.querySelectorAll('.hero-section, .section-block');

const showView = (targetId = '#about') => {
  const target = document.querySelector(targetId) || document.querySelector('#about');
  if (!target) return;

  views.forEach((view) => view.classList.toggle('is-active-view', view === target));
  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.toggleAttribute('aria-current', link.getAttribute('href') === `#${target.id}`);
  });

  window.scrollTo({ top: 0, behavior: 'auto' });
};

viewLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    event.preventDefault();
    history.pushState(null, '', href === '#top' ? '#about' : href);
    showView(href === '#top' ? '#about' : href);
  });
});

window.addEventListener('popstate', () => showView(window.location.hash || '#about'));
showView(window.location.hash || '#about');
