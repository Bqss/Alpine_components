const Dropdown = ({ open = false, hoverStyle="", ...other }) => ({
  open,
  items : null,
  ...other,
  selected : null,
  activeIndex: -1,
  init(){
    this.$nextTick(() => {
        this.items = this.$el.querySelectorAll('[role="menuitem"]');
    });
    this.$watch("activeIndex",(v) => {
        this.selected = this.activeIndex != -1 ? this.items[v] : null
    })
    this.$watch("open",(v) => {
        v && (this.activeIndex = -1)
    })
  },
  isActive(index){
    return this.activeIndex == index ? hoverStyle : ''
  },
  hide() {
    this.open = false;
    this.$refs.dropdown_control.focus();
  },
  select(){
    if(this.selected){
        this.selected.click();
        this.hide();
    }
    return;
  },
  ["dropdown_container"]:{
    [":aria-active"] : "activeIndex",
    ["init"] : "init()",
    ["@keydown.escape.stop.prevent"] () {
        this.hide();
    },
    ["@keyup.space.stop.prevent"] () {
        this.select()
    },
    ["@keyup.tab.stop.prevent"] () {
        this.select()
    },
    ["@keyup.enter.stop.prevent"] () {
        this.select()
    },
    ["@keydown.up.prevent"]() {
        this.activeIndex > 0? this.activeIndex-- : (this.activeIndex = this.items.length-1);
    }
    ,
    ["@keydown.down.prevent"]() {
        this.activeIndex < this.items.length-1 ? this.activeIndex++ : this.activeIndex = 0;
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
  ["dropdown_panel"]: {
    ["x-show"]: "open",
    ["x-ref"] : "dropdown_dialog",
    ["@click.away"]() {
      this.hide();
    }
  },
  ["dropdown_item"]: {
    [":data-index"]: "i",
    ["@mouseenter"]({target}) {
      this.activeIndex = target.dataset.index;
    },
    [":class"] : "isActive(i)",
    ["@click"]() {
      this.hide();
    },
    [":aria-selected"]: "activeIndex === i",
    ["@mouseleave"]() {
      this.activeIndex = -1;
    },
  },
});


export default Dropdown;