export default class AsyncImage {
  private img = new Image();
  constructor(
    private src: string,
    private onLoad?: (img: HTMLImageElement, e: Event) => any
  ) {
    if (onLoad) {
      this.img.addEventListener('load', function(this: HTMLImageElement, ev: Event) { onLoad(this, ev); })
    }
    this.img.src = this.src;
  }
  close() {
    if (this.onLoad) {
      const onLoad = this.onLoad;
      this.img.removeEventListener('load', function(this: HTMLImageElement, ev: Event) { onLoad(this, ev); });
    }
  }
}