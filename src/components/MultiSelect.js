const MultiSelect = ({ hoverStyle = "", ...other }) => ({
  open: false,
  activeDescendant: -1,
  activeIndex: -1,
  items: [],
  selected: [],
  searchKey: null,
  ...other,

  init() {
    this.items = this.data;
    this.$watch("searchKey", (v) => {
      this.items = v
        ? this.data.filter(({ name }) =>
            name.toLowerCase().includes(v.toLowerCase())
          )
        : this.data;
      this.show();
    });
  },
  select(i) {
    if(this.selected.filter(e => e.id === i).length> 0) return;
    this.selected.push({id : i , ...this.data[i]});
    this.hide();
  },
  deselect(i){
    this.selected = this.selected.filter((e) => e.id !== i);    
  },
  show() {
    this.open = true;
  },
  toggle() {
    this.open = !this.open;
    this.open &&
      this.$nextTick(() => {
        this.$refs.search.focus();
      });
  },
  hide() {
    this.activeDescendant = -1;
    this.searchKey = "";
    this.$nextTick(() => {
      this.open = false;
      this.$refs.search.blur();
    });
  },
  isSelected(i){
    return this.selected.filter(e => e.id === i).length > 0 ;
  },
  isActive(index) {
    return this.activeDescendant == index ? hoverStyle : "";
  },
  ["select_control"]: {
    ["@click.stop"]() {
      this.toggle();
    },

    ["x-ref"]: "select_control",
  },
  ["search"]: {
    ["x-model"]: "searchKey",
    ["x-ref"]: "search",
    ["@keydown.escape"]() {
      this.hide();
    },
    [":aria-expanded"]: "open",
    ["@keydown.arrow-up.prevent"]() {
      if (!this.open) return;
      this.activeDescendant =
        this.activeDescendant - 1 < 0
          ? this.items.length - 1
          : this.activeDescendant - 1;
      this.$refs.select_menu
        .querySelectorAll('[role="option"]')
        [this.activeDescendant].scrollIntoView({
          block: "nearest",
        });
    },
    ["@keydown.arrow-down.prevent"]() {
      if (!this.open) return;
      this.activeDescendant =
        this.activeDescendant + 1 > this.items.length - 1
          ? 0
          : this.activeDescendant + 1;
      this.$refs.select_menu
        .querySelectorAll('[role="option"]')
        [this.activeDescendant].scrollIntoView({
          block: "nearest",
        });
    },
    ["@keydown.enter.prevent"]({ target }) {
      if (!this.open) return;
      if (this.activeDescendant === -1) return;
      const b = this.data.findIndex(
        (e) => e.name === this.items[this.activeDescendant].name
      );
      this.select(b);
    },
  },
  ["select_menu"]: {
    ["x-show"]: "open",
    ["x-ref"]: "select_menu",
    [":aria-activedescendant"]: "activeDescendant",
    [":aria-selected"]: "activeIndex",
    ["@mouseleave"]() {
      this.activeDescendant = -1;
    },
    ["@click.away"]() {
      this.hide();
    },
    ["x-transition"]: "",
  },
  ["select_item"]: {
    ["@mouseenter"]() {
      this.activeDescendant = this.i;
    },
    ["@click"]() {
      this.select(this.i);
    },
    [":class"]: "isActive(i)",
    [":aria-selected"]: "activeIndex == i",
  },
});

export default MultiSelect;
