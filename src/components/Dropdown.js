const Dropdown = ({ open = false, data = [], hoverStyle="" }) => ({
  open,
  data,
  selected : null,
  activeIndex: -1,
  init(){

  },
  isActive(index){
    return this.activeIndex == index ? hoverStyle : ''
  },
  hide() {
    this.open = false;
    this.$refs.dropdown_control.focus();
  },
  ["dropdown_panel"]:{
    [":aria-active"] : "activeIndex",
    ["@keyup.escape.stop.prevent"] () {
        this.hide();
    },
    ["@keyup.space.stop.prevent"] () {
        this.selected.click();
        this.hide();
    },
    ["@keyup.tab.stop.prevent"] () {
        this.selected.click();
        this.hide();
    },
    ["@keyup.enter.stop.prevent"] () {
        this.selected.click()
        this.hide();
    },
    ["@keyup.up.prevent"]() {
        this.activeIndex >= 0 ? this.activeIndex -- : this.activeIndex= 6;
    }
    ,
    ["@keyup.down.prevent"]() {
        this.activeIndex <= 5 ? this.activeIndex++ : this.activeIndex = 0;
    },
    
  },
  ["dropdown_control"]: {
    ["@click"]() {
      this.open = !this.open;
      this.open && this.$nextTick(() => {
        this.$refs.dropdown_dialog.focus();
      });
    },
    [":aria-expanded"]: "open",
    ["x-ref"]: "dropdown_control",
   
  },
  ["dropdown_dialog"]: {
    ["x-show"]: "open",
    ["x-ref"] : "dropdown_dialog",
    ["@click.away"]() {
      this.hide();
    }
  },
  ["dropdown_item"]: {
    ["@mouseenter"]({ target }) {
      this.activeIndex = target.dataset.index;
      this.selected = target;
    },
    ["@click"]() {
      this.hide();
    },
    ["@mouseleave"]() {
      this.activeIndex = -1;
    },
  },
});


export default Dropdown;