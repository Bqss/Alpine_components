const Carousel = ({ autoplay = false, slidePer = 1 }) => ({
  skip: -1,
  active: 0,
  slidePer: slidePer,
  total: null,
  parentX: 0,
  drag: null,
  width: 0,
  initialX: 0,
  xOffset : 0,
  xRange : null ,
  interval: 3000,
  autoplay: autoplay,
  direction: "right",
  init() {
    this.$nextTick(() => {
      const slides = Array.from(this.$refs.slider.querySelectorAll("div"));
      const parent = this.$el;
      this.total = slides.length;
      this.parentX = parent.getBoundingClientRect().x;
      this.width = parent.getBoundingClientRect().width / this.slidePer;

      slides.forEach((v) => {
        v.style.width = `${100 / this.slidePer}%`;
      });
      this.slider = this.$refs.slider;
    });

    this.$watch("xOffset", (v) => {
      this.slider.style.transform = `translateX(${v}px)`;
    });
  

    if (this.autoplay) {
      this.play();
    }
  },
  to( active , delay = 300) {
    const x = -this.width * active;
    this.slider.style.transform = `translateX(${x}px)`
    this.slider.style.transition = `all ${delay}ms`;
    setTimeout(() => {
      this.slider.style.transition = "";
    }, delay);
  },
  ["slider_wrapper"]: {
    ["@mousedown"](e) {
      this.drag = true;
      this.initialX = e.clientX - this.parentX - this.xOffset;
    },
    ["@resize.window"]({ target }) {
      this.width = this.$el.getBoundingClientRect().width;
    },
    ["@mousemove.window.prevent"](e) {
      if (!this.drag) return;
      const currentX = e.clientX - this.initialX - this.parentX;
      this.xOffset = currentX;
    },
    ["@mouseup.window.prevent"](e) {
      if (!this.drag) return;
      const xRange  =  (e.clientX - this.initialX - this.parentX);
      const offset = Math.abs(xRange) % this.width;
      let activeFloor = Math.floor(Math.abs(xRange) / this.width);
      
      if(this.active != 0 || this.active !== this.total -1 ){
        if (xRange < 0) {
          offset > this.width / 2 && activeFloor++;
        } else if (xRange > 0) {
          offset > this.width / 2 && activeFloor--;
        }
      }
      this.xOffset = -this.width * activeFloor;
      this.active = activeFloor;
      this.to(activeFloor );
      this.drag = false;
    }
  },
  ["slide"]: {
    // ["x-intersect.threshold.30"]() {
    //     if(!this.drag ) return ;
    //     if(this.currentFLow === 'right' && (this.i - 1) % this.slidePer === 0){
    //         this.active = this.i - 1;
    //     }else if (this.currentFLow === "left") {
    //         console.log(this.i-1)
    //     }
    // },
  },
  play() {
    let counter = this.active;
    let interval = setInterval(() => {
      if (this.direction === "right") {
        this.next();
        counter++;
      }
      if (this.direction === "left") {
        this.prev();
        counter--;
      }
      // check if counter is equal to total and change direction to left
      if (counter == this.total) {
        this.direction = "left";
      }
      // check if counter is equal to 1 and change direction to right
      if (counter == this.active) {
        this.direction = "right";
      }
    }, this.interval);
  },
});

export default Carousel;
