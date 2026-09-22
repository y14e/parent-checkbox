export class ParentCheckbox {
  #rootElement!: HTMLInputElement;
  #childElements!: HTMLInputElement[];
  #controller: AbortController | null = null;
  #isDestroyed = false;

  constructor(root: HTMLInputElement) {
    if (!(root instanceof HTMLInputElement)) {
      throw new TypeError('Invalid root element');
    }

    if (root.hasAttribute('data-parent-checkbox-initialized')) {
      console.warn('Already initialized');
      return;
    }

    this.#rootElement = root;
    const ids = root.getAttribute('aria-controls')?.trim() ?? '';
    !ids && console.warn('Invalid aria-controls attribute');
    this.#childElements = ids
      .split(/\s+/)
      .map((i) => document.getElementById(i))
      .filter((e) => e instanceof HTMLInputElement);
    !this.#childElements.length && console.warn('Missing child elements');
    this.#initialize();
  }

  destroy(): void {
    if (this.#isDestroyed) {
      return;
    }

    this.#isDestroyed = true;
    this.#controller?.abort();
    this.#controller = null;
    this.#childElements.length = 0;
    this.#rootElement.removeAttribute('data-parent-checkbox-initialized');
  }

  #initialize(): void {
    this.#controller = new AbortController();
    const { signal } = this.#controller;
    this.#rootElement.addEventListener('change', this.#onRootChange, {
      signal,
    });

    for (const child of this.#childElements) {
      child.addEventListener('change', this.#onChildChange, { signal });
    }

    this.#update();
    this.#rootElement.setAttribute('data-parent-checkbox-initialized', '');
  }

  #update(): void {
    const isAllChecked = this.#childElements.every((c) => c.checked);
    this.#rootElement.checked = isAllChecked;
    this.#rootElement.indeterminate =
      !isAllChecked && this.#childElements.some((c) => c.checked);
  }

  #onRootChange = (): void => {
    this.#rootElement.indeterminate = false;
    const isChecked = this.#rootElement.checked;

    for (const child of this.#childElements) {
      child.checked = isChecked;
    }
  };

  #onChildChange = (): void => {
    this.#update();
  };
}
