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
  variables: Record<string, string | number>,
): Promise<string> {
  let cached = templateCache.get(templateName);

  if (!cached) {
    const filePath = path.join(
      process.cwd(),
      "src/templates",
      `${templateName}.mjml`,
    );
    const mjmlContent = fs.readFileSync(filePath, "utf-8");
    cached = { compiled: Handlebars.compile(mjmlContent) };
    templateCache.set(templateName, cached);
  }

  const mjmlWithData = cached.compiled(variables);
  const { html, errors } = mjml2html(mjmlWithData);

  if (errors.length > 0) {
    throw new Error(
      `MJML errors in ${templateName}: ${errors.map((e) => e.formattedMessage).join(", ")}`,
    );
  }

  return html;
}
