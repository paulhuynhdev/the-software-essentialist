import { ElementHandle } from 'puppeteer';
import { PuppeteerPageDriver } from '../driver';

type ElementType = 'div' | 'button';

interface PageComponentsConfig {
  [key: string]: { selector: string; type: ElementType };
}

interface LoadedPageComponents {
  [key: string]: {
    selector: string;
    type: ElementType;
    element: ElementHandle<Element>;
  };
}

class PageComponents {
  private loadedPageComponents: LoadedPageComponents;

  constructor(
    private config: PageComponentsConfig,
    private driver: PuppeteerPageDriver,
  ) {
    this.loadedPageComponents = {};
  }

  async load() {
    const newLoadedPageComponents = {};
    const page = this.driver.getPage();
    let element;

    for (const key of Object.keys(this.config)) {
      const component = this.config[key];

      try {
        element = await page.waitForSelector(component.selector);
      } catch (err) {
        throw new Error(`Element ${key} not found!`);
      }

      if (!element) {
        throw new Error(`Element ${key} not found!`);
      }

      newLoadedPageComponents[key] = {
        ...component,
        element,
      };
    }

    this.loadedPageComponents = newLoadedPageComponents;
  }

  async get(componentName: string): Promise<ElementHandle<Element> | null> {
    let wasNeverLoaded = Object.keys(this.loadedPageComponents).length === 0;
    if (wasNeverLoaded) {
        throw new Error(`Component ${componentName} not loaded!`);
    }

    if (this.loadedPageComponents[componentName].element) {
    return null;
  }
}

export class FrontPage {
  private driver: PuppeteerPageDriver;
  private components: PageComponents;

  constructor(driver: PuppeteerPageDriver) {
    this.driver = driver;
    this.components = new PageComponents(
      {
        menu: { selector: `#menu`, type: `div` },
      },
      this.driver,
    );
  }

  async open() {
    const page = await this.driver.getPage();
    await page.goto('http://localhost:5173');
  }

  async clickJoin() {
    await this.components.load();
    const component = await this.components.get('menu');
    await component?.click();

    const page = this.driver.getPage();
    const element = await page.$('#menu');
    if (!element) throw new Error('Element not found');
    await element.click();
  }

  async getUsernameFromMenu() {
    await this.components.load();
    const component = await this.components.get('menu');
    await component?.evaluate((el) => el.textContent);
  }

  isOnPage() {
    return true;
  }
}
