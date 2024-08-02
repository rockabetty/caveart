import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export const sanitizeLongformText = function (unsanitizedInput: string) {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  return purify.sanitize(unsanitizedInput, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href']
  });
};