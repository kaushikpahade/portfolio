// projects.js
// Add project objects to the `projects` array.
// Example entry:
/*
{
  id: 'mining-iot',
  title: 'Smart Mining Safety (IoT)',
  year: 2025,
  short: 'IoT gas & environment monitoring using ESP8266 + MQ sensors.',
  tags: ['IoT','ESP8266'],
  repo: 'https://github.com/Pahade12/mining-iot',
  live: null
}
*/

const projects = []; // empty 

(function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (projects.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = `<p class="muted">No public projects yet — add projects in <code>projects.js</code>. Use the template in this file.</p>
      <div style="margin-top:1rem;">
        <div class="card project-card">
          <h3>Sample Project Placeholder</h3>
          <p class="muted">Add your future project details here.</p>
          <a class="btn" href="#" onclick="alert('Project details coming soon!')">View Project</a>
        </div>
      </div>`;
    grid.appendChild(empty);
    return;
  }

  projects.forEach(p => {
    const card = document.createElement('article');
    card.className = 'project-card card';
    card.innerHTML = `
      <h3>${escapeHtml(p.title)} <small class="muted">— ${p.year || ''}</small></h3>
      <p>${escapeHtml(p.short || '')}</p>
      <div class="project-meta">${(p.tags || []).map(t => `<span class="pill">${escapeHtml(t)}</span>`).join(' ')}</div>
      <div style="margin-top:0.6rem;">
        ${p.repo ? `<a class="btn" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
        ${p.live ? `<a class="btn" href="${p.live}" target="_blank" rel="noopener">Live</a>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });
})();

function escapeHtml(s) { return (s + '' || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
