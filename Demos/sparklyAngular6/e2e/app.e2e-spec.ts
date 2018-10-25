import { PackageTester2Page } from './app.po';

describe('package-tester2 App', () => {
  let page: PackageTester2Page;

  beforeEach(() => {
    page = new PackageTester2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
