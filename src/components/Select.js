const Select = ({ hoverStyle = "", placeholder = "select", ...other }) => ({
  open: false,
  activeDescendant: -1,
  activeIndex: -1,
  selected: placeholder,
  items: [],
  ...other,
  focusButton() {
    this.$refs.select_control.focus();
  },
  init() {
    this.$nextTick(() => {
      this.total =
        this.$refs.select_menu.querySelectorAll('[role="option"]').length;
    });
  },
  toggle() {
    this.open = !this.open;
    this.open &&
      this.$nextTick(() => {
        this.$refs.select_menu.focus();
      });
    this.$watch("activeIndex", (v) => {
      this.selected = this.data[v].name;
    });
  },
  hide() {
    this.open = false;
    this.$refs.select_control.focus();
    this.activeDescendant = -1;
  },
  isActive(index) {
    return this.activeDescendant == index ? hoverStyle : "";
  },
  ["select_control"]: {
    ["@click"]() {
      this.toggle();
    },
    [":aria-expanded"]: "open",
    ["x-ref"]: "select_control",
  },
  ["select_menu"]: {
    ["x-show"]: "open",
    ["x-ref"]: "select_menu",
    [":aria-activedescendant"] : "activeDescendant",
    [":aria-selected"] : "activeIndex" ,
    ["@keydown.escape"]() {
      this.hide();
    },
    ["@keydown.arrow-up.prevent"]() {
      this.activeDescendant =
        this.activeDescendant - 1 < 0
          ? this.total - 1
          : this.activeDescendant - 1;
      this.$el.children[this.activeDescendant + 1].scrollIntoView({
        block: "nearest",
      });
    },
    ["@keydown.arrow-down.prevent"]() {
      this.activeDescendant =
        this.activeDescendant + 1 > this.total - 1
          ? 0
          : this.activeDescendant + 1;

      this.$el.children[this.activeDescendant + 1].scrollIntoView({
        block: "nearest",
      });
    },
    ["@keydown.enter.prevent"]() {
      if (this.activeDescendant === -1) return;
      this.activeIndex = this.activeDescendant;
      this.hide();
    },
    ["@mouseleave"]() {
      this.activeDescendant = -1;
    },
    ["@click.outside"]() {
      this.hide();
    },
    ["x-transition"]: "",
  },
  ["select_item"]: {
    ["@mouseenter"]() {
      this.activeDescendant = this.i;
    },
    ["@click"]({ target }) {
      this.activeIndex = this.i;
      this.hide();
    },
    [":class"]: "isActive(i)",
    [":aria-selected"]: "activeIndex == i",
  },
});

export default Select;
