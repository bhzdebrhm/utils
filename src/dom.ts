import { isElement } from "lodash";

export function canUseDom(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  )
}

export function getOwnerDocument(node?: Element | null): Document {
  return isElement(node) ? node?.ownerDocument ?? document : document
}

export function isHTMLElement(el: any): el is HTMLElement {
  if (!isElement(el)) {
    return false
  }

  const win = el.ownerDocument.defaultView ?? window
  return el instanceof win.HTMLElement
}


export const isBrowser = canUseDom();
