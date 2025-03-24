import Template0 from "./0.js";
import Template1 from "./1.js";
import Template2 from "./2.js";

const templates = {
  0: Template0,
  1: Template1,
  2: Template2,
};

export function getTemplateById(id) {
  return templates[id] || Template0;
}
