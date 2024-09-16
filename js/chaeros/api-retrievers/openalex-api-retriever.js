// ========= OPEN ALEX ARTICLES-BY-AUTHOR ==========

const getOpenAlexAuthor = (firstName, lastName, mail) =>
  fetch(
    `https://api.openalex.org/authors?search=${firstName}%20${lastName}&mailto=${mail}`
  ).then((r) => r.json());
