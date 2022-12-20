const Dialog = () => ({
  open: false,
  continue: true,
  onCancel() {
    this.hide()
    this.continue = false;
  },
  hide(){
    this.open = false;
    this.$refs["dialog_control"].focus();
  },
  openDialog(){
    this.open = !this.open;
    this.open &&
      this.$nextTick(() => {
        this.$refs["dialog_panel"].focus();
      });
  },
  ["dialog_control"]: {
    ["x-ref"]: "dialog_control",
    ["aria-label"]:"cancel_btn",
    ["@click.prevent"] : "openDialog",
  },
  ["dialog_panel"]: {
    ["x-show"]: "open",
    ["x-ref"]: "dialog_panel",
    ["@click.away"] : "hide",
    ["@keyup.escape.prevent"] : "hide"
  },
  ["button_cancel"] : {
    ["@click"] : "onCancel"
  }
});






export default Dialog;