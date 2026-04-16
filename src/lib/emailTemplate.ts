import fs from "fs";
import path from "path";
import mjml2html from "mjml";
import Handlebars from "handlebars";

type TemplateCache = {
  compiled: Handlebars.TemplateDelegate;
};

const templateCache = new Map<string, TemplateCache>();

export async function renderEmailTemplate(
  templateName: string,
  variables: Record<string, any>
) {
  let cached = templateCache.get(templateName);
  console.log(cached)

  if (!cached) {
    const filePath = path.join(
      process.cwd(),
      "src/templates",
      `${templateName}.mjml`
    );
    console.log(filePath)

    const mjmlContent = fs.readFileSync(filePath, "utf-8");
    console.log(mjmlContent);

    const compiled = Handlebars.compile(mjmlContent);
    console.log(compiled);

    cached = { compiled };
    templateCache.set(templateName, cached);
  }

  // 1. Inject variables into MJML
  const mjmlWithData = cached.compiled(variables);
  console.log(mjmlWithData);

  // 2. Convert MJML → HTML
  const html = mjml2html(mjmlWithData);
  console.log(html);

  return html;
}