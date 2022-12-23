const Carousel = ({
  autoplay = false,
  infinite = false,
  slidePer = 1,
  skip = 0,
  dragable = false,
  gap = 0,
}) => ({
  skip: skip > slidePer ? slidePer : skip,
  active: 0,
  slidePer: slidePer,
  total: null,
  infinite: infinite,
  parentX: 0,
  drag: null,
  width: 0,
  gap,
  initialX: 0,
  dragable,
  xOffset: 0,
  xRange: null,
  interval: 3000,
  autoplay: autoplay,
  direction: "right",
  init() {
    this.$nextTick(() => {
      const slides = Array.from(this.$refs.slider.querySelectorAll("div"));
      const parent = this.$el;
      this.total = slides.length;
      this.parentX = parent.getBoundingClientRect().x;
      this.width = (parent.getBoundingClientRect().width / this.slidePer) + (this.gap/4*16);
      slides.forEach((v) => {
        v.style.width = `${(((this.width / this.slidePer ))/this.width * 100)}%`;
      });
      this.slider = this.$refs.slider;
      this.slider.style.gap = `${this.gap/4}rem`;
    });

    this.$watch("xOffset", (v) => {
      this.slider.style.transform = `translateX(${v}px)`;
    });

    if (this.autoplay) {
      this.play();
    }
  },

  get lastIndex(){
    const last = Math.floor(this.total / this.slidePer); ;
    const remain = this.total % this.slidePer;
    return remain === 0 ? (last * this.slidePer - this.slidePer  ) : (last * this.slidePer ) 
  },
  next(){
    if (!this.infinite && this.active === this.lastIndex) return;
    if (this.infinite && this.active === this.lastIndex) {
      this.xOffset = 0 * -this.width;
      this.active = 0;
      return;
    }
    this.xOffset = (this.active + 1 + this.skip) * -this.width;
    this.active = this.active + 1 + this.skip;
    this.slider.style.transition = `all ${300}ms`;
    setTimeout(() => {
      this.slider.style.transition = "";
    }, 300);
  },
  prev(){
    if (!this.infinite && this.active === 0) return;
    if (this.infinite && this.active === 0) {
      this.xOffset = this.lastIndex * -this.width;
      this.active = this.lastIndex;
      return;
    }
    this.xOffset = (-this.width*(this.active - 1 - skip));
    this.active = (this.active - 1 - skip);
    this.slider.style.transition = `all ${300}ms`;
    setTimeout(() => {
      this.slider.style.transition = "";
    }, 300);
  },
  to(active, delay = 300) {
    const x = -this.width * active;
    this.active = active;
    this.slider.style.transform = `translateX(${x}px)`;
    this.slider.style.transition = `all ${delay}ms`;
    setTimeout(() => {
      this.slider.style.transition = "";
    }, delay);
  },
  [":aria-selected"]: "active",
  ["next_btn"]: {
    ["@click.stop.throttle.100"]() {
      this.next();
    },
    ["x-show"]: "! ( !infinite && active === lastIndex)",
    [":aria-hidden"]: "! ( !infinite && active === lastIndex)",
  },
  ["prev_btn"]: {
    ["@click.stop.throttle.100"]() {
      this.prev();
    },
    ["x-show"]: "! (!infinite && active === 0)",
    [":aria-hidden"]: "! (!infinite && active === 0)",
  },
  ["slider_wrapper"]: {
    ["@mouseover"](){
        this.$el.style.cursor="pointer"
    },
    ["@mousedown.stop"](e) {
      if (!this.dragable) return;
      this.$el.style.cursor = "grabbing";
      this.drag = true;
      this.initialX = e.clientX - this.parentX - this.xOffset;
    },
    ["@resize.window"]({ target }) {
      this.width = this.$el.getBoundingClientRect().width;
      this.init();
      this.to(0);
    },
    ["@mousemove.window.stop"](e) {
      if (!this.drag) return;
      this.xOffset = e.clientX - this.initialX - this.parentX;
    },
    ["@mouseup.window"](e) {
      if (!this.dragable) return;
      if (!this.drag) return;
      const xRange = e.clientX - this.initialX - this.parentX;
      const offset = Math.abs(xRange % this.width);
      let activeFloor = Math.floor(-xRange / this.width);

      if (!this.activeFloor >= this.lastIndex || this.activeFloor < 0) {
        if (xRange < 0) {
          offset > this.width / 2 && activeFloor++;
        } else if (xRange > 0) {
          offset > this.width / 2 && activeFloor--;
        }
      } else {
        if (activeFloor >= this.total) {
          activeFloor = this.lastIndex;
        } else if (activeFloor < 0) {
          activeFloor = 0;
        }
      }
      this.to(activeFloor);
      this.xOffset = -this.width * this.active;
      this.drag = false;
    },
    ["@keydown.arrow-left"](){
        this.prev()
    },
    ["@keydown.arrow-right"](){
        this.next()
    }
  },

  play() {
    let interval = setInterval(() => {
      if (this.direction === "right") {
        this.next();
      }
      if (this.direction === "left") {
        this.prev();
      }
      // check if counter is equal to total and change direction to left
      if (this.active >= this.lastIndex) {
        this.direction = "left";
      }
      // check if counter is equal to 1 and change direction to right
      if (this.active <= 0) {
        this.direction = "right";
      }
    }, this.interval);
  },
});

export default Carousel;
