const fs = require('fs');
const path = require('path');

const getHtmlTemplate = (templateName, replacements) => {
  let templatePath = path.join(__dirname, '../emailTemplates', templateName);
  let template = fs.readFileSync(templatePath, 'utf8');

  for (let key in replacements) {
    template = template.replace(
      new RegExp(`{{${key}}}`, 'g'),
      replacements[key]
    );
  }
  return template;
};

module.exports = getHtmlTemplate;
