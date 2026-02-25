const mammoth = require("mammoth");
mammoth.extractRawText({ path: "guia-propuesta-inv-ing.docx" })
  .then(r => console.log(r.value))
  .catch(e => console.error(e));
