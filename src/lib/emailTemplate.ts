import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

// Use require to get the raw CJS export of mjml, bypassing Turbopack's ESM/CJS
// interop transform which causes the async wrapper to resolve to a JSON string
// instead of the expected { html, errors } object.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mjml2html = require("mjml") as (
  input: string,
) => Promise<{ html: string; errors: { formattedMessage: string }[] }>;

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
  const { html, errors } = await mjml2html(mjmlWithData);

  if (errors.length > 0) {
    throw new Error(
      `MJML errors in ${templateName}: ${errors.map((e) => e.formattedMessage).join(", ")}`,
    );
  }

  return html;
}
