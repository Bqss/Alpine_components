const Tabs = ({ selected = 0, ...other }) => ({
  activeIndex: -1,
  tabs: null,
  navigator,
  ...other,
  get width() {
    return this.tabs[this.activeIndex].getBoundingClientRect().width;
  },
  get xCoordinate() {
    const widths = this.tabs.map((v, i) =>
      i < this.activeIndex ? v.getBoundingClientRect().width : 0
    );
    const result = widths.reduce((p, v) => p + v, 0);
    return result;
  },
  init() {
    this.$watch("activeIndex", () => {
      this.navigator.style.width = `${this.width}px`;
      this.navigator.style.left = `${this.xCoordinate}px`;
    });
    this.$nextTick(() => {
      this.tabs = Array.from(this.$el.querySelectorAll("button"));
      this.navigator = this.$refs.tabs_navigation.querySelector("span");
      this.activeIndex = selected;
    });
  },
  ["tabs_navigation"]: {
    ["x-ref"]: "tabs_navigation",
  },
  ["tab"]: {
    ["x-show"]: "activeIndex == i",
    [":aria-active"]: "activeIndex == i",
   
  },
  ["nav"]: {
    [":data-index"]: "i",
    ["@click"]({ target }) {
      this.activeIndex = target.dataset.index;
    },
    [":class"]: "activeIndex == i ? 'text-black': 'text-gray-600'",
    [":aria-selected"]: "activeIndex == i",
  },
});

export default Tabs;