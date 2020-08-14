const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('3e01951ca9fc467bb9a23432e391b2b6');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
newsapi.v2.everything({
  //query will eventually need to be the result.country we receive from Results Calculator on the client side.
  q: 'singapore',
  language: 'en',
  pageSize: '20',
  //country will eventually be the provided country ISO
}).then(response => {
  console.log(response);
  /*
    {
      status: "ok",
      articles: [...]
    }
  */
});
