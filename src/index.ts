export class ParentCheckbox {
  #element!: HTMLInputElement;
  #childElements!: HTMLInputElement[];
  #controller: AbortController | null = null;
  #isDestroyed = false;

  constructor(element: HTMLInputElement) {
    if (!(element instanceof HTMLInputElement)) {
      throw new TypeError('Invalid element');
    }

    if (element.hasAttribute('data-parent-checkbox-initialized')) {
      console.warn('Already initialized');
      return;
    }

    this.#element = element;
    const ids = element.getAttribute('aria-controls')?.trim() ?? '';
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
    this.#element.removeAttribute('data-parent-checkbox-initialized');
  }

  #initialize(): void {
    this.#controller = new AbortController();
    const { signal } = this.#controller;
    this.#element.addEventListener('change', this.#onRootChange, { signal });

    for (const child of this.#childElements) {
      child.addEventListener('change', this.#onChildChange, { signal });
    }

    this.#update();
    this.#element.setAttribute('data-parent-checkbox-initialized', '');
  }

  #update(): void {
    const isAllChecked = this.#childElements.every((c) => c.checked);
    this.#element.checked = isAllChecked;
    this.#element.indeterminate = !isAllChecked && this.#childElements.some((c) => c.checked);
  }

  #onRootChange = (): void => {
    this.#element.indeterminate = false;
    const isChecked = this.#element.checked;

    for (const child of this.#childElements) {
      child.checked = isChecked;
    }
  };

  #onChildChange = (): void => {
    this.#update();
  };
}
